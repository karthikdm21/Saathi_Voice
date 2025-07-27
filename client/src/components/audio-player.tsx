import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  variant?: 'default' | 'sent' | 'received';
}

export default function AudioPlayer({ audioUrl, variant = 'default' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      console.log("Audio loading failed:", audioUrl);
      setDuration(0);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Audio play failed:", error);
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const getButtonColor = () => {
    switch (variant) {
      case 'sent':
        return 'text-white hover:text-gray-200';
      case 'received':
        return 'text-green-400 hover:text-green-300';
      default:
        return 'text-green-400 hover:text-green-300';
    }
  };

  const getProgressColor = () => {
    switch (variant) {
      case 'sent':
        return 'bg-white';
      case 'received':
        return 'bg-green-400';
      default:
        return 'bg-green-400';
    }
  };

  const getTrackColor = () => {
    switch (variant) {
      case 'sent':
        return 'bg-green-700';
      case 'received':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Button
        data-testid="button-audio-play"
        variant="ghost"
        size="sm"
        onClick={togglePlayPause}
        className={`p-1 ${getButtonColor()}`}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      
      <div className="flex-1">
        <div 
          className={`h-2 rounded-full cursor-pointer ${getTrackColor()}`}
          onClick={handleProgressClick}
        >
          <div 
            className={`h-2 rounded-full transition-all duration-100 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <span className="text-xs text-gray-400 min-w-[2.5rem]" data-testid="text-audio-duration">
        {formatTime(duration)}
      </span>
    </div>
  );
}