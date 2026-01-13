
const Gig = require('../models/Gig');
const Bid = require('../models/Bid');

const placeBid = async (req, res) => {
  const { gigId, amount, message } = req.body;
  const freelancerId = req.user._id;

  if (!gigId || !amount) {
    return res.status(400).json({ message: 'Gig ID and amount are required' });
  }

  try {

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.status !== 'open') return res.status(400).json({ message: 'Bidding is closed for this gig' });
    if (gig.ownerId.toString() === freelancerId.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId,
      amount,
      message
    });

    res.status(201).json(bid);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }
    console.error('Place bid error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// backend/controllers/bidController.js
const getBidsForGig = async (req, res) => {
  const { id: gigId } = req.params;
  const userId = req.user._id;

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    if (gig.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the gig owner can view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    console.error('Get bids error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const hireFreelancer = async (req, res) => {
  const { id: gigId } = req.params;
  const { freelancerId } = req.body;
  const clientId = req.user._id;

  if (!freelancerId) {
    return res.status(400).json({ message: 'Freelancer ID is required' });
  }

  try {
    // Find gig and verify ownership
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.ownerId.toString() !== clientId.toString()) {
      return res.status(403).json({ message: 'Only the client can hire a freelancer' });
    }
    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is not open for hiring' });
    }

    // Verify bid exists
    const bid = await Bid.findOne({ gigId, freelancerId });
    if (!bid) {
      return res.status(400).json({ message: 'No bid found from this freelancer' });
    }

    // ATOMIC UPDATE: Close gig and mark as hired in one operation
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      { 
        status: 'closed',
        hiredFreelancer: freelancerId // Optional: store who was hired
      },
      { new: true, runValidators: true }
    );

    res.json(updatedGig);
  } catch (err) {
    console.error('Hire freelancer error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title budget status')
      .populate('freelancerId', 'name')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    console.error('Get my bids error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { placeBid, getBidsForGig, hireFreelancer , getMyBids };