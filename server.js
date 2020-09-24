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
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "hawksblood",
  store: new MongoStore({
    url: "mongodb://localhost:27017/be-kind-sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2
  }
}));


// ROUTES
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
app.use('/send', controllers.send);

app.listen(PORT, () => {
  console.log(`Now listening for requests on port ${PORT}`);
});
