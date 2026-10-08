"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Clock, ArrowRight, X } from "lucide-react";
import { AggregateVideoItem } from "@/data/resources";

interface VideoCardProps {
  video: AggregateVideoItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-red-400 dark:hover:border-red-600 hover:shadow-md transition-all flex flex-col justify-between">
        {/* Thumbnail area with play facade */}
        <div
          className="relative aspect-video bg-slate-950 cursor-pointer group"
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsOpen(true);
          }}
          aria-label={`Watch video: ${video.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-950/90 text-white border border-slate-700">
              <Clock className="w-3 h-3 text-red-400" />
              <span>{video.duration}</span>
            </div>
          )}

          {/* Class pill */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-950/80 text-white border border-slate-700">
            {video.className} • {video.subjectName}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
              {video.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Channel: {video.channel}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Now</span>
            </button>
            <Link
              href={`/classes/${video.classId}/${video.subjectId}/${video.topicSlug}`}
              className="font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
            >
              <span>Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <span className="text-xs font-semibold text-slate-300 truncate pr-4">
                {video.title}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
