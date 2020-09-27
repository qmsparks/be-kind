// ANCHOR Modules and constants
// External Modules
const express = require('express');

// Internal Modules
const helper = require('./helpers');
const db = require('../models');

// Instanced Modules
const router = express.Router();





// FIXME adds nudge to board but need to sort nudges so they appear in order
// regardless of when they were created.
// nudge create route
router.post('/', async (req, res) => {
    try {
        req.body.user = req.session.currentUser.id;
        req.body.scheduledFor = helper.convertToDate(req.body.scheduledFor);

        const createdNudge = await db.Nudge.create(req.body);
        helper.setCronJob(createdNudge);

        const currentUser = await db.User.findById(createdNudge.user);
        currentUser.nudges.push(createdNudge._id);
        await currentUser.save();
        res.redirect('/new-profile');
    } catch (error) {
        console.log(error);
    }
});



// nudge get route
router.get('/', async (req, res) => {
    try {
        const currentUser = await db.User.findById(req.session.currentUser.id);
        const userNudges = [];

        for (let i = 0; i < currentUser.nudges.length; i++) {
            let nudge = await db.Nudge.findById(currentUser.nudges[i]);
            userNudges.push(nudge);
        }
        console.log(userNudges);

        const context = {
            user: currentUser,
            nudges: userNudges,
        }
        res.render('profile-new', context);
    } catch (error) {
        console.log(error);
    }
});



// Delete Route
router.delete('/:id', async (req, res) => {
    try {
        const user = await db.User.findById(req.session.currentUser.id);
        await user.nudges.pull(req.params.id);
        user.save();
        await db.Nudge.findByIdAndDelete(req.params.id);

        res.redirect('/new-profile');
    } catch (err) {
        res.send(err);
    }
});


module.exports = router;
