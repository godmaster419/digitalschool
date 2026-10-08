"use client";

import React, { useState } from "react";
import { Play, Video, Clock } from "lucide-react";
import { VideoContent } from "@/types";

interface VideoPlayerProps {
  video: VideoContent;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video.available || !video.youtubeId) {
    return null;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
      {/* Video Display Area */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div
            className="group relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center bg-slate-900"
            onClick={() => setIsPlaying(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsPlaying(true);
              }
            }}
            aria-label={`Play video: ${video.title}`}
          >
            {/* Poster / Thumbnail image with lazy loading */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                video.thumbnailUrl ||
                `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
              }
              alt={video.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
              loading="lazy"
            />

            {/* Dark gradient overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Play Button Facade */}
            <div className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-900/50 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>

            {/* Duration Badge */}
            {video.duration && (
              <div className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/90 text-white backdrop-blur-sm border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>{video.duration}</span>
              </div>
            )}

            {/* Channel badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900/80 text-slate-200 backdrop-blur-sm border border-slate-700">
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>{video.channel || "Lecture Video"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Video Details Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-bold text-base sm:text-lg text-slate-100 leading-snug">
              {video.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
              <span>Channel: {video.channel}</span>
              {video.duration && (
                <>
                  <span>•</span>
                  <span>Duration: {video.duration}</span>
                </>
              )}
            </div>
            {video.description && (
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {video.description}
              </p>
            )}
          </div>
          {!isPlaying && (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Lecture</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
