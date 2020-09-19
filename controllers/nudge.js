const express = require('express');
const router = express.Router();

// const renderEvent = require('../public/js/nudgeboard');
const db = require('../models');

// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);
    const currentUser = await db.User.findById(req.session.currentUser.id);
    currentUser.nudges.push(createdNudge._id);
    await currentUser.save();
    res.redirect('/profile');
  } catch (error) {
    res.send(error);
  }
});

// TODO read 

// TODO update

// TODO  delete


module.exports = router;