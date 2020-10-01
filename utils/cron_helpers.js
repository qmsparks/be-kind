const parser = require('cron-parser');
const { CronJob } = require('cron');

const { composeMsg } = require('./msg_helpers');
const db = require('../models');

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;


/**
 * @function randomNumInRange()
 * @description returns a random number within a specified range.
 * @param {Number} min minimum number in range 
 * @param {Number} max maximum number in range 
 */
const randomNumInRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}




/**
 * @function parseCron()
 * @description parses a cron expression into a date string.
 * @param {String} expression cron expression to be parsed.
 */
const parseCron = expression => {
    let dateItems = expression.split(' ')
        .map(item => parseInt(item));
    dateItems[3];

    dateItems = dateItems.join(' ');

    try {
        const interval = parser.parseExpression(dateItems);
        return `Date: ${interval.next().toString()}`;
    } catch (err) {
        console.log(err);
    }
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
 * @function setCronJob()
 * @description sets a new CronJob for individual nudges.
 * @param {Nudge Object} nudge 
 */
const setCronJob = function (nudge) {
    const cronString = (getDailyCronValues(nudge.scheduledFor));
    const id = nudge._id;
    const job = new CronJob(cronString, async function () {
        try {
            const scheduledNudge = await db.Nudge.findById(id);
            if (scheduledNudge) {
                const user = await db.User.findById(scheduledNudge.user);

                composeMsg(user.phone,
                    scheduledNudge.content,
                    TWILIO_PHONE);

            } else {
                job.stop();
            }
        } catch (error) {
            return console.log(error);
        }
    });
    console.log('starting job');
    job.start();
}




/**
 * @function getDailyCronValues()
 * @description converts date object into a daily CronString
 * @param {Date Object} date 
 */
const getDailyCronValues = (date) => {
    const minute = date.getMinutes();
    const hour = date.getHours();
    return `${minute} ${hour} * * *`
}




/**
 * @function getRandomTimeOfDay()
 * @description generates a cron string that will run 
 * every day at a random hour
 */
const getRandomTimeOfDay = () => {
    const minute = randomNumInRange(0, 59);
    const hour = randomNumInRange(9, 18);
    return `${minute} ${hour} * * *`;
}





/**
 * @function getRandomTimeOfWeek()
 * @description returns a cron string that represents 
 * a random time between when a message was created
 * and seven days after the message was created.
 * @param {String} cronValues 
 */
const getRandomTimeOfWeek = (cronValues, daysAway) => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const valNums = cronValues.split(' ').map(val => parseInt(val));
    const createDate = valNums[2];
    const createDay = valNums[4];
    const daysInMonth = days[valNums[3] - 1];
    const daysFromSend = daysAway === 1 ? 1 : Math.ceil(Math.random() * daysAway);

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




module.exports = {
    parseCron,
    randomNumInRange,
    getCronValues,
    setCronJob,
    getDailyCronValues,
    getRandomTimeOfDay,
    getRandomTimeOfWeek,
}
