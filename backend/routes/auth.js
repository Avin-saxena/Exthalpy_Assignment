const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log('Registering user:', username);
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser){
      console.log('Username already exists:', username);
       return res.status(400).json({ error: 'Username already exists' });
    }
    // Create a new user
    const user = new User({ username, password, role });
    await user.save();
    console.log('User registered successfully:', username);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// user login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Attempting login for user:', username);
    //find user by username
    const user = await User.findOne({ username });
    if (!user){
      console.log('User not found:', username);
       return res.status(401).json({ error: 'Invalid credentials' });
    }
    //Compare passwords
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    //Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('Login successful for user:', username);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
