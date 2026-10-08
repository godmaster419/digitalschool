"use client";

import React, { useState } from "react";
import { Bookmark, Search } from "lucide-react";
import { AggregateBookItem } from "@/data/resources";
import { ClassItem, SubjectItem } from "@/types";
import { BookCard } from "./BookCard";

interface BooksExplorerProps {
  initialBooks: AggregateBookItem[];
  classes: ClassItem[];
  subjects: SubjectItem[];
}

export function BooksExplorer({ initialBooks, classes, subjects }: BooksExplorerProps) {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBooks = initialBooks.filter((book) => {
    if (selectedClass !== "all" && book.classId !== selectedClass) return false;
    if (selectedSubject !== "all" && book.subjectId !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        book.title.toLowerCase().includes(q) ||
        (book.hindiTitle && book.hindiTitle.toLowerCase().includes(q)) ||
        book.publisher.toLowerCase().includes(q) ||
        book.className.toLowerCase().includes(q) ||
        book.subjectName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Filters Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter books by title, publisher..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Class */}
          <div className="flex items-center gap-2">
            <label htmlFor="class-filter" className="text-xs font-semibold text-slate-500 shrink-0">
              Class:
            </label>
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="all">All Active Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Subject */}
          <div className="flex items-center gap-2">
            <label htmlFor="subject-filter" className="text-xs font-semibold text-slate-500 shrink-0">
              Subject:
            </label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedClass !== "all" || selectedSubject !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">Showing {filteredBooks.length} book(s)</span>
            <button
              onClick={() => {
                setSelectedClass("all");
                setSelectedSubject("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No matching books found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your class or subject filter options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, idx) => (
            <BookCard key={idx} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
