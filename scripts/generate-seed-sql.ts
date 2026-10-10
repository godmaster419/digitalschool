import fs from "fs";
import path from "path";
import { ALL_CLASSES } from "../src/data/classes";
import { getSubjectById } from "../src/data/subjects";
import { ALL_TOPICS } from "../src/data/topics";

function escapeSql(str: string | undefined | null): string {
  if (str === undefined || str === null) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeJson(obj: any): string {
  if (!obj) return "'{}'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

let sql = `-- ==============================================================================
-- DIGITAL SCHOOL — INITIAL SEED DATA
-- Generated from existing audited data
-- ==============================================================================

`;

// 1. CLASSES
sql += `-- 1. SEED CLASSES\n`;
for (const c of ALL_CLASSES) {
  const subjectsArray = `ARRAY[${c.availableSubjectIds.map((s) => `'${s}'`).join(", ")}]::text[]`;
  sql += `INSERT INTO public.classes (id, name, hindi_name, slug, level, description, display_order, is_active, show_on_home, available_subject_ids)
VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.hindiName)}, ${escapeSql(c.slug)}, ${escapeSql(c.level)}, ${escapeSql(c.description)}, ${c.order}, ${c.active}, ${c.showOnHome}, ${subjectsArray})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  is_active = EXCLUDED.is_active,
  show_on_home = EXCLUDED.show_on_home,
  available_subject_ids = EXCLUDED.available_subject_ids;\n`;
}

// 2. SUBJECTS
sql += `\n-- 2. SEED SUBJECTS (Class-assigned)\n`;
for (const c of ALL_CLASSES) {
  let order = 1;
  for (const subId of c.availableSubjectIds) {
    const sub = getSubjectById(subId);
    if (!sub) continue;
    const pk = `${c.id}-${sub.slug}`;
    sql += `INSERT INTO public.subjects (id, class_id, name, hindi_name, slug, icon, color, bg_light, description, display_order, is_active)
VALUES (${escapeSql(pk)}, ${escapeSql(c.id)}, ${escapeSql(sub.name)}, ${escapeSql(sub.hindiName)}, ${escapeSql(sub.slug)}, ${escapeSql(sub.icon)}, ${escapeSql(sub.color)}, ${escapeSql(sub.bgLight)}, ${escapeSql(sub.description)}, ${order++}, true)
ON CONFLICT (id) DO NOTHING;\n`;
  }
}

// 3. TOPICS
sql += `\n-- 3. SEED TOPICS\n`;
let topicOrder = 1;
for (const t of ALL_TOPICS) {
  const subjectPk = `${t.classId}-${t.subjectId}`;
  sql += `INSERT INTO public.topics (id, class_id, subject_id, title, hindi_title, slug, chapter_number, short_description, display_order, is_active)
VALUES (${escapeSql(t.id)}, ${escapeSql(t.classId)}, ${escapeSql(subjectPk)}, ${escapeSql(t.title)}, ${escapeSql(t.hindiTitle)}, ${escapeSql(t.slug)}, ${t.chapterNumber}, ${escapeSql(t.description)}, ${topicOrder++}, true)
ON CONFLICT (id) DO NOTHING;\n`;
}

// 4. NOTES
sql += `\n-- 4. SEED NOTES\n`;
for (const t of ALL_TOPICS) {
  if (!t.notes) continue;
  const noteId = `notes-${t.id}`;
  sql += `INSERT INTO public.notes (id, topic_id, title, content, overview, read_time, is_published, display_order)
VALUES (${escapeSql(noteId)}, ${escapeSql(t.id)}, ${escapeSql(t.title + " Notes")}, ${escapeJson(t.notes)}, ${escapeSql(t.notes.overview)}, ${escapeSql(t.notes.readTime)}, ${t.notes.available}, 1)
ON CONFLICT (id) DO NOTHING;\n`;
}

// 5. VIDEOS
sql += `\n-- 5. SEED VIDEOS\n`;
for (const t of ALL_TOPICS) {
  if (!t.video) continue;
  const videoId = `video-${t.id}`;
  const videoUrl = `https://www.youtube.com/watch?v=${t.video.youtubeId}`;
  sql += `INSERT INTO public.videos (id, topic_id, title, video_url, youtube_id, video_type, thumbnail_url, duration, channel, description, is_published, display_order)
VALUES (${escapeSql(videoId)}, ${escapeSql(t.id)}, ${escapeSql(t.video.title)}, ${escapeSql(videoUrl)}, ${escapeSql(t.video.youtubeId)}, 'youtube', ${escapeSql(t.video.thumbnailUrl)}, ${escapeSql(t.video.duration)}, ${escapeSql(t.video.channel)}, ${escapeSql(t.video.description || "")}, ${t.video.available}, 1)
ON CONFLICT (id) DO NOTHING;\n`;
}

// 6. WORKSHEETS
sql += `\n-- 6. SEED WORKSHEETS\n`;
for (const t of ALL_TOPICS) {
  if (!t.worksheet) continue;
  const worksheetId = `worksheet-${t.id}`;
  sql += `INSERT INTO public.worksheets (id, topic_id, title, description, file_url, file_name, file_type, file_size, questions_count, total_marks, difficulty, instructions, sample_questions, is_published, display_order)
VALUES (${escapeSql(worksheetId)}, ${escapeSql(t.id)}, ${escapeSql(t.worksheet.title)}, ${escapeSql("Practice worksheet for " + t.title)}, ${escapeSql(t.worksheet.fileUrl)}, ${escapeSql(t.worksheet.fileName)}, 'application/pdf', '1.5 MB', ${t.worksheet.questionsCount}, ${t.worksheet.totalMarks}, ${escapeSql(t.worksheet.difficulty)}, ${escapeJson(t.worksheet.instructions || [])}, ${escapeJson(t.worksheet.sampleQuestions || [])}, ${t.worksheet.available}, 1)
ON CONFLICT (id) DO NOTHING;\n`;
}

// 7. BOOKS
sql += `\n-- 7. SEED BOOKS\n`;
for (const t of ALL_TOPICS) {
  if (!t.book) continue;
  const bookId = `book-${t.id}`;
  const subjectPk = `${t.classId}-${t.subjectId}`;
  sql += `INSERT INTO public.books (id, class_id, subject_id, topic_id, title, hindi_title, publisher, edition, chapter_number, pages, description, cover_color, file_url, file_name, is_published, display_order)
VALUES (${escapeSql(bookId)}, ${escapeSql(t.classId)}, ${escapeSql(subjectPk)}, ${escapeSql(t.id)}, ${escapeSql(t.book.title)}, ${escapeSql(t.book.hindiTitle || "")}, ${escapeSql(t.book.publisher)}, ${escapeSql(t.book.edition)}, ${t.book.chapterNumber}, ${t.book.pages}, ${escapeSql("Curriculum book chapter for " + t.title)}, ${escapeSql(t.book.coverColor || "#2563eb")}, ${escapeSql(t.book.fileUrl)}, ${escapeSql(t.book.fileName)}, ${t.book.available}, 1)
ON CONFLICT (id) DO NOTHING;\n`;
}

const outputPath = path.join(process.cwd(), "supabase", "seed.sql");
fs.writeFileSync(outputPath, sql, "utf8");
console.log(`Successfully generated seed SQL at ${outputPath} (${sql.length} bytes)`);
