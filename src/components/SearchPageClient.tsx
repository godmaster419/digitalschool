"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Bookmark,
  GraduationCap,
  ChevronRight,
  X,
} from "lucide-react";
import { searchContent } from "@/data/search";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>("all");

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

  const getBadgeIcon = (type: string, badge: string) => {
    if (badge === "Notes") return <BookOpen className="w-4 h-4 text-blue-500" />;
    if (type === "video") return <Video className="w-4 h-4 text-red-500" />;
    if (type === "worksheet") return <FileText className="w-4 h-4 text-emerald-500" />;
    if (type === "book") return <Bookmark className="w-4 h-4 text-amber-500" />;
    return <GraduationCap className="w-4 h-4 text-indigo-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, subjects, topics, 'भिन्न', 'Nutrition', notes, videos..."
            className="w-full pl-12 pr-10 py-3 text-sm sm:text-base bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 pt-2 text-xs overflow-x-auto">
          <span className="text-slate-400 mr-1 font-medium">Filter by:</span>
          {[
            { id: "all", label: "All Types" },
            { id: "topic", label: "Topics" },
            { id: "notes", label: "Notes" },
            { id: "video", label: "Videos" },
            { id: "worksheet", label: "Worksheets" },
            { id: "book", label: "Books" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                selectedType === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {!query.trim() ? (
          <div className="py-16 text-center text-slate-500 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Type keywords to search learning content
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Search by topics like &ldquo;भिन्न&rdquo;, &ldquo;Multiplication&rdquo;, &ldquo;Digestive System&rdquo;, &ldquo;Class 6 Science&rdquo;
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="py-16 text-center text-slate-500 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No content found</p>
            <p className="text-xs text-slate-400 mt-1">
              No matching content found for &ldquo;{query}&rdquo;. Try another keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 px-1 font-medium">
              Found {filteredResults.length} matching result(s)
            </div>
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="group block p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      {getBadgeIcon(item.type, item.badge)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.hindiTitle && item.hindiTitle !== item.title && (
                          <span className="text-xs text-slate-400">({item.hindiTitle})</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                        {item.className && (
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
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
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 mt-2" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchPageClient() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
