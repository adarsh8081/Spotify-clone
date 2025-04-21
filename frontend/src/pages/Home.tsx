import React from 'react';
import MediaCard from '../components/MediaCard';
import { useDispatch } from 'react-redux';
import { setCurrentTrack } from '../store/slices/playerSlice';
import { PlayIcon } from '@heroicons/react/solid';
import { Track as SharedTrack, Playlist } from '../types'; // Import shared types

const Home: React.FC = () => {
  const dispatch = useDispatch();

  // Mock data for demonstration
  const trendingSongs: SharedTrack[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      imageUrl: '/images/bohemian-rhapsody.jpg',
      audioUrl: '/audio/bohemian-rhapsody.mp3', // Required field
    },
    {
      id: '2',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      imageUrl: '/images/stairway-to-heaven.jpg',
      audioUrl: '/audio/stairway-to-heaven.mp3', // Required field
    },
  ];

  const recommendedPlaylists: Playlist[] = [
    {
      id: '1',
      title: 'Rock Classics',
      imageUrl: '/images/rock-classics.jpg',
    },
    {
      id: '2',
      title: 'Pop Hits',
      imageUrl: '/images/pop-hits.jpg',
    },
  ];

  const recentlyPlayed: SharedTrack[] = [
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      imageUrl: '/images/hotel-california.jpg',
      audioUrl: '/audio/hotel-california.mp3', // Required field
    },
    {
      id: '4',
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      imageUrl: '/images/sweet-child-o-mine.jpg',
      audioUrl: '/audio/sweet-child-o-mine.mp3', // Required field
    },
  ];

  const handlePlayTrack = (track: SharedTrack) => {
    if (!track.audioUrl) {
      console.error('Audio URL is missing for track:', track.title);
      return;
    }
    dispatch(setCurrentTrack(track)); // Dispatch only valid tracks
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

      {/* Trending Songs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Trending Songs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trendingSongs.map((track) => (
            <MediaCard
              key={track.id}
              item={track}
              onClick={() => handlePlayTrack(track)}
              type="track"
            />
          ))}
        </div>
      </section>

      {/* Recommended Playlists */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recommended Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recommendedPlaylists.map((playlist) => (
            <MediaCard key={playlist.id} item={playlist} type="playlist" />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recentlyPlayed.map((track) => (
            <MediaCard
              key={track.id}
              item={track}
              onClick={() => handlePlayTrack(track)}
              type="track"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;