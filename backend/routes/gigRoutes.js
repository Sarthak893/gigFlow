
const express = require('express');
const { createGig, getGigs, getGigById, getMyGigs } = require('../controllers/gigController');
const { protect } = require('../middleware/auth');
const { getBidsForGig, hireFreelancer } = require('../controllers/bidController');

const router = express.Router();


router.route('/')
  .post(protect, createGig) 
  .get(getGigs);             

router.route('/mine').get(protect, getMyGigs);

router.route('/:id')
  .get(getGigById);



router.route('/:id/bids')
  .get(protect, getBidsForGig);

router.route('/:id/hire')
  .patch(protect, hireFreelancer);


module.exports = router;