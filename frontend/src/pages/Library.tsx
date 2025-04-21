import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { PlayIcon as PlayIconOutline } from '@heroicons/react/outline';
import { useDispatch } from 'react-redux';
import { setCurrentTrack, type Track } from '../store/slices/playerSlice';

interface Playlist {
  id: string;
  title: string;
  imageUrl: string;
}

const Library: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);

  // Mock data
  const playlists: Playlist[] = [
    {
      id: '1',
      title: 'My Playlist 1',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'My Playlist 2',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  const likedSongs: Track[] = [
    {
      id: '1',
      title: 'Liked Song 1',
      artist: 'Artist 1',
      album: 'Album 1',
      duration: 180,
      imageUrl: 'https://via.placeholder.com/150',
      audioUrl: '/audio/song1.mp3',
    },
    {
      id: '2',
      title: 'Liked Song 2',
      artist: 'Artist 2',
      album: 'Album 2',
      duration: 240,
      imageUrl: 'https://via.placeholder.com/150',
      audioUrl: '/audio/song2.mp3',
    },
  ];

  const handlePlay = (track: Track) => {
    dispatch(setCurrentTrack(track));
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    // Create a mock track from playlist for now
    const playlistTrack: Track = {
      id: playlist.id,
      title: playlist.title,
      artist: 'Various Artists',
      album: 'Playlist',
      duration: 0,
      imageUrl: playlist.imageUrl,
      audioUrl: '',
    };
    dispatch(setCurrentTrack(playlistTrack));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>
      
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-4 mb-6">
          <Tab as={React.Fragment}>
            {({ selected }) => (
              <button
                className={`px-4 py-2 rounded-full transition-colors ${
                  selected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Playlists
              </button>
            )}
          </Tab>
          <Tab as={React.Fragment}>
            {({ selected }) => (
              <button
                className={`px-4 py-2 rounded-full transition-colors ${
                  selected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Liked Songs
              </button>
            )}
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.title}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlayPlaylist(playlist)}
                    >
                      <PlayIconOutline className="h-5 w-5 text-white" aria-hidden="true" />
                    </button>
                  </div>
                  <h3 className="mt-2 font-semibold">{playlist.title}</h3>
                </div>
              ))}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {likedSongs.map((track) => (
                <div
                  key={track.id}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={track.imageUrl}
                      alt={track.title}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlay(track)}
                    >
                      <PlayIconOutline className="h-5 w-5 text-white" aria-hidden="true" />
                    </button>
                  </div>
                  <h3 className="mt-2 font-semibold">{track.title}</h3>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Library; 