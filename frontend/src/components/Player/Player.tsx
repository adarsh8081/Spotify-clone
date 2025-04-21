import React, { useState, useRef, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  RefreshIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = {
    title: 'Sample Track',
    artist: 'Sample Artist',
    album: 'Sample Album',
    coverUrl: 'https://via.placeholder.com/64',
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-24 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center w-1/4">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="h-14 w-14 rounded-md mr-4"
        />
        <div>
          <h4 className="text-white text-sm font-medium">{currentTrack.title}</h4>
          <p className="text-gray-400 text-xs">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white">
            <SwitchHorizontalIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <RewindIcon className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white rounded-full p-2 hover:scale-1.1 transform transition-all"
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
          <button className="text-gray-400 hover:text-white">
            <RefreshIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-4 mt-2">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center w-1/4 justify-end">
        <button
          onClick={() => setVolume(volume === 0 ? 1 : 0)}
          className="text-gray-400 hover:text-white mr-2"
        >
          {volume === 0 ? (
            <VolumeOffIcon className="h-5 w-5" />
          ) : (
            <VolumeUpIcon className="h-5 w-5" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />
    </div>
  );
};

export default Player; 