const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nudgeSchema = new Schema({

});

const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;