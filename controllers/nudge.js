const express = require('express');
const router = express.Router();

// const renderEvent = require('../public/js/nudgeboard');
const db = require('../models');

// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);
  } catch (error) {
    res.send(error);
  }
  res.redirect('/profile');
});

// TODO read 

// TODO update

// TODO  delete


module.exports = router;