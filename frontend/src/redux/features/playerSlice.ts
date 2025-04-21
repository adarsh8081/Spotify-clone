import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Track {
  id: string;
  title: string;
  artist?: string;
  imageUrl: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const { setCurrentTrack, togglePlayPause } = playerSlice.actions;
export default playerSlice.reducer; 