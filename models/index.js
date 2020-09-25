const mongoose = require('mongoose');
require("dotenv").config();
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/be-kind';

const DB_CONNECTED_MSG = `Connected to the Be-Kind database at ${connectionString}`;
const DB_DISCONNECTED_MSG = `Disconnected from the Be-Kind database at ${connectionString}`;
const DB_ERROR_MSG = `Error connectiong to the Be-Kind database at ${connectionString}`;





mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(DB_CONNECTED_MSG);
}).catch((err) => {
    console.log(DB_ERROR_MSG + ': ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log(DB_DISCONNECTED_MSG);
});





module.exports = {
    User: require('./User'),
    Message: require('./Message'),
    Nudge: require('./Nudge'),
}