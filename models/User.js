const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    // NOTE do not need this property until we're dealing with phones.
    // unique: true
  },
  password: {
    type: String,
    required: true
  },
  receiveDailyMessages: {
    type: Boolean,
    default: false
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  nudges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nudge'
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;