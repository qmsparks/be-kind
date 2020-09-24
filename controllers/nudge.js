const express = require('express');
const twilio = require('twilio');
const parser = require('cron-parser');
const router = express.Router();


const db = require('../models');
const CronJob  = require('cron').CronJob;


// Constants
const TWILIO_USER = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(TWILIO_USER, TWILIO_TOKEN);


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
    const user = await db.User.findById(req.session.currentUser.id);
    await user.nudges.pull(req.params.id);
    user.save();
    await db.Nudge.findByIdAndDelete(req.params.id);
    
    res.redirect('/profile');
  } catch (err) {
    res.send(err);
  } 
})



// ANCHOR helper functions


const setCronJob = function(nudge) {
  const cronString = (getCronValues(nudge.scheduledFor));
  console.log(cronString);
  const id = nudge._id;
  const job = new CronJob(cronString, async function() {
    try {
     
      console.log('checking if the nudge exists');
      const scheduledNudge = await db.Nudge.findById(id);
      if(scheduledNudge) {
        const user = await db.User.findById(scheduledNudge.user);
        composeMsg(user.phone, 
          scheduledNudge.content, 
          TWILIO_PHONE);
      } else {
        job.stop();
      }
    } catch (error) {
      return console.log(error);
    }
  })
  console.log('starting job');
  job.start();
}

const getCronValues = (date) => {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  // return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
  return `${minute} ${hour} * * *`
}


/**
* @function composeMsg()
* @description composes the message to be sent using sendMsg.
* @param {String} to phone number to send text to. 
* @param {String} body content of message
* @param {String} from phone number to send text from.
*/
const composeMsg = (to, body, from) => {
  try {
      client.messages.create({
          to: to,
          body: body,
          from: from
      });
      console.log(`Message reading "${body}" was sent to ${to} from ${from}.`);
  } catch (err) {
      console.log('ERROR: ' + err);
  }
}






module.exports = router;