import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  coverImage: string;
}

const SongManagement: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/songs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSongs(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch songs');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFile || !coverImage) {
      setError('Please select both song file and cover image');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('song', songFile);
    formData.append('coverImage', coverImage);

    try {
      await axios.post('http://localhost:5000/api/admin/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        }
      });

      // Reset form
      setTitle('');
      setArtist('');
      setAlbum('');
      setSongFile(null);
      setCoverImage(null);
      setUploadProgress(0);
      setIsUploading(false);

      // Refresh song list
      fetchSongs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload song');
      setIsUploading(false);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/songs/${songId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchSongs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete song');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Upload New Song</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-[#121212] p-6 rounded-lg">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#282828] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Artist
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#282828] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Album
            </label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#282828] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#7747ff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Song File (MP3)
            </label>
            <input
              type="file"
              accept="audio/mp3"
              onChange={(e) => setSongFile(e.target.files?.[0] || null)}
              required
              className="w-full text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              required
              className="w-full text-white"
            />
          </div>
          {isUploading && (
            <div className="w-full bg-[#282828] rounded-full h-2">
              <div
                className="bg-[#7747ff] h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 px-4 bg-[#7747ff] text-white rounded hover:bg-[#6535ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7747ff] disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Song'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Manage Songs</h2>
        <div className="bg-[#121212] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#282828]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Artist</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Album</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Duration</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {songs.map((song) => (
                <tr key={song._id} className="hover:bg-[#1a1a1a]">
                  <td className="px-6 py-4 text-sm text-white">{song.title}</td>
                  <td className="px-6 py-4 text-sm text-white">{song.artist}</td>
                  <td className="px-6 py-4 text-sm text-white">{song.album}</td>
                  <td className="px-6 py-4 text-sm text-white">
                    {formatDuration(song.duration)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteSong(song._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SongManagement; 