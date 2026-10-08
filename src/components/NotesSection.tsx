import React from "react";
import { BookOpen, Clock, AlertCircle } from "lucide-react";
import { NoteContent } from "@/types";

interface NotesSectionProps {
  notes: NoteContent;
  topicTitle?: string;
}

export function NotesSection({ notes }: NotesSectionProps) {
  if (!notes || !notes.available) {
    return null;
  }

  return (
    <div className="space-y-8 text-slate-800 dark:text-slate-200">
      {/* Overview & Reading Time Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <BookOpen className="w-4 h-4" />
            <span>Chapter Summary & Overview</span>
          </div>
          {notes.readTime && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200">
              <Clock className="w-3 h-3" />
              <span>{notes.readTime}</span>
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {notes.overview}
        </p>
      </div>

      {/* Structured Sections */}
      <div className="space-y-10">
        {notes.sections.map((section, idx) => (
          <section
            key={section.id || idx}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
          >
            {/* Heading and Hindi Subheading */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <span>Section {idx + 1}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {section.heading}
              </h3>
              {section.hindiHeading && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {section.hindiHeading}
                </p>
              )}
            </div>

            {/* Paragraph Text */}
            {section.content && (
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {section.content}
              </p>
            )}

            {/* Callout Notice if available */}
            {section.callout && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  section.callout.type === "important"
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                    : section.callout.type === "tip"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200"
                    : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200"
                }`}
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  {section.callout.title && (
                    <div className="font-bold mb-0.5">{section.callout.title}</div>
                  )}
                  <div>{section.callout.text}</div>
                </div>
              </div>
            )}

            {/* Definitions Block */}
            {section.definitions && section.definitions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Key Concepts & Definitions (मुख्य पारिभाषिक शब्दावली)
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {section.definitions.map((item, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80"
                    >
                      <span className="font-bold text-sm text-blue-900 dark:text-blue-300 block mb-1">
                        {item.term}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.definition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bullet Points */}
            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-2.5 pt-2 text-sm text-slate-700 dark:text-slate-300">
                {section.bulletPoints.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-2" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Numbered Points */}
            {section.numberedPoints && section.numberedPoints.length > 0 && (
              <ol className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300">
                {section.numberedPoints.map((point, numIdx) => (
                  <li key={numIdx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {numIdx + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ol>
            )}

            {/* Examples */}
            {section.examples && section.examples.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Illustrative Examples (उदाहरण)
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {section.examples.map((ex, eIdx) => (
                    <div
                      key={eIdx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 font-sans"
                    >
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                        {ex.title}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {ex.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison or Data Table */}
            {section.table && (
              <div className="pt-2">
                {section.table.caption && (
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    {section.table.caption}
                  </h4>
                )}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="p-3 sm:p-3.5 font-bold text-slate-900 dark:text-slate-100"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="p-3 sm:p-3.5 text-slate-600 dark:text-slate-300"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
