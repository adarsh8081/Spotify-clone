const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Track, Album, Playlist, Artist } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return res.json([]);
    }

    // Search across all models
    const [tracks, albums, playlists, artists] = await Promise.all([
      Track.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { artist: { $regex: query, $options: 'i' } }
        ]
      }).limit(5),
      Album.find({
        title: { $regex: query, $options: 'i' }
      }).limit(5),
      Playlist.find({
        title: { $regex: query, $options: 'i' },
        isPublic: true
      }).limit(5),
      Artist.find({
        name: { $regex: query, $options: 'i' }
      }).limit(5)
    ]);

    // Format results
    const results = [
      ...tracks.map(track => ({
        id: track._id,
        type: 'track',
        title: track.title,
        subtitle: track.artist,
        imageUrl: track.imageUrl
      })),
      ...albums.map(album => ({
        id: album._id,
        type: 'album',
        title: album.title,
        subtitle: album.artist,
        imageUrl: album.imageUrl
      })),
      ...playlists.map(playlist => ({
        id: playlist._id,
        type: 'playlist',
        title: playlist.title,
        subtitle: `By ${playlist.owner.username}`,
        imageUrl: playlist.imageUrl
      })),
      ...artists.map(artist => ({
        id: artist._id,
        type: 'artist',
        title: artist.name,
        subtitle: `${artist.followers} followers`,
        imageUrl: artist.profileImage
      }))
    ];

    // Sort results by relevance (simple implementation)
    results.sort((a, b) => {
      const aMatch = a.title.toLowerCase().startsWith(query.toLowerCase());
      const bMatch = b.title.toLowerCase().startsWith(query.toLowerCase());
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search' });
  }
});

module.exports = router; 