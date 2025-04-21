import React from 'react';
import { PlayIcon } from '@heroicons/react/solid';
import type { Track, Playlist } from '../types';

interface MediaCardProps {
  item: Track | Playlist;
  type: 'track' | 'playlist';
  onClick?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, type, onClick }) => {
  return (
    <div className="relative group bg-[#121212] rounded overflow-hidden shadow">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-white font-medium text-lg truncate">
          {item.title}
        </h3>
        {type === 'track' && 'artist' in item && (
          <p className="text-gray-400 text-sm truncate">
            {item.artist}
          </p>
        )}
      </div>
      {type === 'track' && onClick && (
        <button
          onClick={onClick}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <PlayIcon className="w-10 h-10 text-white" />
        </button>
      )}
    </div>
  );
};

export default MediaCard;
