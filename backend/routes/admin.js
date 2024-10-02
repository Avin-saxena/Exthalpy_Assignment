const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

// User management routes
router.get('/users', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

router.put('/users/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Video management routes
router.get('/videos', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const videos = await Video.find().populate('userId', 'username');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
});


// routes/admin.js

router.get('/stats', authenticateToken, authorize('admin'), async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalVideos = await Video.countDocuments();
      // Add more stats as needed
  
      res.json({ totalUsers, totalVideos });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve stats' });
    }
  });
  

  router.get('/logs', authenticateToken, authorize('admin'), (req, res) => {
    const logFile = path.join(__dirname, '..', 'logs', 'combined.log');
    fs.readFile(logFile, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read logs' });
      }
      res.send(`<pre>${data}</pre>`);
    });
  });

module.exports = router;
