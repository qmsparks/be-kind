const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/be-kind';

const CONNECTED = `Connected to the Be-Kind database at ${connectionString}`;
const DISCONNECTED = `Disconnected from the Be-Kind database at ${connectionString}`;
const CONNECTION_ERROR = `Error connectiong to the Be-Kind database at ${connectionString}`;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('', () => {
    console.log(`Connected to the Be-Kind database using mongoDB`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Connected to the Be-Kind database using mongoDB: \n\t${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log(`disconnected from the Be-Kind database`);
});

module.exports = {
    User: require('./User'),
    Message: require('./Message'),
    Nudge: require('./Nudge')
}