// models/Settings.js

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  maxUploadSize: { type: Number, default: 100 * 1024 * 1024 }, // 100 MB
  allowedFileTypes: { type: [String], default: ['mp4', 'avi', 'mov'] },
});

module.exports = mongoose.model('Settings', settingsSchema);
