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

module.exports = { createGig, getGigs };