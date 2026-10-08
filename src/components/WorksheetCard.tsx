"use client";

import React from "react";
import Link from "next/link";
import { FileText, Download, ArrowRight } from "lucide-react";
import { AggregateWorksheetItem } from "@/data/resources";

interface WorksheetCardProps {
  worksheet: AggregateWorksheetItem;
}

export function WorksheetCard({ worksheet }: WorksheetCardProps) {
  const handleDownload = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>${worksheet.title}</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>${worksheet.title}</h2>
          <p>${worksheet.className} • ${worksheet.subjectName} • ${worksheet.difficulty} Level</p>
          <p>Total Questions: ${worksheet.questionsCount} | Marks: ${worksheet.totalMarks}</p>
          <hr style="margin: 20px 0;"/>
          <p>Official Digital School Practice Sheet Document</p>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
            {worksheet.className}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
            {worksheet.difficulty}
          </span>
        </div>

        <div className="flex items-start gap-3 my-2">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-2">
              {worksheet.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{worksheet.subjectName}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-400 block text-[11px]">Questions:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {worksheet.questionsCount} Problems
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Marks:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {worksheet.totalMarks} Marks
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <Link
          href={`/classes/${worksheet.classId}/${worksheet.subjectId}/${worksheet.topicSlug}#worksheet`}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Topic Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
