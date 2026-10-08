import { ALL_TOPICS } from "./topics";
import { ALL_CLASSES, getClassById } from "./classes";
import { getSubjectById } from "./subjects";
import { SearchResultItem } from "@/types";

/**
 * Builds client-side unified search index from active content
 */
export function buildSearchIndex(): SearchResultItem[] {
  const activeClassIds = new Set(ALL_CLASSES.filter((c) => c.active).map((c) => c.id));
  const results: SearchResultItem[] = [];

  // Index active classes
  for (const c of ALL_CLASSES) {
    if (c.active) {
      results.push({
        id: `class-${c.id}`,
        type: "class",
        title: c.name,
        hindiTitle: c.hindiName,
        classId: c.id,
        className: c.name,
        url: `/classes/${c.slug}`,
        description: `${c.description} Available subjects: ${c.availableSubjectIds.length}`,
        badge: "Class",
      });
    }
  }

  // Index subjects for active classes
  for (const c of ALL_CLASSES) {
    if (!c.active) continue;
    for (const subId of c.availableSubjectIds) {
      const sub = getSubjectById(subId);
      if (sub) {
        results.push({
          id: `sub-${c.id}-${sub.id}`,
          type: "subject",
          title: `${c.name} ${sub.name}`,
          hindiTitle: `${c.hindiName} ${sub.hindiName}`,
          classId: c.id,
          className: c.name,
          subjectId: sub.id,
          subjectName: sub.name,
          url: `/classes/${c.slug}/${sub.slug}`,
          description: `${sub.description} (${c.name})`,
          badge: "Subject",
        });
      }
    }
  }

  // Index topics and sub-resources
  for (const topic of ALL_TOPICS) {
    if (!activeClassIds.has(topic.classId)) continue;
    const cls = getClassById(topic.classId);
    const sub = getSubjectById(topic.subjectId);

    // Topic entry
    results.push({
      id: `topic-${topic.id}`,
      type: "topic",
      title: topic.title,
      hindiTitle: topic.hindiTitle,
      classId: topic.classId,
      className: cls?.name,
      subjectId: topic.subjectId,
      subjectName: sub?.name,
      url: `/classes/${topic.classId}/${topic.subjectId}/${topic.slug}`,
      description: topic.description,
      badge: "Topic & Chapter",
    });

    // Notes index
    if (topic.notes?.available) {
      results.push({
        id: `notes-${topic.id}`,
        type: "topic",
        title: `${topic.title} Notes (अध्याय नोट्स)`,
        hindiTitle: `${topic.hindiTitle} नोट्स`,
        classId: topic.classId,
        className: cls?.name,
        subjectId: topic.subjectId,
        subjectName: sub?.name,
        url: `/classes/${topic.classId}/${topic.subjectId}/${topic.slug}#notes`,
        description: `Comprehensive reading notes, formulas, definitions and tables for ${topic.title}.`,
        badge: "Notes",
      });
    }

    // Video index
    if (topic.video?.available) {
      results.push({
        id: `video-${topic.id}`,
        type: "video",
        title: `${topic.video.title}`,
        hindiTitle: `${topic.hindiTitle} वीडियो क्लास`,
        classId: topic.classId,
        className: cls?.name,
        subjectId: topic.subjectId,
        subjectName: sub?.name,
        url: `/classes/${topic.classId}/${topic.subjectId}/${topic.slug}#video`,
        description: `Duration: ${topic.video.duration} | Channel: ${topic.video.channel}`,
        badge: "Video Lecture",
      });
    }

    // Worksheet index
    if (topic.worksheet?.available) {
      results.push({
        id: `worksheet-${topic.id}`,
        type: "worksheet",
        title: `${topic.worksheet.title}`,
        hindiTitle: `${topic.hindiTitle} अभ्यास कार्यपत्रक`,
        classId: topic.classId,
        className: cls?.name,
        subjectId: topic.subjectId,
        subjectName: sub?.name,
        url: `/classes/${topic.classId}/${topic.subjectId}/${topic.slug}#worksheet`,
        description: `${topic.worksheet.questionsCount} Questions | ${topic.worksheet.totalMarks} Marks (${topic.worksheet.difficulty})`,
        badge: "Worksheet",
      });
    }

    // Book index
    if (topic.book?.available) {
      results.push({
        id: `book-${topic.id}`,
        type: "book",
        title: `${topic.book.title}`,
        hindiTitle: topic.book.hindiTitle,
        classId: topic.classId,
        className: cls?.name,
        subjectId: topic.subjectId,
        subjectName: sub?.name,
        url: `/classes/${topic.classId}/${topic.subjectId}/${topic.slug}#book`,
        description: `Publisher: ${topic.book.publisher} | ${topic.book.pages} Pages`,
        badge: "Curriculum Book",
      });
    }
  }

  return results;
}

/**
 * Fast client-side query matcher
 */
export function searchContent(query: string): SearchResultItem[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const searchIndex = buildSearchIndex();

  return searchIndex.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(q);
    const hindiTitleMatch = item.hindiTitle ? item.hindiTitle.toLowerCase().includes(q) : false;
    const descMatch = item.description.toLowerCase().includes(q);
    const classMatch = item.className ? item.className.toLowerCase().includes(q) : false;
    const subjectMatch = item.subjectName ? item.subjectName.toLowerCase().includes(q) : false;
    const badgeMatch = item.badge.toLowerCase().includes(q);

    return titleMatch || hindiTitleMatch || descMatch || classMatch || subjectMatch || badgeMatch;
  });
}
