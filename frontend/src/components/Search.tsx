import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, XIcon } from '@heroicons/react/solid';

interface SearchResult {
  id: string;
  type: 'track' | 'album' | 'playlist' | 'artist';
  title: string;
  subtitle: string;
  imageUrl: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');
    navigate(`/${result.type}/${result.id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search for songs, albums, artists, or playlists"
          className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (results.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
                  >
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold">{result.title}</h3>
                      <p className="text-sm text-gray-400">{result.subtitle}</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-400 capitalize">
                      {result.type}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search; 