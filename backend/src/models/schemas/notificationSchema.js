const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['follow', 'like', 'playlist_update', 'mention', 'system']
  },
  message: {
    type: String,
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

module.exports = notificationSchema; 