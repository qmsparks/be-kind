const express = require('express');
const router = express.Router();


const db = require('../models');
const CronJob  = require('cron').CronJob;

// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);

    setCronJob(createdNudge);

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

// ANCHOR update
router.put('/:id', async (req, res) => {
  try {
    const updatedNudge = await db.Nudge.findByIdAndUpdate(req.params.id, req.body, {new: true});
    await updatedNudge.save();
    console.log(updatedNudge);
    res.redirect('/profile');
  } catch (err) {
    res.send(err);
  }
})

// ANCHOR  delete
router.delete('/:id', async (req, res) => {
  try {
    await db.Nudge.findByIdAndDelete(req.params.id);
    // TODO go back and wipe these from the user's array when they're deleted
    res.redirect('/profile');
  } catch (err) {
    res.send(err);
  } 
})




const setCronJob = (nudge) => {
  const cronString = getCronValues(nudge.scheduledFor);
  // const cronString = '* * * * * *'
  const job = new CronJob(cronString, async function() {
    try {
      const scheduledNudge = await db.Nudge.findByIdAndUpdate(nudge._id);
      if(scheduledNudge) {
        console.log(scheduledNudge.taskName);
      } else {
        job.stop();
      }
    } catch (error) {
      return console.log(error);
    }
  })
  job.start();
}


const getCronValues = (date) => {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
}


module.exports = router;