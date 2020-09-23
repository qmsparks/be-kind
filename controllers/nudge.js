const express = require('express');
const router = express.Router();


const db = require('../models');
const CronJob  = require('cron').CronJob;
// create 
router.post('/', async (req, res) => {
  try {
    const createdNudge = await db.Nudge.create(req.body);
    createdNudge.getCronString();
    await createdNudge.save();

    setJob(createdNudge);

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

    // const nudgeToDelete = await db.Nudge.findById(req.params.id);
    // console.log('logged from the delete route, before deleting', nudgeToDelete);

    // nudgeToDelete.job.stop();

    await db.Nudge.findByIdAndDelete(req.params.id);
    // TODO go back and wipe these from the user's array when they're deleted
    res.redirect('/profile');
  } catch (err) {
    res.send(err);
  } 
})

const setJob = async function(nudge) {
  try {
  const taskName = nudge.taskName;
  const taskDescription = nudge.taskDescription;
  const cronString = nudge.cronString;

  const cron = {
    testString: 'hewwo?',
    job: function() {
      const job = new CronJob(cronString, function() {
        console.log(taskName);
        if (taskDescription) console.log(taskDescription);
      })
    }
  }
  db.Job.create({'cron': cron});
  } catch (error) {
    console.log(error);
  }
}



module.exports = router;