import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About & Architecture | Digital School",
  description:
    "Learn about Digital School's educational mission, four learning pillars, lightweight architecture, and future CMS readiness.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs items={[{ label: "About Digital School" }]} />

      {/* Hero Header */}
      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Educational Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          About Digital School
        </h1>
        <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold mt-2">
          Learn Better. Understand Better. (बेहतर सीखें। गहराई से समझें।)
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Digital School is an open educational repository built for school students. Our aim is to make quality, curriculum-aligned academic resources—including bilingual reading notes, conceptual videos, printable practice worksheets, and textbooks—universally accessible without heavy barriers.
        </p>
      </div>

      {/* Grid of Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* Pillar 1: Lightweight & Fast */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/60">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Lightweight-First Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Many educational portals are overloaded with heavy scripts, background tracking, and slow loading databases. Digital School is engineered to load in fractions of a second on mobile networks, utilizing static structured data, code splitting, and lazy video facade patterns.
          </p>
        </div>

        {/* Pillar 2: The 4 Learning Pillars */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/60">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            The 4 Learning Pillars
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every topic is mapped against:
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>📘 Reading Notes:</strong> Definitions, comparisons, tables & formulas.</li>
            <li><strong>🎥 Conceptual Videos:</strong> High-definition audiovisual lessons.</li>
            <li><strong>📝 Practice Worksheets:</strong> Formatted test problems with marks.</li>
            <li><strong>📚 Curriculum Books:</strong> NCERT & SCERT official chapter textbooks.</li>
          </ul>
        </div>
      </div>

      {/* Version 1 & Future Architecture */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white mb-16 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-bold">Curriculum Roadmap & Future CMS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="font-bold text-base text-white">Version 1 (Active Scope)</h3>
            <p className="text-xs leading-relaxed">
              Focuses on <strong>Class 3 to Class 8</strong> across Science, Mathematics, Environmental Studies, Social Science, Hindi, and English.
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              No backend or insecure fake authentication is used; all content is structured strictly in modular data layers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="font-bold text-base text-white">Future Scope (Pre-Primary & Admin CMS)</h3>
            <p className="text-xs leading-relaxed">
              Data models for <strong>LKG, UKG, Class 1, and Class 2</strong> are already fully architected in the system code.
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              When the future Admin Dashboard and database are introduced, administrators can toggle class visibility (Show/Hide) dynamically without refactoring code.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10">
          <span>Current Release: Version 1.0 (Static Architecture)</span>
          <span className="text-amber-300 font-medium">Future CMS Ready</span>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center py-6">
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <span>Start Learning: Browse Classes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
