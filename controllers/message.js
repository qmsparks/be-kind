const express = require('express');
const router = express.Router();

const db = require('../models');

router.post('/message', (req, res) => {
    var message = req.body.message;
    db.Message.create
    res.render('sign-up', {
        myMessage: message
    });
});

module.exports = router;