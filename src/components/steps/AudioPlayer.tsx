"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import { PLAYBACK_SPEEDS } from "@/lib/constants";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  durationSeconds?: number;
}

export function AudioPlayer({ audioUrl, title, durationSeconds }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds ?? 0);
  const [speedIndex, setSpeedIndex] = useState(1); // 1x default

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  }

  function cycleSpeed() {
    const nextIndex = (speedIndex + 1) % PLAYBACK_SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.playbackRate = PLAYBACK_SPEEDS[nextIndex];
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-border-subtle p-6 space-y-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <p className="text-sm font-medium text-text-secondary text-center">{title}</p>

      {/* Barra de progreso */}
      <div
        className="relative h-2 rounded-full bg-white/[0.06] cursor-pointer group"
        onClick={handleSeek}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-primary to-[#00B4D8]"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-accent-primary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>

      {/* Tiempos */}
      <div className="flex justify-between text-xs text-text-muted">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={cycleSpeed}
          className="text-xs text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.06] cursor-pointer min-w-[3rem]"
        >
          {PLAYBACK_SPEEDS[speedIndex]}x
        </button>

        <button
          onClick={() => skip(-15)}
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={togglePlay}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-accent-primary to-[#00B4D8] flex items-center justify-center text-bg-primary hover:brightness-110 transition-all shadow-lg shadow-accent-primary/20 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          )}
        </button>

        <button
          onClick={() => skip(15)}
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <RotateCw className="h-5 w-5" />
        </button>

        <div className="min-w-[3rem]" />
      </div>
    </div>
  );
}
