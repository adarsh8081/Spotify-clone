const mongoose = require('mongoose');

// Define schemas
const userSchema = require('./schemas/userSchema');
const trackSchema = require('./schemas/trackSchema');
const albumSchema = require('./schemas/albumSchema');
const playlistSchema = require('./schemas/playlistSchema');
const notificationSchema = require('./schemas/notificationSchema');

// Initialize models
const User = mongoose.model('User', userSchema);
const Track = mongoose.model('Track', trackSchema);
const Album = mongoose.model('Album', albumSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
  User,
  Track,
  Album,
  Playlist,
  Notification
}; 