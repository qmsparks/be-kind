const express = require('express');
const router = express.Router();


const db = require('../models');
const { response } = require('express');
const { findByIdAndUpdate } = require('../models/User');

// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);
    createdNudge.scheduleNudge();
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
  db.User.findById(req.session.currentUser.id).populate('nudges').exec( (err, currentUser) =>{
    if(err) return res.send(err);

    context = {userNudges: currentUser.nudges}
    res.json(context);
  })
})

// TODO update
router.put('/:id', async (req, res) => {
  try {
    // res.send(req.body);
    const updatedNudge = db.Nudge.findByIdAndUpdate(req.params.id, req.body, {new: true});
    await (await updatedNudge).save();
    console.log(updatedNudge);
    res.redirect('/profile');
  } catch (err) {
    res.send(err);
  }
})

// TODO  delete


module.exports = router;