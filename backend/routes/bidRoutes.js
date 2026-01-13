
const express = require('express');
const { placeBid, getBidsForGig, getMyBids} = require('../controllers/bidController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, placeBid);

router.route('/gigs/:id/bids')
  .get(protect, getBidsForGig);

router.route('/mine')
  .get(protect, getMyBids); 


module.exports = router;