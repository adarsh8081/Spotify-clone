import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentIndex: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
      state.currentIndex = 0;
    },
    nextTrack: (state) => {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },
    previousTrack: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },
  },
});

export const {
  setCurrentTrack,
  setPlaying,
  addToQueue,
  clearQueue,
  nextTrack,
  previousTrack,
} = playerSlice.actions;

export default playerSlice.reducer; 