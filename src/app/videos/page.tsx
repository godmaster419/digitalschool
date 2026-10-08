import React from "react";
import type { Metadata } from "next";
import { Video } from "lucide-react";
import { getAllVideos } from "@/data/resources";
import { getHomeClasses } from "@/data/classes";
import { getAllSubjects } from "@/data/subjects";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VideosExplorer } from "@/components/VideosExplorer";

export const metadata: Metadata = {
  title: "Video Lectures Hub | Digital School",
  description:
    "Explore conceptual video lectures and experiment demonstrations for Classes 3 to 8.",
};

export default function VideosPage() {
  const videos = getAllVideos();
  const classes = getHomeClasses();
  const subjects = getAllSubjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs items={[{ label: "Video Lectures" }]} />

      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 mb-3">
          <Video className="w-3.5 h-3.5" />
          <span>Interactive Learning</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Video Lectures Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Watch high-quality animated and conceptual video lectures across active classes. Lazy-loaded on demand to preserve your mobile data and load times.
        </p>
      </div>

      <VideosExplorer initialVideos={videos} classes={classes} subjects={subjects} />
    </div>
  );
}
