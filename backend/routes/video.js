const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const Video = require('../models/Video');
const fs = require('fs');
const util = require('util');
//const ffprobe = util.promisify(ffmpeg.ffprobe);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);



//configuring Multer storage for video uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

//video upload route
router.post('/upload', authenticateToken, upload.single('video'), async (req, res) => {
  try {

    const io = req.app.get('io');

    const video = new Video({
      userId: req.user.userId,
      originalFilename: req.file.filename,
      status: 'processing',
    });
    
   // Emit an event for the new video
    await video.save();
    io.to(req.user.userId).emit('videoStatus', {
      videoId: video._id,
      status: 'processing',
      newVideo: true,
    });


    // Start video processing
    processVideo(video, req.file.path, req.app.get('io'));  // Passing req.io to processVideo

    res.status(200).json({ message: 'Video uploaded and processing started' });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Video upload failed' });
  }
});
const ffprobe = util.promisify(ffmpeg.ffprobe);
// Function to process video
async function processVideo(video, filePath, io) {
  console.log('Starting video processing for:', filePath);
  ffmpeg.ffprobe(filePath, async (err, metadata) => {
    if (err) {
      console.error('ffmpeg processing error:', err);
      video.status = 'error';
      await video.save();
      io.emit('videoStatus', { videoId: video._id, status: 'error' });
      return;
    }
    console.log('Metadata retrieved:', metadata);

    const duration = metadata.format.duration;
    console.log('Video duration:', duration);

    if (duration > 1000) {
      console.log('Video exceeds maximum duration');
      video.status = 'error';
      await video.save();
      io.emit('videoStatus', { videoId: video._id, status: 'error', message: 'Video exceeds maximum duration' });
      return;
    }

    if (err) {
      console.error('ffmpeg error:', err);  
      video.status = 'error';
      await video.save();
      io.emit('videoStatus', { videoId: video._id, status: 'error' });
      return;
    }
    
    video.duration = duration;
    video.metadata = metadata;
    await video.save();

    // Simulating processing delay
    setTimeout(async () => {
      video.status = 'processed';
      await video.save();
      io.emit('videoStatus', { videoId: video._id, status: 'processed' });
      console.log('Video duration:', duration);

      // Deleting the uploaded file after processing
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      });
    }, 5000); // Simulating processing time
  });
}

// Get user's videos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.user.userId }).sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
});

module.exports = router;
