const express = require('express');
const router = express.Router();

const db = require('../models');



// show profile route
router.get('/profile', (req, res) => {
  res.send('See profile');
})

module.exports = router;