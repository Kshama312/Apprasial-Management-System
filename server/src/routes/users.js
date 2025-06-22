const express = require('express');
const router = express.Router();
const User = require('../model/user');
const { protect } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/by-role/:role
// @desc    Get users by role
// @access  Private
router.get('/by-role/:role', protect, async (req, res) => {
  try {
    const validRoles = ["Employee", "Junior", "Peer", "Manager", "Supervisor"];
    
    if (!validRoles.includes(req.params.role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const users = await User.find({ role: req.params.role }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;