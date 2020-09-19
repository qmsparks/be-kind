// EXTERNAL MODULES
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// INTERNAL MODULES
const db = require('../models');

// FEEDBACK MESSAGES
const ACCOUNT_EXISTS_MSG = 'There is already an account with this email.';
const EMAIL_PW_MSG = 'Error: Email or password does not match.';



// ROUTES
router.post('/sign-up', async (req, res) => {
    try {
        const foundUser = await db.User.exists({ email: req.body.email });
        if (foundUser) return res.send({ message: ACCOUNT_EXISTS_MSG });

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




router.post('/login', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ email: req.body.email });
        if (!foundUser) return res.send({ message: EMAIL_PW_MSG });

        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (!match) return res.send({ message: EMAIL_PW_MSG });

        req.session.currentUser = {
            name: foundUser.name,
            id: foundUser._id,
        }
        res.redirect("/")
    } catch (error) {
        res.send({ message: 'Internal server error' });
    }
});




router.delete("/logout", async function (req, res) {
    await req.session.destroy();
    res.redirect("/");
});




router.get('/profile', async (req, res) => {
    console.log(req.session.currentUser);
    try {
        const oneUser = await db.User.findById(req.session.currentUser.id);
        context = {
            user: oneUser
        }
        res.render('profile', context);
    } catch (error) {
        res.send('Internal error', error);
    }
})

module.exports = router;