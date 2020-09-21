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
  console.log('New nudge scheduled');
}

const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;