import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  SearchIcon,
  CollectionIcon,
  UserIcon,
  PlusCircleIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/outline';
import { useTheme } from '../context/ThemeContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Search', icon: SearchIcon, href: '/search' },
    { name: 'Your Library', icon: CollectionIcon, href: '/library' },
  ];

  const playlists = [
    { name: 'Liked Songs', icon: HeartIcon, href: '/playlist/liked' },
    { name: 'Create Playlist', icon: PlusCircleIcon, href: '/playlist/create' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 p-6 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Logo */}
      <Link to="/" className="block mb-8">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Spotify Clone
        </h1>
      </Link>

      {/* Main Navigation */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center space-x-4 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Playlists */}
      <div className="mb-8">
        <ul className="space-y-2">
          {playlists.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center space-x-4 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`flex items-center space-x-4 px-4 py-2 rounded-lg transition-colors ${
          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
        }`}
      >
        {theme === 'dark' ? (
          <>
            <SunIcon className="w-6 h-6" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <MoonIcon className="w-6 h-6" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Sidebar; 