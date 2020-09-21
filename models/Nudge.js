const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
const Schema = mongoose.Schema;

const nudgeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  taskName: {
    type: String,
    required: true
  },
  taskDescription: String,
  sent: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date,
    // NOTE temporarily commenting this property out in order to do some testing.
    // will add back in once we get to the texting part.
    // required: true
  }
}, {
  timestamps: true
});

nudgeSchema.methods.scheduleNudge = function() {
  console.log('New nudge schedule for: ');
  const cronString = getCronValues(this.scheduledFor);
  console.log(cronString);
  const job = new CronJob(cronString, () => {
    console.log(this.taskName);
  })
  // console.log(job);
  // job.start();
}


/**
 * @function getCronValues()
 * @description returns a cron string from date passed in
 * @param {Date object} date any Date object. 
 */
const getCronValues = (date) => {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
}



const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;