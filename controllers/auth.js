// ANCHOR Modules and constants
// External Modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Internal Modules
const db = require('../models');

// Feedback Constants
const ACCOUNT_EXISTS_ERR = 'There is already an account with this email.';
const EMAIL_PW_ERR = 'ERROR: Email or password does not match.';
const INTERNAL_ERR = 'ERROR: Internal server error';





// ANCHOR ROUTES
// create account route
router.post('/sign-up', async (req, res) => {
  try {
    const foundUser = await db.User.exists({
      email: req.body.email
    });

    console.log('Found user exists: ' + foundUser);

    if (foundUser) return res.send({
      message: ACCOUNT_EXISTS_ERR
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    console.log('password hash: ' + req.body.password);

    const newUser = await db.User.create(req.body);

    console.log('New User: ' + newUser);

    if (req.session.heldMessage) {
      newUser.messages.push(req.session.heldMessage._id);
      await newUser.save();
      req.session.destroy();
    }

    res.redirect('/login')
  } catch (error) {
    res.send({
      message: INTERNAL_ERR + ': ' + error
    });
  }
});




// new login route
router.get('/login', (req, res) => {
  res.render('login');
});




// create login route
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
    res.send({
      message: INTERNAL_ERR + ': ' + error
    });
  }
});



// delete session route
router.delete("/logout", async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (error) {
    res.send({
      message: INTERNAL_ERR + ': ' + error
    });
  }
});


// ANCHOR exports
module.exports = router;
