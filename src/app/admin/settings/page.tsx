"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Server,
  HardDrive,
  KeyRound,
  FileCode,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getClientAdminProfile, AdminProfile } from "@/lib/supabase/auth";

export default function AdminSettingsPage() {
  const [supabaseActive, setSupabaseActive] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    setSupabaseActive(isSupabaseConfigured());
    getClientAdminProfile().then(setAdminProfile);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Diagnostics & Database</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          CMS Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Supabase infrastructure status, Row-Level Security policies, and administrative account controls.
        </p>
      </div>

      {/* 1. Supabase Connection Status Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Supabase Backend Diagnostics
              </h2>
              <p className="text-xs text-slate-500">
                PostgreSQL Database, Authentication & Storage Integration
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              supabaseActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            }`}
          >
            {supabaseActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Connected (Live Production)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Demo Fallback Mode</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Server className="w-3.5 h-3.5 text-blue-500" />
              <span>Project URL</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured in .env.local"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Anon Public Key</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "••••••••••••••••••••••••" : "Missing in .env.local"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
              <span>Storage Bucket</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              digital-school-assets
            </div>
          </div>
        </div>
      </div>

      {/* 2. Admin User Authorization Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Current Session & Admin Authorization
            </h2>
            <p className="text-xs text-slate-500">
              Verified server-side role from public.admin_users
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Signed In As:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {adminProfile?.email || "Unknown"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Assigned Role:</span>
            <span className="font-semibold text-blue-600 capitalize">
              {adminProfile?.role || "Administrator"} {adminProfile?.isDemo ? "(Demo Session)" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Security Model:</span>
            <span className="text-slate-700 dark:text-slate-300">
              Dedicated PostgreSQL Table + Security Definer RLS
            </span>
          </div>
        </div>
      </div>

      {/* 3. Database Migration Script Reference */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Supabase SQL Scripts Ready
              </h2>
              <p className="text-xs text-slate-500">
                Found in <code className="text-blue-600 font-mono">supabase/schema.sql</code> and <code className="text-blue-600 font-mono">supabase/seed.sql</code>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2">
          <div className="text-slate-500">{"// How to deploy in Supabase Dashboard:"}</div>
          <div>1. Open your Supabase Dashboard &gt; SQL Editor.</div>
          <div>2. Paste the contents of <span className="text-emerald-400">supabase/schema.sql</span> to create tables &amp; RLS policies.</div>
          <div>3. Run <span className="text-emerald-400">supabase/seed.sql</span> to migrate all Class 3–8 syllabus &amp; learning assets.</div>
          <div>4. In Authentication &gt; Users, add your admin user email and add their UUID into <span className="text-amber-400">admin_users</span>.</div>
        </div>
      </div>
    </div>
  );
}
