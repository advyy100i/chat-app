const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  content: { type: String, required: false }, // Text content (optional)
  data: { type: String, required: false },    // For base64 image/GIF data (optional)
  type: { type: String, enum: ['text', 'image'], default: 'text' }, // Type of message
  timestamp: Date, // Changed from String to Date for better handling
});

module.exports = mongoose.model('Message', messageSchema);