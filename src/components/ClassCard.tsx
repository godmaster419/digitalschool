import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, FileText, Bookmark } from "lucide-react";
import { ClassItem } from "@/types";

interface ClassCardProps {
  classItem: ClassItem;
}

export function ClassCard({ classItem }: ClassCardProps) {

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between">
      {/* Top Banner & Name */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{classItem.level === "primary" ? "Primary" : "Middle School"}</span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {classItem.hindiName}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {classItem.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {classItem.description}
        </p>

        {/* 4 Pillars Badge Checklist */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate text-xs">Notes</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 rounded-lg">
            <Video className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate text-xs">Videos</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 rounded-lg">
            <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate text-xs">Worksheets</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 rounded-lg">
            <Bookmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate text-xs">Books</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-1">
        <Link
          href={`/classes/${classItem.slug}`}
          className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-all"
        >
          <span>Explore Class</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
