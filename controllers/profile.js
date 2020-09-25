// ANCHOR Modules and Constants
// External Modules
const express = require('express');

// Internal Modules
const db = require('../models');

// Instanced Modules
const router = express.Router();





// ANCHOR Profile Routes
// Show Route
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
});





// Update Route
router.put('/', async (req, res) => {
  try {
    await db.User.findByIdAndUpdate(
      req.session.currentUser.id,
      req.body,
      { new: true }
    );
    res.redirect('/profile');

  } catch (error) {
    res.send({
      message: 'Error: ' + error
    });
  }
});


<<<<<<< HEAD



=======



>>>>>>> thunderhawk
// Delete Route
router.delete('/', async (req, res) => {
  try {
    const deletedUser = await db.User.findByIdAndDelete(req.session.currentUser.id);
    await db.Message.deleteMany({ user: deletedUser._id });
    await db.Nudge.deleteMany({ user: deletedUser._id });
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('profile');
  }
});


<<<<<<< HEAD



// ANCHOR Exported Modules
module.exports = router;
=======


>>>>>>> thunderhawk

// ANCHOR Exported Modules
module.exports = router;