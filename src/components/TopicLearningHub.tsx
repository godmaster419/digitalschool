"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, Bookmark, Layers } from "lucide-react";
import { TopicItem, ClassItem, SubjectItem } from "@/types";
import { NotesSection } from "./NotesSection";
import { VideoPlayer } from "./VideoPlayer";
import { WorksheetSection } from "./WorksheetSection";
import { BookSection } from "./BookSection";

interface TopicLearningHubProps {
  topic: TopicItem;
  classItem: ClassItem;
  subject: SubjectItem;
  prevTopic?: TopicItem;
  nextTopic?: TopicItem;
}

export function TopicLearningHub({
  topic,
  classItem,
  subject,
  prevTopic,
  nextTopic,
}: TopicLearningHubProps) {
  // Determine available tabs
  const hasNotes = topic.notes?.available;
  const hasVideo = topic.video?.available;
  const hasWorksheet = topic.worksheet?.available;
  const hasBook = topic.book?.available;

  // Active tab state: default to 'notes' or first available
  const [activeTab, setActiveTab] = useState<"all" | "notes" | "video" | "worksheet" | "book">("all");

  const tabs = [
    { id: "all", label: "Complete Overview (All)", available: true, icon: Layers },
    { id: "notes", label: "📘 Chapter Notes", available: hasNotes, icon: BookOpen },
    { id: "video", label: "🎥 Video Lecture", available: hasVideo, icon: Video },
    { id: "worksheet", label: "📝 Practice Worksheet", available: hasWorksheet, icon: FileText },
    { id: "book", label: "📚 Related Book", available: hasBook, icon: Bookmark },
  ].filter((t) => t.available);

  return (
    <div className="space-y-8">
      {/* Tab Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "all" | "notes" | "video" | "worksheet" | "book")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Learning Content Area */}
      <div className="space-y-12">
        {/* 1. NOTES SECTION */}
        {(activeTab === "all" || activeTab === "notes") && hasNotes && (
          <div id="notes" className="scroll-mt-36">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Chapter Notes & Formulas
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Bilingual English/Hindi</span>
            </div>
            <NotesSection notes={topic.notes} topicTitle={topic.title} />
          </div>
        )}

        {/* 2. VIDEO SECTION */}
        {(activeTab === "all" || activeTab === "video") && hasVideo && topic.video && (
          <div id="video" className="scroll-mt-36">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
                  <Video className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Concept Video Lecture
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Interactive Player</span>
            </div>
            <VideoPlayer video={topic.video} />
          </div>
        )}

        {/* 3. WORKSHEET SECTION */}
        {(activeTab === "all" || activeTab === "worksheet") && hasWorksheet && (
          <div id="worksheet" className="scroll-mt-36">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <FileText className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Practice Worksheet & Problems
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Printable PDF</span>
            </div>
            <WorksheetSection worksheet={topic.worksheet} topicTitle={topic.title} />
          </div>
        )}

        {/* 4. BOOK SECTION */}
        {(activeTab === "all" || activeTab === "book") && hasBook && (
          <div id="book" className="scroll-mt-36">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                  <Bookmark className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Official Curriculum Textbook Chapter
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">NCERT Standard</span>
            </div>
            <BookSection book={topic.book} topicTitle={topic.title} />
          </div>
        )}
      </div>

      {/* Chapter Navigation Bar (Previous & Next Chapters) */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevTopic ? (
          <Link
            href={`/classes/${classItem.slug}/${subject.slug}/${prevTopic.slug}`}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-900 transition-colors group flex flex-col items-start"
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              ← Previous Chapter
            </span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-1 line-clamp-1">
              Chapter {prevTopic.chapterNumber}: {prevTopic.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic && (
          <Link
            href={`/classes/${classItem.slug}/${subject.slug}/${nextTopic.slug}`}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-900 transition-colors group flex flex-col items-end sm:text-right"
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Next Chapter →
            </span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-1 line-clamp-1">
              Chapter {nextTopic.chapterNumber}: {nextTopic.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
