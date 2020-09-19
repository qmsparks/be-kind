const express = require('express');
const router = express.Router();

const db = require('../models');

router.post('/message', (req, res) => {
    const user = req.session;
    console.log(user);
    var message = req.body.message;

    if (!user) {
        console.log('No User');
        return;
    } else if (user) {
        console.log('User exists');
        return;
    }
    // db.Message.create
    // res.render('sign-up', {
    //     myMessage: message
    // });
});

module.exports = router;