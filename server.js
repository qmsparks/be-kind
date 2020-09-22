// EXTERNAL MODULES
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const CronJob = require('cron').CronJob;

// INTERNAL MODULES
const controllers = require('./controllers');
const db = require('./models');

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

// const startCronJobs = async function() {
//   console.log('Scheduling cron jobs on server start');
//   const allNudges = await db.Nudge.find({});
//   const unsentMessages = await db.Message.find({sent: false});

//   allNudges.forEach(nudge => {
//     const job = new CronJob(nudge.cronString, () => {
//       console.log(nudge.taskName);
//     })
//     job.start();
//   });

//   // TODO
//   unsentMessages.forEach(message => {
//     console.log('Now starting job based on previously calculated schedule')
//   })
// }


// const checkJobs = new CronJob('* * * * *', async () => {

// })



// ROUTES
app.get('/', (req, res) => {
  res.render('index', { user: req.session.currentUser });
});
app.use('/', controllers.auth);
app.use('/messages', controllers.message);
app.use('/nudges', controllers.nudge);
app.use('/profile', controllers.profile);
app.use('/send', controllers.send);

app.listen(PORT, () => {
  // startCronJobs();
  console.log(`Now listening for requests on port ${PORT}`);
});
