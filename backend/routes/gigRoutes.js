
const express = require('express');
const { createGig, getGigs, getGigById, getMyGigs } = require('../controllers/gigController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createGig) 
  .get(getGigs);             


router.route('/:id')
  .get(getGigById);

router.route('/mine').get(protect, getMyGigs);

module.exports = router;