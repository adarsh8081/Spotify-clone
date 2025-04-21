import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  audioUrl: string;
  coverImageUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  userId: string;
  tracks: Track[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserPlaylists = createAsyncThunk(
  'playlist/fetchUserPlaylists',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/playlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlists');
    }
  }
);

export const createPlaylist = createAsyncThunk(
  'playlist/createPlaylist',
  async (playlistData: { name: string; description: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/playlists', playlistData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create playlist');
    }
  }
);

export const addTrackToPlaylist = createAsyncThunk(
  'playlist/addTrackToPlaylist',
  async ({ playlistId, trackId }: { playlistId: string; trackId: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/playlists/${playlistId}/tracks`,
        { trackId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add track to playlist');
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setCurrentPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.currentPlaylist = action.payload;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch playlists
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create playlist
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add track to playlist
    builder
      .addCase(addTrackToPlaylist.fulfilled, (state, action) => {
        if (state.currentPlaylist && state.currentPlaylist.id === action.payload.id) {
          state.currentPlaylist = action.payload;
        }
        const index = state.playlists.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
      });
  },
});

export const { setCurrentPlaylist, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer; 