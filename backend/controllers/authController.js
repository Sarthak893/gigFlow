
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { patch } = require('../routes/authRoutes');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
         });}
    user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 ,
      path: '/'
    });

    res.status(201).json({ success: true, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    
    });

    res.json({ success: true, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  if (req.user) {
    res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};


const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
};

module.exports = { register, login, logout, getCurrentUser };