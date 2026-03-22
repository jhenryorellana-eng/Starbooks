"use client";

import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  // Detectar si es YouTube
  const youtubeMatch = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );

  if (youtubeMatch) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-border-subtle">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  // Placeholder para URLs mock
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border-subtle bg-white/[0.03] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto">
          <Play className="h-8 w-8 text-text-muted ml-1" />
        </div>
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-xs text-text-muted mt-1">
            Video no disponible (placeholder)
          </p>
        </div>
      </div>
    </div>
  );
}
