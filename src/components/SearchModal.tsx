"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Video, FileText, Bookmark, GraduationCap, ChevronRight, CornerDownLeft } from "lucide-react";
import { searchContent } from "@/data/search";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Derive results directly without cascading effect setState
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchContent(query);
  }, [query]);

  const filteredResults = results.filter((item) => {
    if (selectedType === "all") return true;
    if (selectedType === "notes" && item.badge === "Notes") return true;
    if (selectedType === "video" && item.type === "video") return true;
    if (selectedType === "worksheet" && item.type === "worksheet") return true;
    if (selectedType === "book" && item.type === "book") return true;
    if (selectedType === "topic" && (item.type === "topic" || item.badge.includes("Topic"))) return true;
    return true;
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const getBadgeIcon = (type: string, badge: string) => {
    if (badge === "Notes") return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
    if (type === "video") return <Video className="w-3.5 h-3.5 text-red-500" />;
    if (type === "worksheet") return <FileText className="w-3.5 h-3.5 text-emerald-500" />;
    if (type === "book") return <Bookmark className="w-3.5 h-3.5 text-amber-500" />;
    return <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search content modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, subjects, topics, 'भिन्न', 'Nutrition', notes, videos..."
            id="global-search-input"
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
          <span className="text-slate-400 mr-1 text-[11px] font-medium uppercase tracking-wider">Filter:</span>
          {[
            { id: "all", label: "All Content" },
            { id: "topic", label: "Topics & Chapters" },
            { id: "notes", label: "Notes" },
            { id: "video", label: "Videos" },
            { id: "worksheet", label: "Worksheets" },
            { id: "book", label: "Books" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
                selectedType === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-medium">Type any keyword to search across Digital School</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching: <span className="text-blue-600 dark:text-blue-400 font-medium">भिन्न</span>,{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">Digestive System</span>,{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">Class 6 Science</span>, or{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">Multiplication</span>
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No content found</p>
              <p className="text-sm text-slate-400 mt-1">
                No matching results for &ldquo;<span className="text-slate-600 dark:text-slate-300 font-medium">{query}</span>&rdquo;. Try another keyword.
              </p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={handleClose}
                className="group flex items-start justify-between p-3 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 group-hover:border-blue-300 dark:group-hover:border-blue-700">
                    {getBadgeIcon(item.type, item.badge)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </span>
                      {item.hindiTitle && item.hindiTitle !== item.title && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          ({item.hindiTitle})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.className && (
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {item.className}
                        </span>
                      )}
                      {item.subjectName && (
                        <>
                          <span>•</span>
                          <span>{item.subjectName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 pl-2 pt-1">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredResults.length} result(s) found</span>
          <span className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 inline-flex items-center">
              <CornerDownLeft className="w-3 h-3" />
            </kbd>
            <span>to open</span>
          </span>
        </div>
      </div>
    </div>
  );
}
