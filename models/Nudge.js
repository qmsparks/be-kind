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
    required: true
  },
  cronString: String,
  job: {type: Object, default: {}}
}, {
  timestamps: true
});

nudgeSchema.methods.getCronString = function() {
  // this.cronString = getCronValues(this.scheduledFor);
  this.cronString = '* * * * * *';
}

// nudgeSchema.methods.setCronJob = function() {
//   const taskName = this.taskName;
//   const taskDescription = this.taskDescription;
//   job = new CronJob(this.cronString, function(){
//     console.log(taskName);
//     if(taskDescription) console.log(taskDescription);
//   });
//   // return job;
// }



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
  return `${minute} ${hour} * * *`
}

const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;