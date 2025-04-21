const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
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
  releaseDate: {
    type: Date,
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
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],
  totalDuration: {
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
albumSchema.index({ title: 'text', artist: 'text', genre: 'text' });

// Calculate total duration when tracks are added or removed
albumSchema.pre('save', async function(next) {
  if (this.isModified('tracks')) {
    try {
      const tracks = await mongoose.model('Track').find({ _id: { $in: this.tracks } });
      this.totalDuration = tracks.reduce((total, track) => total + track.duration, 0);
    } catch (error) {
      console.error('Error calculating total duration:', error);
    }
  }
  next();
});

module.exports = albumSchema; 