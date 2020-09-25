// ANCHOR Modules and Constants
// External Modules
const express = require('express');

// Internal Modules
const helper = require('./helpers');
const db = require('../models');

// Instanced Modules 
const router = express.Router();





// ANCHOR Routes
// create and push message to user messages
router.post('/', async (req, res) => {
    const loggedIn = req.session.currentUser === undefined ? false : true;
    req.body.user = loggedIn ? req.session.currentUser.id : undefined;

    const message = await db.Message.create(req.body);
    const createDate = helper.getCronValues(message.updatedAt);
    const cronString = helper.getRandomTimeOfWeek(createDate, 1);
    message.cronString = cronString;

    if (!loggedIn) {
        req.session.heldMessage = message;
        res.render('sign-up');
    } else {
        try {
            await db.User.findByIdAndUpdate(
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

            helper.sendMsg(message);

        } catch (error) {
            console.log(error);
        }
    }
});





// ANCHOR Exports
module.exports = router;