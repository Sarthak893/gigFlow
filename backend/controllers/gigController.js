const Gig = require('../models/Gig');


const createGig = async (req, res) => {
  const { title, description, budget } = req.body;

  if (!title || !description || !budget) {
    return res.status(400).json({ message: 'Please provide title, description, and budget' });
  }

  try {
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    return res.status(201).json(gig);
  } catch (err) {
    console.error('Create gig error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getGigs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i'); 
      query = {
        $or: [
          { title: regex },
          { description: regex }
        ]
      };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (err) {
    console.error('Get gigs error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (err) {
    console.error('Get gig by ID error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyGigs = async (req, res) => {
  try {
    console.log('User ID:', req.user._id); 
    const gigs = await Gig.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });
    console.log('Found gigs:', gigs.length); 
    res.json(gigs);
  } catch (err) {
    console.error('Get my gigs error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createGig, getGigs, getGigById, getMyGigs };