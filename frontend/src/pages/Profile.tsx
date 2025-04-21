import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Playlist {
  id: string;
  title: string;
  imageUrl: string;
  songCount: number;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  bio: string;
  followers: number;
  following: number;
  playlists: Playlist[];
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${user?.id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-start space-x-8">
        <div className="w-48 h-48 rounded-full overflow-hidden">
          <img
            src={profile.profileImage}
            alt={profile.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{profile.username}</h1>
          <p className="text-gray-400 mb-6">{profile.bio}</p>
          <div className="flex space-x-6 mb-8">
            <div>
              <span className="text-2xl font-bold">{profile.followers}</span>
              <span className="text-gray-400 ml-2">Followers</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{profile.following}</span>
              <span className="text-gray-400 ml-2">Following</span>
            </div>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profile.playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="group relative bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="relative">
                <img
                  src={playlist.imageUrl}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              </div>
              <h3 className="mt-4 font-semibold">{playlist.title}</h3>
              <p className="text-sm text-gray-400">{playlist.songCount} songs</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 