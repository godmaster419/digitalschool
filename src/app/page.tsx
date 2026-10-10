import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  Bookmark,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react";
import {
  fetchPublicHomeClasses,
  fetchPublicVideos,
  fetchPublicWorksheets,
  fetchPublicBooks,
} from "@/lib/data-service";
import { getAllTopics } from "@/data/topics";
import { ClassCard } from "@/components/ClassCard";
import { TopicCard } from "@/components/TopicCard";
import { VideoCard } from "@/components/VideoCard";
import { WorksheetCard } from "@/components/WorksheetCard";
import { BookCard } from "@/components/BookCard";

export default async function HomePage() {
  const homeClasses = await fetchPublicHomeClasses();
  const allTopics = getAllTopics();
  const popularVideos = (await fetchPublicVideos()).slice(0, 3);
  const featuredWorksheets = (await fetchPublicWorksheets()).slice(0, 3);
  const curriculumBooks = (await fetchPublicBooks()).slice(0, 3);

  // Curate 6 standout topics across classes
  const featuredTopics = allTopics.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/60 dark:via-[#090d16] dark:to-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Version badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Version 1 Active: Class 3 to Class 8 Syllabus</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            Digital School
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Learn Better. Understand Better.
          </p>

          <p className="mt-1 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
            (बेहतर सीखें। गहराई से समझें।)
          </p>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Class 3 to 8 के लिए Notes, Books, Videos और Practice Worksheets एक ही जगह।
            A clean, lightweight, and structured learning platform designed for clear understanding.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#explore-classes"
              id="hero-explore-classes-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Explore Classes</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>

            <a
              href="#learning-resources"
              id="hero-explore-content-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Explore Learning Content</span>
            </a>
          </div>

          {/* Learning Flow Indicators */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 max-w-3xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Simple Step-by-Step Learning Flow
            </div>
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">1. Select Class</span>
              <span className="text-slate-400">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">2. Select Subject</span>
              <span className="text-slate-400">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">3. View Topics</span>
              <span className="text-slate-400">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold">4. Notes • Video • Worksheet • Book</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. EXPLORE CLASSES (Section 9, 10, 11)                    */}
      {/* ========================================================= */}
      <section id="explore-classes" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Structured Curriculum</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Explore Classes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your class to explore subjects, chapter notes, videos, worksheets, and books.
            </p>
          </div>
          <Link
            href="/classes"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View All Classes Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Classes Cards Grid (Class 3 to 8 only - strictly hiding inactive ones) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeClasses.map((classItem) => (
            <ClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LEARNING RESOURCES SECTION (Section 40)               */}
      {/* ========================================================= */}
      <section
        id="learning-resources"
        className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              The Four Learning Pillars
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything a student needs for comprehensive academic success in one unified experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Notes Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-900/60">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  📘 Notes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Concepts को आसान भाषा में समझें। Bullet points, definitions, comparison tables, and formula sheets.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/classes"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Browse Notes by Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Videos Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-red-400 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 border border-red-200 dark:border-red-900/60">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  🎥 Videos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Topic-wise video lectures देखें। High-performance lazy-loading video explanations with real experiments.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/videos"
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Video Lectures Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Worksheets Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-900/60">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  📝 Worksheets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Practice करके अपनी तैयारी मजबूत करें। Chapter-wise test sheets, printable PDF downloads, and question banks.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/worksheets"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Practice Sheets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4. Books Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-900/60">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  📚 Books
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Useful learning books पढ़ें। NCERT & SCERT official curriculum chapter textbooks for offline study.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/books"
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Access Textbook Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FEATURED TOPICS (Section 39)                           */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Core Curriculum</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Topics & Chapters
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated conceptual chapters across Mathematics, Science, and Environmental Studies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. POPULAR VIDEOS PREVIEW (Section 39)                    */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
                <Video className="w-4 h-4" />
                <span>Video Lectures</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Popular Video Classes
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Visual explanations with high-performance lazy loading.
              </p>
            </div>
            <Link
              href="/videos"
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore All Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularVideos.map((video, idx) => (
              <VideoCard key={idx} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PRACTICE WORKSHEETS PREVIEW (Section 39)               */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <FileText className="w-4 h-4" />
              <span>Practice & Self-Assessment</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Practice Worksheets
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Download and practice chapter-wise question sheets to solidify problem-solving skills.
            </p>
          </div>
          <Link
            href="/worksheets"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>All Worksheets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorksheets.map((ws, idx) => (
            <WorksheetCard key={idx} worksheet={ws} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CURRICULUM BOOKS PREVIEW (Section 39)                  */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                <Bookmark className="w-4 h-4" />
                <span>Textbook Library</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Curriculum Books
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Official textbook chapters aligned with NCERT standards.
              </p>
            </div>
            <Link
              href="/books"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore All Books</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumBooks.map((b, idx) => (
              <BookCard key={idx} book={b} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. CALL TO ACTION / TRUST SECTION                         */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Your Learning Journey Today
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100 leading-relaxed">
              Every chapter comes with structured notes, illustrative examples, video demonstrations, and practice worksheets.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/classes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-900 hover:bg-blue-50 transition-colors shadow-md"
              >
                <span>Choose Your Class</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-700 transition-colors"
              >
                <span>About Our Methodology</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
