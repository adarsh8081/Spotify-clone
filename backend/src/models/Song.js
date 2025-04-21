const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  duration: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  playCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
songSchema.index({ title: 'text', genre: 'text' });

const Song = mongoose.model('Song', songSchema);

module.exports = Song; 