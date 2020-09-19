const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const ACCOUNT_EXISTS_MSG = 'There is already an account with this email.'

const db = require('../models');

router.post('/message', (req, res) => {
    var message = req.body.message;
    res.render('sign-up', {
        myMessage: message
    });
});

router.post('/sign-up', async (req, res) => {
    try {
        const foundUser = await db.User.exists({ email: req.body.email });
        if (foundUser) return res.send({ message: 'Account already exists' });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        await db.User.create(req.body);

        res.redirect('/login')
    } catch (error) {
        res.send({ message: 'Internal server error' });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;