const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Playlist, Track } = require('../models');
const { createNotification } = require('./notifications');

// Create a new playlist
router.post('/', auth, async (req, res) => {
  try {
    const playlist = new Playlist({
      ...req.body,
      user: req.user.id
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Error creating playlist' });
  }
});

// Get user's playlists
router.get('/me', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id })
      .populate('songs', 'title artist album imageUrl')
      .sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Error fetching playlists' });
  }
});

// Get a specific playlist
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('user', 'username profileImage')
      .populate('songs', 'title artist album imageUrl');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if playlist is public or user is the owner
    if (!playlist.isPublic && playlist.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ message: 'Error fetching playlist' });
  }
});

// Update a playlist
router.patch('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(playlist, req.body);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ message: 'Error updating playlist' });
  }
});

// Delete a playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await playlist.remove();
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Error deleting playlist' });
  }
});

// Add a song to playlist
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    const track = await Track.findById(req.body.trackId);

    if (!playlist || !track) {
      return res.status(404).json({ message: 'Playlist or track not found' });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (playlist.songs.includes(track._id)) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }

    playlist.songs.push(track._id);
    await playlist.save();

    // Create notification for playlist followers
    if (playlist.followers && playlist.followers.length > 0) {
      await Promise.all(
        playlist.followers.map(followerId =>
          createNotification(
            followerId,
            'playlist_update',
            `added ${track.title} to ${playlist.title}`,
            req.user.id,
            { playlistId: playlist._id, trackId: track._id }
          )
        )
      );
    }

    res.json(playlist);
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ message: 'Error adding song to playlist' });
  }
});

// Remove a song from playlist
router.delete('/:id/songs/:trackId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    playlist.songs = playlist.songs.filter(
      songId => songId.toString() !== req.params.trackId
    );

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ message: 'Error removing song from playlist' });
  }
});

module.exports = router; 