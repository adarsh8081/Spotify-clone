import React, { useState, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { useDispatch } from 'react-redux';
import { setCurrentTrack } from '../store/slices/playerSlice';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

type SearchResultType = 'track' | 'artist' | 'album' | 'playlist';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  imageUrl: string;
  duration?: number;
}

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<SearchResultType | 'all'>('all');

  // Mock search function - replace with actual API call
  const searchContent = async (searchQuery: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'track' as SearchResultType,
        title: 'Shape of You',
        subtitle: 'Ed Sheeran',
        imageUrl: 'https://via.placeholder.com/150',
        duration: 235,
      },
      {
        id: '2',
        type: 'artist' as SearchResultType,
        title: 'Ed Sheeran',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: '3',
        type: 'album' as SearchResultType,
        title: '÷ (Divide)',
        subtitle: 'Ed Sheeran',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        id: '4',
        type: 'playlist' as SearchResultType,
        title: 'Top Pop Hits',
        subtitle: 'Spotify',
        imageUrl: 'https://via.placeholder.com/150',
      },
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setIsLoading(false);
  };

  useEffect(() => {
    if (query.trim()) {
      const debounceTimer = setTimeout(() => {
        searchContent(query);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handlePlay = (result: SearchResult) => {
    if (result.type === 'track') {
      dispatch(setCurrentTrack({
        id: result.id,
        title: result.title,
        artist: result.subtitle || '',
        album: '',
        duration: result.duration || 0,
        imageUrl: result.imageUrl,
        audioUrl: '/audio/mock.mp3',
      }));
      showToast('Now playing: ' + result.title, 'info');
    }
  };

  const filteredResults = activeFilter === 'all' 
    ? results 
    : results.filter(result => result.type === activeFilter);

  const filterButtons: { type: SearchResultType | 'all'; label: string }[] = [
    { type: 'all', label: 'All' },
    { type: 'track', label: 'Songs' },
    { type: 'artist', label: 'Artists' },
    { type: 'album', label: 'Albums' },
    { type: 'playlist', label: 'Playlists' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, albums, or playlists"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mt-6 mb-8">
          {filterButtons.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === type
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Results */}
        {!isLoading && filteredResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group cursor-pointer"
                onClick={() => handlePlay(result)}
              >
                <div className="relative">
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className={`w-full aspect-square object-cover rounded-lg ${
                      result.type === 'artist' ? 'rounded-full' : ''
                    }`}
                  />
                  {result.type === 'track' && (
                    <button className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <SearchIcon className="h-5 w-5 text-white" />
                    </button>
                  )}
                </div>
                <h3 className="mt-2 font-semibold truncate">{result.title}</h3>
                {result.subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                    {result.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && filteredResults.length === 0 && (
          <div className="text-center my-12 text-gray-600 dark:text-gray-400">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 