
const express = require('express');
const { placeBid, getBidsForGig, hireFreelancer } = require('../controllers/bidController');
const { protect } = require('../middleware/auth');
const { getMyGigs } = require('../controllers/gigController');

const router = express.Router();

router.route('/')
  .post(protect, placeBid);

router.route('/gigs/:id/bids')
  .get(protect, getBidsForGig);

router.route('/gigs/:id/hire')
  .patch(protect, hireFreelancer);

router.route('/mine').get(protect, getMyGigs);

module.exports = router;