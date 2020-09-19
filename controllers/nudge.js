const express = require('express');
const router = express.Router();

// const renderEvent = require('../public/js/nudgeboard');
const db = require('../models');

// create 
router.post('/', async (req, res) => {
  try {
    console.log(req.body.user);
    
    res.redirect('/profile');
  } catch (error) {
    res.send(error);
  }
});

// TODO read 

// TODO update

// TODO  delete


module.exports = router;