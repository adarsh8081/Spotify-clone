import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
  RewindIcon,
  VolumeUpIcon,
  VolumeOffIcon,
} from '@heroicons/react/solid';
import { RootState } from '../store';
import { togglePlay, setCurrentTrack, setVolume, setCurrentTime } from '../store/slices/playerSlice';

const MusicPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, volume: storeVolume } = useSelector((state: RootState) => state.player);
  const [localVolume, setLocalVolume] = useState(storeVolume);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          dispatch(togglePlay());
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = storeVolume;
    }
  }, [storeVolume]);

  const handleTogglePlay = () => {
    dispatch(togglePlay());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    dispatch(setVolume(newVolume));
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      dispatch(setVolume(localVolume));
      setIsMuted(false);
    } else {
      dispatch(setVolume(0));
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (currentTime / duration) * 100;
      setProgress(progress);
      dispatch(setCurrentTime(currentTime));
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch(togglePlay())}
      />
      
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Track Info */}
        <div className="flex items-center space-x-4">
          <img
            src={currentTrack.imageUrl}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-md"
          />
          <div>
            <h4 className="text-white font-medium">{currentTrack.title}</h4>
            <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white">
              <RewindIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleTogglePlay}
              className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6 text-black" />
              ) : (
                <PlayIcon className="h-6 w-6 text-black" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white">
              <FastForwardIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mt-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end space-x-4">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white">
            {isMuted ? (
              <VolumeOffIcon className="h-5 w-5" />
            ) : (
              <VolumeUpIcon className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : localVolume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 