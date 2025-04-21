const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Track, Album, Artist } = require('../models');

// Songs routes
router.get('/songs', async (req, res) => {
  try {
    const songs = await Track.find()
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/songs/:id', async (req, res) => {
  try {
    const song = await Track.findById(req.params.id)
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Artists routes
router.get('/artists', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/artists/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Get artist's songs and albums
    const [songs, albums] = await Promise.all([
      Track.find({ artist: req.params.id }),
      Album.find({ artist: req.params.id })
    ]);

    res.json({
      ...artist.toObject(),
      songs,
      albums
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Albums routes
router.get('/albums', async (req, res) => {
  try {
    const albums = await Album.find()
      .populate('artist', 'name');
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/albums/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name')
      .populate('songs');
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending songs
router.get('/trending', async (req, res) => {
  try {
    const songs = await Track.find()
      .sort({ playCount: -1 })
      .limit(10)
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get new releases
router.get('/new-releases', async (req, res) => {
  try {
    const albums = await Album.find()
      .sort({ releaseDate: -1 })
      .limit(10)
      .populate('artist', 'name');
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 