import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentTrack } from '../store/slices/playerSlice';

interface PlayerContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: any) => void;
  removeFromQueue: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [queue, setQueue] = useState<any[]>([]);
  
  const soundRef = useRef<Howl | null>(null);
  const dispatch = useDispatch();
  const currentTrack = useSelector((state: RootState) => state.player.currentTrack);

  useEffect(() => {
    if (currentTrack) {
      if (soundRef.current) {
        soundRef.current.unload();
      }

      soundRef.current = new Howl({
        src: [currentTrack.audioUrl],
        html5: true,
        volume: volume,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => {
          if (repeatMode === 'one') {
            soundRef.current?.play();
          } else if (repeatMode === 'all' || queue.length > 0) {
            playNext();
          }
        },
        onload: () => {
          setDuration(soundRef.current?.duration() || 0);
        }
      });

      soundRef.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (soundRef.current && isPlaying) {
        setCurrentTime(soundRef.current.seek());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const play = () => {
    soundRef.current?.play();
  };

  const pause = () => {
    soundRef.current?.pause();
  };

  const seek = (time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one';
      if (prev === 'one') return 'all';
      return 'none';
    });
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = isShuffle
        ? queue[Math.floor(Math.random() * queue.length)]
        : queue[0];
      dispatch(setCurrentTrack(nextTrack));
      setQueue(prev => prev.filter(track => track.id !== nextTrack.id));
    }
  };

  const playPrevious = () => {
    // Implement previous track logic
  };

  const addToQueue = (track: any) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        volume,
        isShuffle,
        repeatMode,
        play,
        pause,
        seek,
        setVolume: handleVolumeChange,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrevious,
        addToQueue,
        removeFromQueue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 