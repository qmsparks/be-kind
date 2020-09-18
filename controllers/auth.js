const express = require('express');
const router = express.Router();

const db = require('../models');

router.post('/message', (req, res) => {
    var message = new String(req.body.message);
    res.render('sign-up', {
        message: message
    })
});

// show profile route
router.get('/profile', (req, res) => {
    res.send('See profile');
})

module.exports = router;