
const express = require('express');
const { createGig, getGigs } = require('../controllers/gigController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createGig) 
  .get(getGigs);             

module.exports = router;