const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  monthlyListeners: {
    type: Number,
    default: 0
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
artistSchema.index({ name: 'text', genres: 'text' });

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist; 