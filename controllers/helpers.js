// ANCHOR modules and constants
// External modules
const twilio = require('twilio');
const parser = require('cron-parser');
const { CronJob } = require('cron');

// Internal Modules
const db = require('../models');

// Constants and instanced modules
const TWILIO_USER = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(TWILIO_USER, TWILIO_TOKEN);





// ANCHOR Helper Functions
/**
 * @function sendMsg();
 * @description sends message using composeMsg as a helper.
 * @param {Message Object} message message object to be sent.
 */
const sendMsg = async message => {
    try {
        const user = await db.User.findById(message.user);
        new CronJob(message.cronString, function () {
            composeMsg(
                user.phone,
                message.content,
                TWILIO_PHONE
            );
        }).start();

        console.log(`Message was created on: ${message.updatedAt}`)
        console.log(`Message will execute at ${parseCron(message.cronString)}`);

    } catch (err) {
        console.log(err);
    }
}





/**
 * @function composeMsg()
 * @description composes the message to be sent using sendMsg.
 * @param {String} to phone number to send text to. 
 * @param {String} body content of message
 * @param {String} from phone number to send text from.
 */
const composeMsg = (to, body, from) => {
    try {
        client.messages.create({
            to: to,
            body: body,
            from: from
        });

        console.log(`Message reading "${body}" was sent to ${to} from ${from}.`);
    } catch (err) {
        console.log(err);
    }
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
 * and up to seven days after the message was created.
 * @param {String} cronValues 
 * @param {Number} daysAway
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





// ANCHOR Exported Modules
module.exports = {
    sendMsg: sendMsg,
    composeMsg: composeMsg,
    parseCron: parseCron,
    randomNumInRange: randomNumInRange,
    getCronValues: getCronValues,
    setCronJob: setCronJob,
    getDailyCronValues: getDailyCronValues,
    getRandomTimeOfDay: getRandomTimeOfDay,
    getRandomTimeOfWeek: getRandomTimeOfWeek
}