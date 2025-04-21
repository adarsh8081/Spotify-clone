import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserIcon, UserGroupIcon } from '@heroicons/react/solid';

interface User {
  id: string;
  username: string;
  profileImage: string;
  bio: string;
}

interface SocialFeaturesProps {
  userId: string;
  onFollowChange?: (followersCount: number) => void;
}

const SocialFeatures: React.FC<SocialFeaturesProps> = ({ userId, onFollowChange }) => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const [followersRes, followingRes, isFollowingRes] = await Promise.all([
          axios.get(`/api/users/${userId}/followers`),
          axios.get(`/api/users/${userId}/following`),
          axios.get(`/api/users/${userId}/is-following`)
        ]);

        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
        setIsFollowing(isFollowingRes.data);
      } catch (error) {
        console.error('Error fetching social data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/api/users/${userId}/unfollow`);
        setFollowers(prev => prev.filter(f => f.id !== user?.id));
      } else {
        await axios.post(`/api/users/${userId}/follow`);
        setFollowers(prev => [...prev, { id: user?.id, username: user?.username, profileImage: user?.profileImage, bio: '' }]);
      }
      setIsFollowing(!isFollowing);
      onFollowChange?.(followers.length + (isFollowing ? -1 : 1));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowFollowers(!showFollowers)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white"
        >
          <UserGroupIcon className="w-5 h-5" />
          <span>{followers.length} Followers</span>
        </button>
        <button
          onClick={() => setShowFollowing(!showFollowing)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white"
        >
          <UserIcon className="w-5 h-5" />
          <span>{following.length} Following</span>
        </button>
        {user?.id !== userId && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-full ${
              isFollowing
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showFollowers && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold mb-4">Followers</h3>
            <div className="space-y-4">
              {followers.map((follower) => (
                <motion.div
                  key={follower.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={follower.profileImage}
                    alt={follower.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{follower.username}</p>
                    <p className="text-sm text-gray-400">{follower.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {showFollowing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold mb-4">Following</h3>
            <div className="space-y-4">
              {following.map((followed) => (
                <motion.div
                  key={followed.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={followed.profileImage}
                    alt={followed.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{followed.username}</p>
                    <p className="text-sm text-gray-400">{followed.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialFeatures; 