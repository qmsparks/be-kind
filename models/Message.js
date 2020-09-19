const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  // receivedDaily: Boolean,
  // sent: { type: Boolean, default: false },
  // scheduledFor: Date
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;