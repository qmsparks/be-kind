const express = require('express');
const router = express.Router();

const db = require('../models');

// show profile route
router.get('/', async (req, res) => {
  try {
    const oneUser = await db.User.findById(req.session.currentUser.id);
    context = {
      user: oneUser
    }
    res.render('profile', context);
  } catch (error) {
    res.send({
      message: 'Error: ' + error
    });
  }
})


// ANCHOR update route
router.put('/', async (req, res) => {
  try {
    await db.User.findByIdAndUpdate(req.session.currentUser.id, req.body, { new: true });
    res.redirect('/profile');
  } catch (error) {
    res.send({
      message: 'Error: ' + error
    });
  }
})

// ANCHOR delete route
router.delete('/', async (req, res) => {
  try {
    const deletedUser = await db.User.findByIdAndDelete(req.session.currentUser.id);
    await db.Message.deleteMany({ user: deletedUser._id });
    await db.Nudge.deleteMany({ user: deletedUser._id });
    await req.session.destroy();
    res.redirect('/');
  } catch (error) {
    message: 'Error: ' + error
  }
})


module.exports = router;

