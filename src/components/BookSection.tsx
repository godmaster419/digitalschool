"use client";

import React, { useState } from "react";
import { Bookmark, Download, Eye, X } from "lucide-react";
import { BookContent } from "@/types";

interface BookSectionProps {
  book?: BookContent;
  topicTitle: string;
}

export function BookSection({ book, topicTitle }: BookSectionProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  if (!book || !book.available) {
    return null;
  }

  const handleDownload = () => {
    // Generate simulated PDF reader or clean educational print window
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${book.title}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.8; color: #1e293b; }
            .cover { text-align: center; border-bottom: 3px double #94a3b8; padding-bottom: 30px; margin-bottom: 40px; }
            .book-title { font-size: 26px; font-weight: bold; margin-bottom: 8px; }
            .publisher { color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .chapter { font-size: 20px; font-weight: bold; margin-top: 30px; color: #1e3a8a; }
            .content { font-size: 16px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="cover">
            <div class="publisher">${book.publisher} • ${book.edition}</div>
            <h1 class="book-title">${book.title}</h1>
            ${book.hindiTitle ? `<p style="font-size: 18px; color: #475569;">${book.hindiTitle}</p>` : ""}
            <div style="font-size: 13px; color: #64748b; margin-top: 15px;">Official Curriculum Chapter • ${book.pages} Pages</div>
          </div>
          <div class="chapter">Chapter ${book.chapterNumber}: ${topicTitle}</div>
          <div class="content">
            <p>This digital textbook chapter is aligned with standard national learning competencies. It contains the official syllabus concepts, foundational exercises, laboratory observations, and chapter-end review questions.</p>
            <p>Use this reference book alongside your Digital School lecture notes and practice worksheets for in-depth mastery of the concepts.</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Related Curriculum Book
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {book.publisher}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {book.title}
            </h3>
            {book.hindiTitle && (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {book.hindiTitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsReaderOpen(true)}
            id="view-book-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Chapter</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            id="download-book-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Book</span>
          </button>
        </div>
      </div>

      {/* Book details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Publisher</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {book.publisher}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Edition</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {book.edition}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Chapter</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            Chapter {book.chapterNumber}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Length</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {book.pages} Pages
          </div>
        </div>
      </div>

      {/* Modal for viewing book chapter info */}
      {isReaderOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsReaderOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                  Curriculum Textbook Viewer
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {book.title}
                </h3>
              </div>
              <button
                onClick={() => setIsReaderOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Curriculum Alignment:</strong> This chapter corresponds to Chapter {book.chapterNumber} of the official {book.publisher} syllabus for school learning.
              </div>
              <p>
                The complete textbook content for <strong>{topicTitle}</strong> is available in digital format. You can download or print this chapter for offline study.
              </p>
              <div className="text-xs text-slate-400">
                Edition: {book.edition} • Total Length: {book.pages} Pages
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setIsReaderOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Download className="w-4 h-4" />
                <span>Open / Download Chapter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
