import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  SearchIcon, 
  LibraryIcon, 
  PlusCircleIcon, 
  HeartIcon 
} from '@heroicons/react/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Search', href: '/search', icon: SearchIcon },
    { name: 'Your Library', href: '/library', icon: LibraryIcon },
  ];

  const playlists = [
    { id: 1, name: 'Liked Songs', href: '/playlist/liked', icon: HeartIcon },
    // Add more playlists here
  ];

  return (
    <div className="w-64 bg-black flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-white">
          Spotify Clone
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="px-2 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${location.pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700'}
              `}
            >
              <Icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Playlist section */}
      <div className="mt-6 px-2">
        <button
          type="button"
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md"
        >
          <PlusCircleIcon className="mr-3 h-6 w-6" />
          Create Playlist
        </button>

        <div className="mt-6 space-y-1">
          {playlists.map((playlist) => {
            const Icon = playlist.icon;
            return (
              <Link
                key={playlist.id}
                to={playlist.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md"
              >
                {Icon && <Icon className="mr-3 h-6 w-6" />}
                {playlist.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 