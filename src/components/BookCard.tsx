"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Download, ArrowRight } from "lucide-react";
import { AggregateBookItem } from "@/data/resources";

interface BookCardProps {
  book: AggregateBookItem;
}

export function BookCard({ book }: BookCardProps) {
  const handleDownload = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>${book.title}</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>${book.title}</h2>
          <p>${book.className} • ${book.subjectName} • Chapter ${book.chapterNumber}</p>
          <p>Publisher: ${book.publisher} (${book.pages} Pages)</p>
          <hr style="margin: 20px 0;"/>
          <p>Official Digital School Textbook Chapter Document</p>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
            {book.className}
          </span>
          <span className="text-xs text-slate-400 font-medium">{book.subjectName}</span>
        </div>

        <div className="flex items-start gap-3 my-2">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-2">
              {book.title}
            </h3>
            {book.hindiTitle && (
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{book.hindiTitle}</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>Publisher:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{book.publisher}</span>
          </div>
          <div className="flex justify-between">
            <span>Chapter:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Chapter {book.chapterNumber} ({book.pages} pages)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <Link
          href={`/classes/${book.classId}/${book.subjectId}/${book.topicSlug}#book`}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Topic Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
