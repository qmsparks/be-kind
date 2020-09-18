const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const controllers = require('./controllers');
const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// auth routes
app.use('/', controllers.auth);

// message routes
app.use('/messages', controllers.message);

// nudge routes
app.use('/nudges', controllers.nudge);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Now listening for requests on port ${PORT}`);
});
