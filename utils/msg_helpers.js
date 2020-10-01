const { CronJob } = require('cron');
const twilio = require('twilio');

const { parseCron } = require('./cron_helpers')
const db = require('../models')

const TWILIO_USER = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(TWILIO_USER, TWILIO_TOKEN);



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


module.exports = { sendMsg, composeMsg }