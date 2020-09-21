// ANCHOR Modules and Constants
// External Modules
const express = require('express');
const router = express.Router();

// Internal Modules
const db = require('../models');



router.post('/send', async (req, res) => {
    // declare new cronJob
})

// ANCHOR Routes
// create and push message to user messages
router.post('/', async (req, res) => {
    const user = req.session.currentUser;

    if (!user) {
        const newMessage = await db.Message.create(req.body);
        req.session.heldMessage = newMessage;

        res.render('sign-up', {
            myMessage: req.session.heldMessage
        });
    } else {
        try {
            req.body.user = user.id;
            const message = await db.Message.create(req.body);
            console.log(message);

            db.User.findByIdAndUpdate(
                message.user,
                {
                    $push: {
                        messages: message
                    }
                }, (err, updatedItem) => {
                    if (err) return res.send(err);
                    console.log(updatedItem);
                    res.render('profile', {
                        user: updatedItem
                    });
                });
            await currentUser.save();
        } catch (error) {
            res.send({
                message: 'Error: ' + error
            })
        }
    }
});




// ANCHOR Helper Functions
/**
 * @function schedule()
 * @description: schedules a message for sending returns CronJob??
 * @param {Message _id} messageId - message object pulled from database 
 */
const schedule = (message) => {
    // const messageBirthday = message.createdAt
    // const owner = find message owner with message.user
    // check if owner has sendDailyMessages as true.
    // if yes, schedule for random time the next day 
}


// ANCHOR Exports
module.exports = router;