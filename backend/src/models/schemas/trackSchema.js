const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  duration: {
    type: Number,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    trim: true
  },
  releaseDate: {
    type: Date
  },
  plays: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
trackSchema.index({ title: 'text', artist: 'text', genre: 'text' });

module.exports = trackSchema; 