"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Video, FileText, Bookmark, ShieldCheck } from "lucide-react";
import { getHomeClasses } from "@/data/classes";

export function Footer() {
  const pathname = usePathname();
  const homeClasses = getHomeClasses();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Digital School
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A lightweight, high-performance educational portal offering class-wise notes, conceptual video lectures, practice worksheets, and curriculum books for school students.
            </p>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Learn Better. Understand Better.
            </div>
          </div>

          {/* Active Classes Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Active Classes (V1)
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {homeClasses.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/classes/${c.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-slate-400 font-normal">{c.hindiName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Learning Pillars Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Learning Pillars
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/classes"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span>Class-wise Subjects</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Curriculum Books</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-red-500" />
                  <span>Video Lectures Hub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/worksheets"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Practice Worksheets</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Architecture & About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Academic Platform
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Designed with a lightweight architecture for fast loading on all mobile networks without heavy backend overhead.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Future Classes Architecture
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                LKG, UKG, Class 1, and Class 2 data architecture ready for future rollout.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © 2026 Digital School. For Educational Non-Commercial Learning.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
              About & Methodology
            </Link>
            <Link href="/classes" className="hover:text-blue-600 dark:hover:text-blue-400">
              Browse Classes
            </Link>
            <Link
              href="/admin"
              className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
