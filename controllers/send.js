const express = require('express');
const router = express.Router();
const CronJob = require('cron').CronJob;
const db = require('../models');


// ANCHOR routes
router.post('/message', async (req, res) => {
    if (!req.session.currentUser) return res.redirect('login');

    const user = await db.User.findById(req.session.currentUser.id);
    console.log(user);
    try {
        schedule(user, true);
    } catch (error) {
        res.send({
            message: error
        })
    }
})


// ANCHOR Helper Functions
const sendMessage = (cronValues, content) => {
    console.log(content);
}



/**
 * @function randomNumInRange()
 * @description returns a random number within a specified range.
 * @param {Integer} min minimum number in range 
 * @param {Integer} max maximum number in range 
 */
const randomNumInRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}




/**
 * @function getCronValues()
 * @description returns a cron string from date passed in
 * @param {Date object} date any Date object. 
 */
const getCronValues = (date) => {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
}



/**
 * @function getRandomTimeOfDay()
 * @description generates a cron string that will run every day at a random hour
 */
const getRandomTimeOfDay = () => {
    const minute = randomNumInRange(0, 59);
    const hour = randomNumInRange(9, 18);
    return `${minute} ${hour} * * *`;
}




/**
 * @function getRandomTimeOfWeek()
 * @description returns a cron string that represents a random time between when a message was created
 * and seven days after the message was created.
 * @param {*} cronValues 
 */
const getRandomTimeOfWeek = (cronValues) => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const valNums = cronValues.split(' ').map(val => parseInt(val));
    const createDate = valNums[2];
    const createDay = valNums[4];
    const daysInMonth = days[valNums[3] - 1];
    const daysFromSend = Math.floor(Math.random() * 7);


    if ((createDate + daysFromSend) > daysInMonth) {
        valNums[2] = (createDate + daysFromSend) - daysInMonth;
        valNums[3] += 1;
    } else {
        valNums[2] = createDate + daysFromSend;
    }

    if ((createDay + daysFromSend) > 6) {
        valNums[4] = (createDay + daysFromSend) - 6;
    } else {
        valNums[4] = createDay + daysFromSend;
    }

    valNums[0] = randomNumInRange(0, 59);
    valNums[1] = randomNumInRange(9, 17);

    return valNums.join(' ');
}



const schedule = async (user, message = true) => {
    let currentTransmission;

    try {
        if (message) {
            for (let i = 0; i < user.messages.length; i++) {
                currentTransmission = await db.Message.findById(user.messages[i]);
                if (!currentTransmission.sent) {
                    break;
                }
            }
        } else {
            for (let i = 0; i < user.nudges.length; i++) {
                currentTransmission = await db.Nudge.findById(user.nudges[i]);
                if (!currentTransmission.sent) {
                    break;
                }
            }
        }

        const job = new CronJob('* * * * * *', () => {
            console.log('A message has been logged');
            sendMessage(currentTransmission.content);
        });

        job.start();
    } catch (error) {
        console.log(error);
    }
}


module.exports = router;