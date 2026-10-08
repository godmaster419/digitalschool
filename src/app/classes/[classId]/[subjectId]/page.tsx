import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById } from "@/data/classes";
import { getSubjectById } from "@/data/subjects";
import { getTopicsForClassAndSubject } from "@/data/topics";
import { TopicCard } from "@/components/TopicCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowLeft, BookOpen } from "lucide-react";

import { getAllClasses } from "@/data/classes";

interface SubjectPageProps {
  params: Promise<{
    classId: string;
    subjectId: string;
  }>;
}

export function generateStaticParams() {
  const params: Array<{ classId: string; subjectId: string }> = [];
  const activeClasses = getAllClasses().filter((c) => c.active);
  for (const c of activeClasses) {
    for (const subId of c.availableSubjectIds) {
      params.push({
        classId: c.slug,
        subjectId: subId,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { classId, subjectId } = await params;
  const classItem = getClassById(classId);
  const subject = getSubjectById(subjectId);

  if (!classItem || !subject || !classItem.active) {
    return {
      title: "Subject Not Found | Digital School",
    };
  }

  return {
    title: `${classItem.name} ${subject.name} (${subject.hindiName}) Topics & Notes | Digital School`,
    description: `Complete chapters, reading notes, conceptual videos, worksheets, and books for ${classItem.name} ${subject.name}.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { classId, subjectId } = await params;
  const classItem = getClassById(classId);
  const subject = getSubjectById(subjectId);

  if (!classItem || !subject || !classItem.active) {
    notFound();
  }

  const topics = getTopicsForClassAndSubject(classItem.id, subject.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <Breadcrumbs
        items={[
          { label: "Classes", href: "/classes" },
          { label: classItem.name, href: `/classes/${classItem.slug}` },
          { label: subject.name },
        ]}
      />

      {/* Header */}
      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {classItem.name} • Syllabus
              </span>
              <span className="text-xs text-slate-400">({subject.hindiName})</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {classItem.name} {subject.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shrink-0 shadow-xs">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {topics.length}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Active Topics
            </div>
          </div>
        </div>
      </div>

      {/* Topics / Chapters Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Topics / Chapters
          </h2>
          <span className="text-xs text-slate-400">
            Select a topic to read notes, watch videos, and practice worksheets
          </span>
        </div>

        {topics.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
              Chapters Coming Soon
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Curriculum chapters for {classItem.name} {subject.name} are currently being prepared for publishing.
            </p>
            <div className="mt-6">
              <Link
                href={`/classes/${classItem.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
              >
                <span>View Other Subjects in {classItem.name}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                classNameLabel={classItem.name}
                subjectNameLabel={subject.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link
          href={`/classes/${classItem.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {classItem.name} Subjects</span>
        </Link>
        <Link
          href="/classes"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
        >
          All Classes
        </Link>
      </div>
    </div>
  );
}
