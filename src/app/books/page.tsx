import React from "react";
import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { getAllBooks } from "@/data/resources";
import { getHomeClasses } from "@/data/classes";
import { getAllSubjects } from "@/data/subjects";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BooksExplorer } from "@/components/BooksExplorer";

export const metadata: Metadata = {
  title: "Curriculum Books Library | Digital School",
  description:
    "Explore and download official NCERT & SCERT curriculum chapter textbooks for Classes 3 to 8.",
};

export default function BooksPage() {
  const books = getAllBooks();
  const classes = getHomeClasses();
  const subjects = getAllSubjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs items={[{ label: "Curriculum Books" }]} />

      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 mb-3">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Curriculum Textbooks</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Curriculum Books Library
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Access official curriculum chapters for active classes 3 to 8. Filter by class and subject to view and download textbook chapters.
        </p>
      </div>

      <BooksExplorer initialBooks={books} classes={classes} subjects={subjects} />
    </div>
  );
}
