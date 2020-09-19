// EXTERNAL MODULES
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// INTERNAL MODULES
const controllers = require('./controllers');

// INSTANCED MODULES
const app = express();

// CONFIGURATION
const PORT = 3000;
app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "hawksblood",
    store: new MongoStore({
        url: "mongodb://localhost:27017/be-kind-sessions",
    }),
    cookie: {
        // milliseconds
        // 1000 (one second) * 60 (one minute) * 60 (one hour) * 24 (one day) * 7 (one week) * 2
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    }
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// views route
app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.currentUser
    });
});

// auth routes
app.use('/', controllers.auth);

// message routes
app.use('/messages', controllers.message);

// nudge routes
app.use('/nudges', controllers.nudge);



app.listen(PORT, () => {
    console.log(`Now listening for requests on port ${PORT}`);
});
