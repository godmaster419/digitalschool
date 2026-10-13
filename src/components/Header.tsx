"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Search,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/classes", label: "Classes" },
    { href: "/books", label: "Books" },
    { href: "/videos", label: "Videos" },
    { href: "/worksheets", label: "Worksheets" },
    { href: "/about", label: "About" },
  ];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg group"
            id="brand-logo-link"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                Digital School
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Classes 3 to 8 Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search Trigger, Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              id="header-search-btn"
              aria-label="Search learning content"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 animate-fade-in shadow-xl"
            id="mobile-navigation-menu"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Classes 3 to 8 (Active)</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">NCERT Aligned</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
