const mongoose = require('mongoose');
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
  scheduledFor: {
    type: Date,
    // NOTE temporarily commenting this property out in order to do some testing.
    // will add back in once we get to the texting part.
    // required: true
  }
}, {
  timestamps: true
});

const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;