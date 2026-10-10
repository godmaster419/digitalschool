import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPublicClassBySlug, fetchPublicTopic, fetchPublicTopics } from "@/lib/data-service";
import { getSubjectById } from "@/data/subjects";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TopicLearningHub } from "@/components/TopicLearningHub";
import { ArrowLeft } from "lucide-react";

import { getAllClasses } from "@/data/classes";
import { getAllTopics } from "@/data/topics";

interface TopicPageProps {
  params: Promise<{
    classId: string;
    subjectId: string;
    topicId: string;
  }>;
}

export function generateStaticParams() {
  const activeClassIds = new Set(getAllClasses().filter((c) => c.active).map((c) => c.id));
  return getAllTopics()
    .filter((t) => activeClassIds.has(t.classId))
    .map((t) => ({
      classId: t.classId,
      subjectId: t.subjectId,
      topicId: t.slug,
    }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { classId, subjectId, topicId } = await params;
  const classItem = await fetchPublicClassBySlug(classId);
  const subject = getSubjectById(subjectId);
  const topic = classItem ? await fetchPublicTopic(classItem.id, subjectId, topicId) : undefined;

  if (!classItem || !subject || !topic || !classItem.active) {
    return {
      title: "Content Not Found | Digital School",
    };
  }

  return {
    title: `${topic.title} (${topic.hindiTitle}) — ${classItem.name} ${subject.name} | Digital School`,
    description: `${topic.description} Complete chapter notes, video tutorial, practice worksheet, and NCERT textbook.`,
    openGraph: {
      title: `${topic.title} — Digital School`,
      description: topic.description,
      type: "article",
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { classId, subjectId, topicId } = await params;
  const classItem = await fetchPublicClassBySlug(classId);
  const subject = getSubjectById(subjectId);
  const topic = classItem ? await fetchPublicTopic(classItem.id, subjectId, topicId) : undefined;

  if (!classItem || !subject || !topic || !classItem.active) {
    notFound();
  }

  // Find neighbouring topics for navigation
  const allSubjectTopics = await fetchPublicTopics(classItem.id, subject.id);
  const currentIndex = allSubjectTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? allSubjectTopics[currentIndex - 1] : undefined;
  const nextTopic =
    currentIndex < allSubjectTopics.length - 1 ? allSubjectTopics[currentIndex + 1] : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Classes", href: "/classes" },
          { label: classItem.name, href: `/classes/${classItem.slug}` },
          { label: subject.name, href: `/classes/${classItem.slug}/${subject.slug}` },
          { label: topic.title },
        ]}
      />

      {/* 2. Topic Header & Overview */}
      <div className="my-6 sm:my-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
            {classItem.name} • {subject.name}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Chapter {topic.chapterNumber}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {topic.title}
        </h1>

        {topic.hindiTitle && topic.hindiTitle !== topic.title && (
          <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 mt-1">
            {topic.hindiTitle}
          </p>
        )}

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 max-w-3xl leading-relaxed">
          {topic.description}
        </p>
      </div>

      {/* 3. Core Topic Learning Hub (Notes, Video, Worksheet, Book) */}
      <TopicLearningHub
        topic={topic}
        classItem={classItem}
        subject={subject}
        prevTopic={prevTopic}
        nextTopic={nextTopic}
      />

      {/* Back to Subject */}
      <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link
          href={`/classes/${classItem.slug}/${subject.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All {classItem.name} {subject.name} Chapters</span>
        </Link>
      </div>
    </div>
  );
}
