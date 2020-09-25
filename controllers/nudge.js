const express = require('express');
const helper = require('./helpers');
const router = express.Router();


const db = require('../models');



// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);
    helper.setCronJob(createdNudge);

    const currentUser = await db.User.findById(req.session.currentUser.id);
    currentUser.nudges.push(createdNudge._id);
    await currentUser.save();
    res.redirect('/profile');
  } catch (error) {
    res.send({
      message: 'Error: ' + error
    });
  }
});


// hand nudge information to javascript
router.get('/api', (req, res) => {
  db.User.findById(req.session.currentUser.id)
    .populate('nudges')
    .exec((err, currentUser) => {
      if (err) return res.send(err);

      context = { userNudges: currentUser.nudges }
      res.json(context);
    });
});

// ANCHOR update
router.put('/:id', async (req, res) => {
  try {
    const updatedNudge = await db.Nudge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await updatedNudge.save();
    res.redirect('/profile');

  } catch (err) {
    res.send(err);
  }
})

// ANCHOR  delete
router.delete('/:id', async (req, res) => {
  try {
    const user = await db.User.findById(req.session.currentUser.id);
    await user.nudges.pull(req.params.id);
    user.save();
    await db.Nudge.findByIdAndDelete(req.params.id);

    res.redirect('/profile');
  } catch (err) {
    res.send(err);
  }
});


module.exports = router;