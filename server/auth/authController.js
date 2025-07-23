// server/auth/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Corrected import path for User model

const SECRET = 'supersecretkey'; // move to .env in production

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "User already exists" }); // Changed msg to message for consistency

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: "User registered successfully" }); // Changed msg to message
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" }); // Changed msg to message
    }
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' }); // Added username to token payload
    res.json({ token, username: user.username, message: "Logged in successfully" }); // Added message for client feedback
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};