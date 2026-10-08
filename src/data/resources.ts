import { ALL_TOPICS } from "./topics";
import { ALL_CLASSES, getClassById } from "./classes";
import { getSubjectById } from "./subjects";
import { BookContent, VideoContent, WorksheetContent } from "@/types";

export interface AggregateBookItem extends BookContent {
  topicId: string;
  topicTitle: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  topicSlug: string;
}

export interface AggregateVideoItem extends VideoContent {
  topicId: string;
  topicTitle: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  topicSlug: string;
}

export interface AggregateWorksheetItem extends WorksheetContent {
  topicId: string;
  topicTitle: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  topicSlug: string;
}

/**
 * Returns all books for active classes
 */
export function getAllBooks(): AggregateBookItem[] {
  const activeClassIds = new Set(ALL_CLASSES.filter((c) => c.active).map((c) => c.id));
  const results: AggregateBookItem[] = [];

  for (const topic of ALL_TOPICS) {
    if (activeClassIds.has(topic.classId) && topic.book && topic.book.available) {
      const cls = getClassById(topic.classId);
      const sub = getSubjectById(topic.subjectId);
      results.push({
        ...topic.book,
        topicId: topic.id,
        topicTitle: topic.title,
        classId: topic.classId,
        className: cls?.name || topic.classId,
        subjectId: topic.subjectId,
        subjectName: sub?.name || topic.subjectId,
        topicSlug: topic.slug,
      });
    }
  }

  return results;
}

/**
 * Returns all video lectures for active classes
 */
export function getAllVideos(): AggregateVideoItem[] {
  const activeClassIds = new Set(ALL_CLASSES.filter((c) => c.active).map((c) => c.id));
  const results: AggregateVideoItem[] = [];

  for (const topic of ALL_TOPICS) {
    if (activeClassIds.has(topic.classId) && topic.video && topic.video.available) {
      const cls = getClassById(topic.classId);
      const sub = getSubjectById(topic.subjectId);
      results.push({
        ...topic.video,
        topicId: topic.id,
        topicTitle: topic.title,
        classId: topic.classId,
        className: cls?.name || topic.classId,
        subjectId: topic.subjectId,
        subjectName: sub?.name || topic.subjectId,
        topicSlug: topic.slug,
      });
    }
  }

  return results;
}

/**
 * Returns all practice worksheets for active classes
 */
export function getAllWorksheets(): AggregateWorksheetItem[] {
  const activeClassIds = new Set(ALL_CLASSES.filter((c) => c.active).map((c) => c.id));
  const results: AggregateWorksheetItem[] = [];

  for (const topic of ALL_TOPICS) {
    if (activeClassIds.has(topic.classId) && topic.worksheet && topic.worksheet.available) {
      const cls = getClassById(topic.classId);
      const sub = getSubjectById(topic.subjectId);
      results.push({
        ...topic.worksheet,
        topicId: topic.id,
        topicTitle: topic.title,
        classId: topic.classId,
        className: cls?.name || topic.classId,
        subjectId: topic.subjectId,
        subjectName: sub?.name || topic.subjectId,
        topicSlug: topic.slug,
      });
    }
  }

  return results;
}

/**
 * Counts available resources for a specific class
 */
export function getClassResourceCounts(classId: string) {
  const topics = ALL_TOPICS.filter((t) => t.classId === classId);
  const notesCount = topics.filter((t) => t.notes?.available).length;
  const videosCount = topics.filter((t) => t.video?.available).length;
  const worksheetsCount = topics.filter((t) => t.worksheet?.available).length;
  const booksCount = topics.filter((t) => t.book?.available).length;

  return {
    topicsCount: topics.length,
    notesCount,
    videosCount,
    worksheetsCount,
    booksCount,
  };
}
