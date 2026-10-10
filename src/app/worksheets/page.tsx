import React from "react";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { fetchPublicWorksheets, fetchPublicHomeClasses } from "@/lib/data-service";
import { getAllSubjects } from "@/data/subjects";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WorksheetsExplorer } from "@/components/WorksheetsExplorer";

export const metadata: Metadata = {
  title: "Practice Worksheets Hub | Digital School",
  description:
    "Download and print chapter-wise practice test worksheets for Classes 3 to 8.",
};

export default async function WorksheetsPage() {
  const worksheets = await fetchPublicWorksheets();
  const classes = await fetchPublicHomeClasses();
  const subjects = getAllSubjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs items={[{ label: "Practice Worksheets" }]} />

      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Self-Study & Problem Solving</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Practice Worksheets Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Sharpen conceptual problem-solving skills with chapter-wise test worksheets. Each worksheet includes marks allocation, problem sets, and printable formatting.
        </p>
      </div>

      <WorksheetsExplorer
        initialWorksheets={worksheets}
        classes={classes}
        subjects={subjects}
      />
    </div>
  );
}
