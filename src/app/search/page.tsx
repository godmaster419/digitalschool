import React from "react";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchPageClient } from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Search Learning Content | Digital School",
  description: "Search across classes, subjects, topics, notes, videos, worksheets, and books.",
};

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs items={[{ label: "Search" }]} />

      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-3">
          <Search className="w-3.5 h-3.5" />
          <span>Global Search Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Search Content
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Quickly find specific chapters, Hindi & English terminology, reading notes, videos, practice worksheets, and textbooks.
        </p>
      </div>

      <SearchPageClient />
    </div>
  );
}
