import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { PlayIcon, PauseIcon, ClockIcon, DotsHorizontalIcon, PlusIcon, XIcon } from '@heroicons/react/solid';
import { setCurrentTrack } from '../store/slices/playerSlice';
import { useToast } from '../context/ToastContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  duration: number;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  owner: {
    id: string;
    username: string;
    profileImage: string;
  };
  songs: Track[];
  isPublic: boolean;
  collaborators: {
    id: string;
    username: string;
    profileImage: string;
  }[];
}

const Playlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`/api/playlists/${id}`);
        setPlaylist(response.data);
        setEditedTitle(response.data.title);
        setEditedDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleEdit = async () => {
    try {
      await axios.patch(`/api/playlists/${id}`, {
        title: editedTitle,
        description: editedDescription
      });
      setPlaylist(prev => prev ? {
        ...prev,
        title: editedTitle,
        description: editedDescription
      } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await axios.delete(`/api/playlists/${id}`);
        navigate('/library');
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    }
  };

  const handleRemoveSong = async (trackId: string) => {
    try {
      await axios.delete(`/api/playlists/${id}/songs/${trackId}`);
      setPlaylist(prev => prev ? {
        ...prev,
        songs: prev.songs.filter(song => song.id !== trackId)
      } : null);
    } catch (error) {
      console.error('Error removing song:', error);
    }
  };

  // Mock search results
  const searchResults: Track[] = [
    {
      id: '2',
      title: 'Song 2',
      artist: 'Artist 2',
      imageUrl: 'https://via.placeholder.com/50',
      duration: 240,
    },
    // Add more mock search results
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  const isOwner = user?.id === playlist.owner.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start space-x-8">
          <div className="w-64 h-64 rounded-lg overflow-hidden">
            <img
              src={playlist.imageUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-gray-800 text-white text-4xl font-bold p-2 rounded"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">{playlist.title}</h1>
                <p className="text-gray-400 mb-6">{playlist.description}</p>
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={playlist.owner.profileImage}
                    alt={playlist.owner.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-400">
                    Created by {playlist.owner.username}
                  </span>
                </div>
                {isOwner && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Songs</h2>
          <div className="space-y-2">
            {playlist.songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <span className="text-gray-400 w-8">{index + 1}</span>
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{song.title}</h3>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <span className="text-gray-400">
                  {Math.floor(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, '0')}
                </span>
                {isOwner && (
                  <button
                    onClick={() => handleRemoveSong(song.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Playlist Actions */}
        <div className="flex items-center space-x-4 mt-8">
          <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <PlayIcon className="h-8 w-8 text-black" />
          </button>
          <button
            onClick={() => setShowAddSong(true)}
            className="px-4 py-2 rounded-full border border-gray-400 hover:border-white transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Songs</span>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <DotsHorizontalIcon className="h-8 w-8" />
          </button>
        </div>

        {/* Add Song Modal */}
        {showAddSong && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add Songs</h2>
                <button
                  onClick={() => setShowAddSong(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white mb-4"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={track.imageUrl}
                        alt={track.title}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddSong(track)}
                      className="px-4 py-1 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist; 