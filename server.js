// ANCHOR modules and configuration
// external modules
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// internal modules
const controllers = require('./controllers');

// Instanced modules
const app = express();

// configuration
require("dotenv").config()
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');





// ANCHOR Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/be-kind-sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2
  }
}));





// ANCHOR routes
app.get('/about', (req, res) => {
  res.render('about', {
    user: req.session.currentUser
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    user: req.session.currentUser
  });
});

app.get('/', (req, res) => {
  res.render('index', {
    user: req.session.currentUser
  });
});

app.use('/', controllers.auth);
app.use('/messages', controllers.message);
app.use('/nudges', controllers.nudge);
app.use('/profile', controllers.profile);






// ANCHOR start server
app.listen(PORT, () => {
  console.log(`Now listening for requests on port ${PORT}`);
});
