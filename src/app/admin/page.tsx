"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Video,
  FileCheck2,
  Bookmark,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { fetchAdminDashboardStats, AdminDashboardStats } from "@/lib/data-service";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseActive, setSupabaseActive] = useState(false);

  useEffect(() => {
    setSupabaseActive(isSupabaseConfigured());
    fetchAdminDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ========================================================= */}
      {/* 1. WELCOME HEADER                                         */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital School Content Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin CMS Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Overview of learning hierarchy, published educational assets, and visibility controls.
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${
              supabaseActive
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{supabaseActive ? "Supabase Live Connected" : "Local / Demo Database Mode"}</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. STATS CARDS                                            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Classes Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Classes
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? "..." : stats?.totalClasses}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {loading ? "" : `${stats?.activeClasses} Active`}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Classes 3 to 8 Active, LKG-2 Roadmap
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <Link
              href="/admin/classes"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              Manage Classes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Subjects Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subjects
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? "..." : stats?.totalSubjects}
            </span>
            <span className="text-xs font-medium text-slate-500">Curricula</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Math, Science, EVS, Hindi, English, etc.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <Link
              href="/admin/subjects"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              Manage Subjects <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Topics Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topics / Chapters
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? "..." : stats?.totalTopics}
            </span>
            <span className="text-xs font-medium text-slate-500">Chapters</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across All Class-Subject Combinations
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <Link
              href="/admin/topics"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              Manage Topics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Published Learning Assets Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Published Content
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading
                ? "..."
                : (stats?.publishedNotes || 0) +
                  (stats?.publishedVideos || 0) +
                  (stats?.publishedWorksheets || 0) +
                  (stats?.publishedBooks || 0)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Live Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Notes, Videos, Worksheets & Textbooks
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Drafts excluded</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CONTENT PILLARS BREAKDOWN                               */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Published Educational Assets Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/notes"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200/80 dark:border-slate-700/80 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Notes</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {loading ? "..." : stats?.publishedNotes}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Published Chapter Notes</p>
          </Link>

          <Link
            href="/admin/videos"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200/80 dark:border-slate-700/80 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
              <Video className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Videos</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
              {loading ? "..." : stats?.publishedVideos}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">YouTube & Shorts</p>
          </Link>

          <Link
            href="/admin/worksheets"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/80 dark:border-slate-700/80 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Worksheets</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              {loading ? "..." : stats?.publishedWorksheets}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">PDF Practice Papers</p>
          </Link>

          <Link
            href="/admin/books"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200/80 dark:border-slate-700/80 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Books</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              {loading ? "..." : stats?.publishedBooks}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">NCERT Textbooks</p>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. QUICK ACTIONS SECTION                                  */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Quick Content Actions
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Quickly create or upload educational assets across the curriculum hierarchy.
        </p>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/classes"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Class</span>
          </Link>

          <Link
            href="/admin/subjects"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Subject</span>
          </Link>

          <Link
            href="/admin/topics"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-purple-600" />
            <span>Add Topic / Chapter</span>
          </Link>

          <Link
            href="/admin/notes"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Notes</span>
          </Link>

          <Link
            href="/admin/videos"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-red-600" />
            <span>Add Video</span>
          </Link>

          <Link
            href="/admin/worksheets"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Upload Worksheet</span>
          </Link>

          <Link
            href="/admin/books"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Add Book</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. HIERARCHY REFERENCE GUIDANCE                           */}
      {/* ========================================================= */}
      <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200">
        <h3 className="font-bold text-sm mb-1 text-blue-900 dark:text-blue-100">
          Digital School Learning Hierarchy Model
        </h3>
        <p className="text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
          The content follows a clean 4-tier educational structure:
          <span className="font-semibold"> Class → Subject → Chapter / Topic → Learning Assets (Notes, Video, Worksheet, Book)</span>.
          Changing visibility status (Active / Inactive, Published / Draft) immediately reflects on the public student interface.
        </p>
      </div>
    </div>
  );
}
