import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById, getAllClasses } from "@/data/classes";
import { getSubjectById } from "@/data/subjects";
import { getTopicsForClassAndSubject } from "@/data/topics";
import { SubjectCard } from "@/components/SubjectCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GraduationCap, ArrowLeft } from "lucide-react";

interface ClassPageProps {
  params: Promise<{
    classId: string;
  }>;
}

export function generateStaticParams() {
  return getAllClasses()
    .filter((c) => c.active)
    .map((c) => ({
      classId: c.slug,
    }));
}

export async function generateMetadata({ params }: ClassPageProps): Promise<Metadata> {
  const { classId } = await params;
  const classItem = getClassById(classId);

  if (!classItem || !classItem.active) {
    return {
      title: "Class Not Found | Digital School",
    };
  }

  return {
    title: `${classItem.name} (${classItem.hindiName}) Syllabus & Subjects | Digital School`,
    description: `Access subjects, chapter notes, videos, worksheets, and books for ${classItem.name}. Choose a subject to continue learning.`,
  };
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { classId } = await params;
  const classItem = getClassById(classId);

  // If class does not exist or is inactive in Version 1, return 404
  if (!classItem || !classItem.active) {
    notFound();
  }

  const subjects = classItem.availableSubjectIds
    .map((subId) => getSubjectById(subId))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs
        items={[
          { label: "Classes", href: "/classes" },
          { label: classItem.name },
        ]}
      />

      {/* Class Hero Header */}
      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{classItem.level === "primary" ? "Primary Level" : "Middle School"}</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {classItem.hindiName}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {classItem.name}
            </h1>

            <p className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 mt-2">
              Choose a subject to continue learning.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {classItem.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shrink-0 shadow-xs">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {subjects.length}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Configured Subjects
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Available Subjects
          </h2>
          <span className="text-xs text-slate-400">
            Click any subject to open chapters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            if (!subject) return null;
            const topicCount = getTopicsForClassAndSubject(classItem.id, subject.id).length;
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                classSlug={classItem.slug}
                topicCount={topicCount}
              />
            );
          })}
        </div>
      </div>

      {/* Back to all classes */}
      <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Classes</span>
        </Link>
      </div>
    </div>
  );
}
