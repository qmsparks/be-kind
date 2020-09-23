// ANCHOR Modules and Constants
// External Modules
const express = require('express');
const twilio = require('twilio');
const parser = require('cron-parser');
const { CronJob } = require('cron');

// Internal Modules
const db = require('../models');

// Instanced Modules 
const router = express.Router();

const user = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const clientPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(user, token);



// ANCHOR Routes
// create and push message to user messages
router.post('/', async (req, res) => {
    const loggedIn = req.session.currentUser.id ? true : false;
    req.body.user = loggedIn ? req.session.currentUser.id : undefined;

    const message = await db.Message.create(req.body);
    const createDate = getCronValues(message.updatedAt);
    const cronString = await getRandomTimeOfWeek(createDate);
    message.cronString = cronString;

    if (!loggedIn) {
        req.session.heldMessage = message;
        res.render('sign-up');
    } else {
        try {
            db.User.findByIdAndUpdate(
                message.user,
                {
                    $push: {
                        messages: message
                    },
                }, (err, updatedItem) => {
                    if (err) return res.send(err);

                    res.render('profile', {
                        user: updatedItem
                    });
                });

            startCronJob(message);

        } catch (error) {
            console.log(error + ': Internal server error!');
        }
    }
});






const startCronJob = async message => {
    try {
        const user = await db.User.findById(message.user);
        const job = new CronJob('13 13 23 8 3', function () {
            composeMsg(
                user.phone,
                message.content,
                clientPhone
            );
        })

        job.start();

        console.log(`Message was created at/on: ${message.updatedAt}`)
        console.log(`Message will execute at ${parseCron('13 13 23 8 3')}`);

    } catch (err) {
        console.log(err);
    }
}



// ANCHOR Helper Functions
const composeMsg = async (to, body, from) => {
    try {
        const message = await client.messages.create({
            to: to,
            body: body,
            from: from
        });
        console.log(`Message reading "${body}" was sent to ${to} from ${from}.`);
        console.log(`Message SID: ${message.sid}`);
    } catch (err) {
        console.log('ERROR: ' + err);
    }
}





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




const parseCron = expression => {
    let dateItems = expression.split(' ')
        .map(item => parseInt(item));
    dateItems[3] += 1;

    dateItems = dateItems.join(' ');

    try {
        const interval = parser.parseExpression(dateItems);
        return `Date: ${interval.next().toString()}`;
    } catch (err) {
        console.log(err);
    }
}

// const schedule = async (user, message = true) => {
//     let currentTransmission;

//     try {
//         if (message) {
//             for (let i = 0; i < user.messages.length; i++) {
//                 currentTransmission = await db.Message.findById(user.messages[i]);
//                 if (!currentTransmission.sent) {
//                     break;
//                 }
//             }
//         } else {
//             for (let i = 0; i < user.nudges.length; i++) {
//                 currentTransmission = await db.Nudge.findById(user.nudges[i]);
//                 if (!currentTransmission.sent) {
//                     break;
//                 }
//             }
//         }

//         const job = new CronJob('* * * * * *', () => {
//             console.log('A message has been logged');
//             // sendMessage(currentTransmission.content);
//         });
//         job.start();
//     } catch (error) {
//         console.log(error);
//     }
// }




// ANCHOR Exports
module.exports = router;