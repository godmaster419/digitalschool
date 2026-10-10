import { createClient, isSupabaseConfigured } from "./supabase/client";
import { getClassById as getStaticClassById, getHomeClasses as getStaticHomeClasses, getAllClasses as getStaticAllClasses } from "@/data/classes";
import { getSubjectById as getStaticSubjectById, getAllSubjects as getStaticAllSubjects } from "@/data/subjects";
import { getTopicsForClassAndSubject as getStaticTopicsForClassAndSubject, getAllTopics as getStaticAllTopics } from "@/data/topics";
import { getAllBooks as getStaticAllBooks, getAllVideos as getStaticAllVideos, getAllWorksheets as getStaticAllWorksheets, AggregateBookItem, AggregateVideoItem, AggregateWorksheetItem } from "@/data/resources";
import { ClassItem, SubjectItem, TopicItem, NoteContent } from "@/types";

// ==============================================================================
// PUBLIC DATA FETCHING (Supabase with graceful static fallback)
// ==============================================================================

export async function fetchPublicHomeClasses(): Promise<ClassItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("is_active", true)
        .eq("show_on_home", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return (data as any[]).map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          hindiName: c.hindi_name || "",
          level: (c.level as any) || "primary",
          description: c.description || "",
          active: c.is_active,
          showOnHome: c.show_on_home,
          order: c.display_order,
          availableSubjectIds: c.available_subject_ids || [],
        }));
      }
    } catch {
      // Fallback
    }
  }
  return getStaticHomeClasses();
}

export async function fetchPublicAllClasses(): Promise<ClassItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return (data as any[]).map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          hindiName: c.hindi_name || "",
          level: (c.level as any) || "primary",
          description: c.description || "",
          active: c.is_active,
          showOnHome: c.show_on_home,
          order: c.display_order,
          availableSubjectIds: c.available_subject_ids || [],
        }));
      }
    } catch {
      // Fallback
    }
  }
  return getStaticAllClasses();
}

export async function fetchPublicClassBySlug(slug: string): Promise<ClassItem | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        const c = data as any;
        return {
          id: c.id,
          slug: c.slug,
          name: c.name,
          hindiName: c.hindi_name || "",
          level: (c.level as any) || "primary",
          description: c.description || "",
          active: c.is_active,
          showOnHome: c.show_on_home,
          order: c.display_order,
          availableSubjectIds: c.available_subject_ids || [],
        };
      }
    } catch {
      // Fallback
    }
  }
  return getStaticClassById(slug);
}

export async function fetchPublicSubjectsForClass(classId: string): Promise<SubjectItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("class_id", classId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return (data as any[]).map((s) => ({
          id: s.slug,
          slug: s.slug,
          name: s.name,
          hindiName: s.hindi_name || "",
          icon: s.icon || "BookOpen",
          color: s.color || "#2563eb",
          bgLight: s.bg_light || "bg-blue-50 text-blue-700 border-blue-200",
          description: s.description || "",
        }));
      }
    } catch {
      // Fallback
    }
  }

  const cls = getStaticClassById(classId);
  if (!cls) return [];
  return cls.availableSubjectIds
    .map((subId) => getStaticSubjectById(subId))
    .filter((s): s is SubjectItem => Boolean(s));
}

export async function fetchPublicTopics(classId: string, subjectId: string): Promise<TopicItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const subjectPk = `${classId}-${subjectId}`;
      const { data, error } = await supabase
        .from("topics")
        .select("*, notes(*), videos(*), worksheets(*), books(*)")
        .eq("class_id", classId)
        .or(`subject_id.eq.${subjectPk},subject_id.eq.${subjectId}`)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((t: any) => {
          const publishedNote = t.notes?.find((n: any) => n.is_published);
          const publishedVideo = t.videos?.find((v: any) => v.is_published);
          const publishedWorksheet = t.worksheets?.find((w: any) => w.is_published);
          const publishedBook = t.books?.find((b: any) => b.is_published);

          return {
            id: t.id,
            slug: t.slug,
            title: t.title,
            hindiTitle: t.hindi_title || "",
            classId: t.class_id || classId,
            subjectId: subjectId,
            chapterNumber: t.chapter_number,
            description: t.short_description || "",
            notes: publishedNote
              ? (publishedNote.content as NoteContent)
              : { available: false, readTime: "5 min", overview: "", sections: [] },
            video: publishedVideo
              ? {
                  available: true,
                  title: publishedVideo.title,
                  youtubeId: publishedVideo.youtube_id || "",
                  duration: publishedVideo.duration || "",
                  channel: publishedVideo.channel || "",
                  thumbnailUrl: publishedVideo.thumbnail_url || "",
                  description: publishedVideo.description || "",
                }
              : undefined,
            worksheet: publishedWorksheet
              ? {
                  available: true,
                  title: publishedWorksheet.title,
                  fileUrl: publishedWorksheet.file_url,
                  fileName: publishedWorksheet.file_name || "worksheet.pdf",
                  questionsCount: publishedWorksheet.questions_count,
                  totalMarks: publishedWorksheet.total_marks,
                  difficulty: publishedWorksheet.difficulty || "Medium",
                  instructions: publishedWorksheet.instructions,
                  sampleQuestions: publishedWorksheet.sample_questions || [],
                }
              : undefined,
            book: publishedBook
              ? {
                  available: true,
                  title: publishedBook.title,
                  hindiTitle: publishedBook.hindi_title,
                  publisher: publishedBook.publisher || "NCERT",
                  edition: publishedBook.edition || "2026-27",
                  chapterNumber: publishedBook.chapter_number,
                  pages: publishedBook.pages,
                  fileUrl: publishedBook.file_url,
                  fileName: publishedBook.file_name || "book.pdf",
                  coverColor: publishedBook.cover_color,
                }
              : undefined,
          };
        });
      }
    } catch {
      // Fallback
    }
  }

  return getStaticTopicsForClassAndSubject(classId, subjectId);
}

export async function fetchPublicTopic(
  classId: string,
  subjectId: string,
  topicSlug: string
): Promise<TopicItem | undefined> {
  const topics = await fetchPublicTopics(classId, subjectId);
  return topics.find((t) => t.slug === topicSlug || t.id === topicSlug);
}

export async function fetchPublicBooks(): Promise<AggregateBookItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("books")
        .select("*, classes(name), topics(title, slug)")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          available: true,
          title: b.title,
          hindiTitle: b.hindi_title || "",
          publisher: b.publisher || "NCERT",
          edition: b.edition || "2026-27",
          chapterNumber: b.chapter_number,
          pages: b.pages,
          fileUrl: b.file_url,
          fileName: b.file_name || "chapter.pdf",
          coverColor: b.cover_color || "#2563eb",
          topicId: b.topic_id || "",
          topicTitle: b.topics?.title || b.title,
          classId: b.class_id,
          className: b.classes?.name || b.class_id,
          subjectId: b.subject_id?.replace(`${b.class_id}-`, "") || "general",
          subjectName: b.subject_id?.replace(`${b.class_id}-`, "") || "General",
          topicSlug: b.topics?.slug || "",
        }));
      }
    } catch {
      // Fallback
    }
  }
  return getStaticAllBooks();
}

export async function fetchPublicVideos(): Promise<AggregateVideoItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("videos")
        .select("*, topics(title, slug, class_id, subject_id)")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((v: any) => {
          const t = v.topics;
          const cls = t?.class_id ? getStaticClassById(t.class_id) : undefined;
          return {
            available: true,
            title: v.title,
            youtubeId: v.youtube_id || "",
            duration: v.duration || "15:00",
            channel: v.channel || "Digital School",
            thumbnailUrl: v.thumbnail_url || "",
            description: v.description || "",
            topicId: v.topic_id,
            topicTitle: t?.title || v.title,
            classId: t?.class_id || "class-3",
            className: cls?.name || t?.class_id || "Class 3",
            subjectId: t?.subject_id?.replace(`${t.class_id}-`, "") || "mathematics",
            subjectName: t?.subject_id?.replace(`${t.class_id}-`, "") || "Mathematics",
            topicSlug: t?.slug || "",
          };
        });
      }
    } catch {
      // Fallback
    }
  }
  return getStaticAllVideos();
}

export async function fetchPublicWorksheets(): Promise<AggregateWorksheetItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("worksheets")
        .select("*, topics(title, slug, class_id, subject_id)")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((w: any) => {
          const t = w.topics;
          const cls = t?.class_id ? getStaticClassById(t.class_id) : undefined;
          return {
            available: true,
            title: w.title,
            fileUrl: w.file_url,
            fileName: w.file_name || "worksheet.pdf",
            questionsCount: w.questions_count,
            totalMarks: w.total_marks,
            difficulty: (w.difficulty as any) || "Medium",
            instructions: (w.instructions as string[]) || [],
            sampleQuestions: (w.sample_questions as string[]) || [],
            topicId: w.topic_id,
            topicTitle: t?.title || w.title,
            classId: t?.class_id || "class-3",
            className: cls?.name || t?.class_id || "Class 3",
            subjectId: t?.subject_id?.replace(`${t.class_id}-`, "") || "mathematics",
            subjectName: t?.subject_id?.replace(`${t.class_id}-`, "") || "Mathematics",
            topicSlug: t?.slug || "",
          };
        });
      }
    } catch {
      // Fallback
    }
  }
  return getStaticAllWorksheets();
}

// ==============================================================================
// ADMIN CMS DASHBOARD STATS
// ==============================================================================

export interface AdminDashboardStats {
  totalClasses: number;
  activeClasses: number;
  totalSubjects: number;
  totalTopics: number;
  publishedNotes: number;
  publishedVideos: number;
  publishedWorksheets: number;
  publishedBooks: number;
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const [
        classesRes,
        activeClassesRes,
        subjectsRes,
        topicsRes,
        notesRes,
        videosRes,
        worksheetsRes,
        booksRes,
      ] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("classes").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("subjects").select("id", { count: "exact", head: true }),
        supabase.from("topics").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("videos").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("worksheets").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("books").select("id", { count: "exact", head: true }).eq("is_published", true),
      ]);

      if (
        classesRes.count !== null &&
        classesRes.count > 0
      ) {
        return {
          totalClasses: classesRes.count || 0,
          activeClasses: activeClassesRes.count || 0,
          totalSubjects: subjectsRes.count || 0,
          totalTopics: topicsRes.count || 0,
          publishedNotes: notesRes.count || 0,
          publishedVideos: videosRes.count || 0,
          publishedWorksheets: worksheetsRes.count || 0,
          publishedBooks: booksRes.count || 0,
        };
      }
    } catch {
      // Fallback
    }
  }

  // Fallback calculations from static data
  const classes = getStaticAllClasses();
  const activeClasses = classes.filter((c) => c.active);
  const topics = getStaticAllTopics();
  const books = getStaticAllBooks();
  const videos = getStaticAllVideos();
  const worksheets = getStaticAllWorksheets();

  return {
    totalClasses: classes.length,
    activeClasses: activeClasses.length,
    totalSubjects: getStaticAllSubjects().length * 6,
    totalTopics: topics.length,
    publishedNotes: topics.filter((t) => t.notes?.available).length,
    publishedVideos: videos.length,
    publishedWorksheets: worksheets.length,
    publishedBooks: books.length,
  };
}
