import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="h-16 bg-black bg-opacity-95 flex items-center justify-between px-8 sticky top-0">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-70 text-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-70 text-white"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
        
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center space-x-2 hover:bg-gray-800 rounded-full p-1 pr-2"
        >
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-gray-300" />
          </div>
          <span className="text-sm font-medium text-white">User Name</span>
          <ChevronDownIcon className="h-4 w-4 text-white" />
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5">
            <a
              href="/account"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Account
            </a>
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Profile
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Settings
            </a>
            <hr className="my-1 border-gray-700" />
            <button
              onClick={() => {/* Add logout logic */}}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar; 