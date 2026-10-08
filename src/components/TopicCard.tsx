import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, FileText, Bookmark } from "lucide-react";
import { TopicItem } from "@/types";

interface TopicCardProps {
  topic: TopicItem;
  classNameLabel?: string;
  subjectNameLabel?: string;
}

export function TopicCard({ topic, classNameLabel, subjectNameLabel }: TopicCardProps) {
  const padChapter = String(topic.chapterNumber).padStart(2, "0");

  return (
    <Link
      href={`/classes/${topic.classId}/${topic.subjectId}/${topic.slug}`}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs flex items-center justify-center border border-blue-100 dark:border-blue-900/60">
              {padChapter}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Chapter {topic.chapterNumber}
            </span>
          </div>

          {(classNameLabel || subjectNameLabel) && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {classNameLabel} {subjectNameLabel ? `• ${subjectNameLabel}` : ""}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {topic.title}
        </h3>
        {topic.hindiTitle && topic.hindiTitle !== topic.title && (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {topic.hindiTitle}
          </p>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {topic.description}
        </p>

        {/* Dynamic Resource Availability Indicators */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 flex-wrap text-[11px]">
          {topic.notes?.available && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
              <BookOpen className="w-3 h-3 text-blue-500" />
              <span>Notes</span>
            </span>
          )}
          {topic.video?.available && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-medium">
              <Video className="w-3 h-3 text-red-500" />
              <span>Video</span>
            </span>
          )}
          {topic.worksheet?.available && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">
              <FileText className="w-3 h-3 text-emerald-500" />
              <span>Worksheet</span>
            </span>
          )}
          {topic.book?.available && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">
              <Bookmark className="w-3 h-3 text-amber-500" />
              <span>Book</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
        <span>Start Learning</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
