// types.ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  album?: string;
  coverImageUrl?: string;
  duration?: number;
  audioUrl: string; // Ensure this is required
}

// Add Playlist interface
export interface Playlist {
  id: string;
  title: string;
  imageUrl: string;
}