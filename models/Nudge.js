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
  sent: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  scheduled: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  });




const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;