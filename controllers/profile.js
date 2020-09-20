const express = require('express');
const router = express.Router();

const db = require('../models');

// NOTE temporarily replaced by route at next note || show profile route
// router.get('/profile', async (req, res) => {
//   console.log(req.session.currentUser);
//   try {
//     const oneUser = await db.User.findById(req.session.currentUser.id);
//     context = {
//       user: oneUser
//     }
//     res.render('profile', context);
//   } catch (error) {
//     res.send('Internal error', error);
//   }
// })

// NOTE temporariily living in callback hell until I can figure out how to populate nudges using async/await
router.get('/', (req, res) => {
  db.User.findById(req.session.currentUser.id).populate('nudges').exec( (err, foundUser) => {
    if (err) return res.send(err);

    const context = {
      user: foundUser
    };
    res.render('profile', context);
  })
})


module.exports = router;

