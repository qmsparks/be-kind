const express = require('express');
const router = express.Router();


const db = require('../models');

// create 
// NOTE I think I'll need to utilize sessions to get this created nudge to actually appear on the profile calendar, based on the way fullcalendar displays events
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