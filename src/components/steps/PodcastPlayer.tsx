"use client";

import { VideoPlayer } from "@/components/steps/VideoPlayer";
import { AudioPlayer } from "@/components/steps/AudioPlayer";
import { User } from "lucide-react";
import type { PodcastSpeaker } from "@/types";

interface PodcastPlayerProps {
  title: string;
  description: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  durationSeconds: number | null;
  speakers: PodcastSpeaker[] | null;
}

export function PodcastPlayer({
  title,
  description,
  videoUrl,
  audioUrl,
  durationSeconds,
  speakers,
}: PodcastPlayerProps) {
  return (
    <div className="space-y-8">
      {/* Player */}
      {videoUrl ? (
        <VideoPlayer videoUrl={videoUrl} title={title} />
      ) : audioUrl ? (
        <AudioPlayer
          audioUrl={audioUrl}
          title={title}
          durationSeconds={durationSeconds ?? undefined}
        />
      ) : (
        <div className="aspect-video rounded-xl bg-white/[0.03] border border-border-subtle flex items-center justify-center">
          <p className="text-sm text-text-muted">Contenido no disponible</p>
        </div>
      )}

      {/* Descripcion */}
      {description && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      )}

      {/* Speakers */}
      {speakers && speakers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Participantes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {speakers.map((speaker, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border-subtle"
              >
                <div className="h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                  {speaker.photo ? (
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-text-muted" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {speaker.name}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {speaker.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
