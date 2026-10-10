"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  Layers,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Video,
  FileCheck2,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import { getClientAdminProfile, signOutAdmin, AdminProfile } from "@/lib/supabase/auth";
import { useTheme } from "@/components/ThemeContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Classes", href: "/admin/classes", icon: Layers },
  { label: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { label: "Topics", href: "/admin/topics", icon: FileSpreadsheet },
  { label: "Notes", href: "/admin/notes", icon: FileText },
  { label: "Videos", href: "/admin/videos", icon: Video },
  { label: "Worksheets", href: "/admin/worksheets", icon: FileCheck2 },
  { label: "Books", href: "/admin/books", icon: Bookmark },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // If this is the login page, render children directly without the admin layout shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    getClientAdminProfile().then((profile) => {
      if (!profile) {
        router.replace("/admin/login?next=" + encodeURIComponent(pathname));
      } else {
        setAdminUser(profile);
        setAuthChecking(false);
      }
    });
  }, [pathname, isLoginPage, router]);

  // Close mobile sidebar on route navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOutAdmin();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#090d16] flex flex-col antialiased text-slate-900 dark:text-slate-100">
      {/* ========================================================= */}
      {/* 1. TOP HEADER                                             */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation"
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                  Digital School
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  CMS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                Administration Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Live Website Button */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Badge */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {adminUser?.email ? adminUser.email.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[130px]">
                {adminUser?.email || "admin"}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 capitalize">
                {adminUser?.role || "Admin"}
                {adminUser?.isDemo ? " (Demo)" : ""}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. BODY: SIDEBAR + MAIN CONTENT                           */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 mb-1">
              CMS Navigation
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Digital School CMS
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                v1.0
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Admin control center for Classes, Subjects, Topics & Learning Assets.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
