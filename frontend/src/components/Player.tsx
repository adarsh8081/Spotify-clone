import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentTrack, setPlaying, nextTrack, previousTrack } from '../store/slices/playerSlice';
import {
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  SwitchHorizontalIcon,
  RefreshIcon
} from '@heroicons/react/solid';

const Player: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, queue, currentIndex } = useSelector((state: RootState) => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    dispatch(setPlaying(!isPlaying));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handlePrevious = () => {
    dispatch(previousTrack());
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (repeatMode === 'one') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          } else if (repeatMode === 'all' || currentIndex < queue.length - 1) {
            handleNext();
          }
        }}
      />
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 w-1/4">
          <img
            src={currentTrack.imageUrl}
            alt={currentTrack.title}
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="font-semibold">{currentTrack.title}</h3>
            <p className="text-sm text-gray-400">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`text-gray-400 hover:text-white ${isShuffle ? 'text-green-500' : ''}`}
            >
              <SwitchHorizontalIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRepeatMode(
                repeatMode === 'none' ? 'all' :
                repeatMode === 'all' ? 'one' : 'none'
              )}
              className={`text-gray-400 hover:text-white ${
                repeatMode !== 'none' ? 'text-green-500' : ''
              }`}
            >
              <RefreshIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <button onClick={handleMute} className="text-gray-400 hover:text-white">
            {isMuted ? (
              <VolumeOffIcon className="w-5 h-5" />
            ) : (
              <VolumeUpIcon className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Player; 