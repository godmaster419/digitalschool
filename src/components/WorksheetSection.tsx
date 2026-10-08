"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, X } from "lucide-react";
import { WorksheetContent } from "@/types";

interface WorksheetSectionProps {
  worksheet?: WorksheetContent;
  topicTitle: string;
}

export function WorksheetSection({ worksheet, topicTitle }: WorksheetSectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!worksheet || !worksheet.available) {
    return null;
  }

  const handleDownload = () => {
    // Generate a printable/downloadable clean format for the student
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${worksheet.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
            .title { font-size: 22px; font-weight: bold; margin: 0 0 8px 0; }
            .meta { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-top: 10px; }
            .badge { display: inline-block; background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; }
            .instructions { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; font-size: 13px; }
            .question-item { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed #cbd5e1; }
            .q-title { font-weight: 600; font-size: 15px; line-height: 1.5; }
            .answer-space { height: 60px; margin-top: 8px; border: 1px dotted #cbd5e1; border-radius: 4px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${worksheet.title}</h1>
            <div class="meta">
              <span><strong>Topic:</strong> ${topicTitle}</span>
              <span><strong>Total Marks:</strong> ${worksheet.totalMarks}</span>
              <span><strong>Total Questions:</strong> ${worksheet.questionsCount}</span>
              <span class="badge">${worksheet.difficulty} Difficulty</span>
            </div>
          </div>
          ${
            worksheet.instructions
              ? `<div class="instructions"><strong>Instructions:</strong><ul>${worksheet.instructions
                  .map((i) => `<li>${i}</li>`)
                  .join("")}</ul></div>`
              : ""
          }
          <div class="questions">
            <h3>Questions</h3>
            ${worksheet.sampleQuestions
              .map(
                (q) => `
              <div class="question-item">
                <div class="q-title">${q}</div>
                <div class="answer-space"></div>
              </div>`
              )
              .join("")}
          </div>
          <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px;">
            Digital School Learning Platform • Practice Worksheet
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Practice Worksheet
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {worksheet.difficulty}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {worksheet.title}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            id="view-worksheet-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Worksheet</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            id="download-worksheet-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Meta Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Total Questions</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {worksheet.questionsCount} Problems
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Total Marks</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {worksheet.totalMarks} Marks
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">Format</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            Printable PDF
          </div>
        </div>
      </div>

      {/* Worksheet Questions Preview */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Sample Practice Questions Preview:
        </h4>
        <div className="space-y-2.5">
          {worksheet.sampleQuestions.slice(0, 3).map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              {q}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full worksheet view */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Full Worksheet View
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {worksheet.title}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {worksheet.instructions && (
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <span className="font-bold block">Instructions for Students:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {worksheet.instructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  All Questions ({worksheet.sampleQuestions.length})
                </h4>
                {worksheet.sampleQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-sm text-slate-800 dark:text-slate-200"
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
