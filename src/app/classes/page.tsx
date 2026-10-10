import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowRight, Lock, Calendar } from "lucide-react";
import { fetchPublicAllClasses } from "@/lib/data-service";
import { ClassCard } from "@/components/ClassCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Classes Catalog (Class 3 to 8) | Digital School",
  description:
    "Explore classes 3 to 8 syllabus, subjects, chapter-wise notes, conceptual videos, worksheets, and textbooks.",
};

export default async function ClassesCatalogPage() {
  const allClasses = await fetchPublicAllClasses();
  const activeClasses = allClasses.filter((c) => c.active);
  const inactiveClasses = allClasses.filter((c) => !c.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs items={[{ label: "Classes Catalog" }]} />

      {/* Header */}
      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Active Learning Levels (Version 1)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Browse by Class
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Choose an active class below to access subject-wise curricula, chapter notes, videos, worksheets, and books.
        </p>
      </div>

      {/* Active Classes Grid */}
      <div className="space-y-4 mb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Active Classes (Class 3 to 8)
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
            {activeClasses.length} Active Classes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeClasses.map((classItem) => (
            <ClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>
      </div>

      {/* Upcoming / Foundation Classes Roadmap Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Architecture Roadmap</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Upcoming Foundation Levels (Inactive in Version 1)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Data models and curriculum routing for early childhood and foundational classes are structured in the codebase and will be activated in upcoming phases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inactiveClasses.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {c.level === "pre-primary" ? "Pre-Primary" : "Foundation"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <Lock className="w-3 h-3" />
                    <span>Inactive (V1)</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{c.hindiName}</p>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {c.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status: Inactive in V1</span>
                <span>Planned for V2</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 dark:text-slate-300">
            Want to learn how class visibility works in the CMS architecture?
          </span>
          <Link
            href="/about"
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Read Architecture Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
