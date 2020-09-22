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
  db.User.findById(req.session.currentUser.id)
    .populate('nudges')
    .exec((err, foundUser) => {
      if (err) return res.send(err);

      const context = {
        user: foundUser
      };
      res.render('profile', context);
    })
})

// ANCHOR update route
router.put('/', async (req, res) => {
  try {
    await db.User.findByIdAndUpdate(req.session.currentUser.id, req.body, { new: true });
    res.redirect('/profile');
  } catch (error) {
    res.send({
      message: 'Error: ' + error
    });
  }
})

// ANCHOR delete route
router.delete('/', async (req, res) => {
  try {
    const deletedUser = await db.User.findByIdAndDelete(req.session.currentUser.id);
    await db.Message.deleteMany({ user: deletedUser._id });
    await db.Nudge.deleteMany({ user: deletedUser._id });
    await req.session.destroy();
    res.redirect('/');
  } catch (error) {
    message: 'Error: ' + error
  }
})


module.exports = router;

