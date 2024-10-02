const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalFilename: String,
  processedFilename: String,
  status: { type: String, enum: ['uploaded', 'processing', 'processed', 'error'], default: 'uploaded' },
  duration: Number,
  metadata: Object,
  uploadDate: { type: Date, default: Date.now },
});

videoSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('Video', videoSchema);
