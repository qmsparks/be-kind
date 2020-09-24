// ANCHOR Modules and constants
// External Modules
const express = require('express');
const bcrypt = require('bcryptjs');

// Internal Modules
const db = require('../models');

// Instanced Modules
const router = express.Router();

// Constants
const ACCOUNT_EXISTS_ERR = 'There is already an account with this email.';
const EMAIL_PW_ERR = 'ERROR: Email or password does not match.';
const INTERNAL_ERR = 'ERROR: Internal server error';





// ANCHOR ROUTES
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});





router.post('/sign-up', async (req, res) => {
  try {
    const foundUser = await db.User.exists({
      email: req.body.email
    });

    if (foundUser) return res.send({
      message: ACCOUNT_EXISTS_ERR
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    const newUser = await db.User.create(req.body);

    if (req.session.heldMessage) {
      newUser.messages.push(req.session.heldMessage._id);
      await newUser.save();

      // FIXME needs to start cron job with message[0]
      req.session.destroy();
    }

    res.redirect('/login')
  } catch (error) {
    // FIXME Needs to render an actual page with error.
    res.send({
      message: error
    });
  }
});





router.get('/login', (req, res) => {
  res.render('login');
});





router.post('/login', async (req, res) => {
  try {
    const foundUser = await db.User.findOne({
      email: req.body.email
    });

    if (!foundUser) return res.send({
      message: EMAIL_PW_ERR
    });

    const match = await bcrypt
      .compare(req.body.password, foundUser.password);

    if (!match) return res.send({
      message: EMAIL_PW_ERR
    });

    req.session.currentUser = {
      name: foundUser.name,
      id: foundUser._id,
    }

    res.redirect('/profile')
  } catch (error) {
    // FIXME Needs to render an actual page.
    res.send({
      message: INTERNAL_ERR + ': ' + error
    });
  }
});





router.delete("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (err) {
    // FIXME needs to render an actual page.
    res.send({
      message: err
    });
  }
});





// ANCHOR exports
module.exports = router;
