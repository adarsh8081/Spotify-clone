const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  imageUrl: {
    type: String,
    default: 'default-playlist.jpg'
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
playlistSchema.index({ title: 'text', description: 'text' });

// Calculate total duration when songs are added or removed
playlistSchema.pre('save', async function(next) {
  if (this.isModified('songs')) {
    try {
      const tracks = await mongoose.model('Track').find({ _id: { $in: this.songs } });
      this.totalDuration = tracks.reduce((total, track) => total + track.duration, 0);
    } catch (error) {
      console.error('Error calculating total duration:', error);
    }
  }
  next();
});

module.exports = playlistSchema; 