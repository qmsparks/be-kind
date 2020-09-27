// ANCHOR Modules and constants
// External Modules
const express = require('express');

// Internal Modules
const helper = require('./helpers');
const db = require('../models');

// Instanced Modules
const router = express.Router();





// nudge create route
router.post('/', async (req, res) => {
    try {
        const createdNudge = await db.Nudge.create(req.body);
        helper.setCronJob(createdNudge);

        const currentUser = await db.User.findById(req.session.currentUser.id);
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
        const currentUser = await db.User.findById(req.ression.currentUser.id);
        res.render('/new-profile', {
            user: currentUser
        });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
