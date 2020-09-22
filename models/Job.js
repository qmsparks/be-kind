const mongoose = require('mongoose');
// const CronJob = require('cron').CronJob;
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  // nudge: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Nudge'
  // },
  job: {type: Object, required: true}
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;