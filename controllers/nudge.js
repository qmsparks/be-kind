const express = require('express');
const router = express.Router();


const db = require('../models');
const { response } = require('express');

// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);
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
router.put('/:id', (req, res) => {
  res.send('Update nudge');
})

// TODO  delete


module.exports = router;