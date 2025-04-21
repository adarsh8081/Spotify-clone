const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Song = require('../models/Song');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.fieldname === 'song' ? 'songs' : 'covers';
    const dir = path.join(__dirname, `../../uploads/${type}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'song') {
      if (!file.originalname.match(/\.(mp3)$/)) {
        return cb(new Error('Only MP3 files are allowed!'), false);
      }
    } else if (file.fieldname === 'coverImage') {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only JPG, JPEG & PNG files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

// Middleware to check if user is admin
router.use(auth, admin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get all songs
router.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

// Upload new song
router.post('/songs', upload.fields([
  { name: 'song', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.song || !req.files.coverImage) {
      return res.status(400).json({ message: 'Both song and cover image are required' });
    }

    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      duration: 0, // This should be calculated from the actual audio file
      url: `/uploads/songs/${req.files.song[0].filename}`,
      coverImage: `/uploads/covers/${req.files.coverImage[0].filename}`
    });

    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading song' });
  }
});

// Delete song
router.delete('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Delete associated files
    const songPath = path.join(__dirname, '../..', song.url);
    const coverPath = path.join(__dirname, '../..', song.coverImage);

    try {
      fs.unlinkSync(songPath);
      fs.unlinkSync(coverPath);
    } catch (err) {
      console.error('Error deleting files:', err);
    }

    await song.remove();
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting song' });
  }
});

module.exports = router; 