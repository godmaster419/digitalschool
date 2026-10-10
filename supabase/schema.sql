-- ==============================================================================
-- DIGITAL SCHOOL — SUPABASE COMPLETE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- This script sets up:
-- 1. admin_users table (secure role check, NOT user-editable metadata)
-- 2. classes table (Class 3 to 8 active, LKG-2 inactive roadmap)
-- 3. subjects table (Class-assigned and global subjects)
-- 4. topics table (Chapter & Topic hierarchy)
-- 5. notes table (Draft / Published notes with structured content)
-- 6. videos table (YouTube & Shorts embeds with preview)
-- 7. worksheets table (PDF files & question banks)
-- 8. books table (NCERT/Curriculum textbooks)
-- 9. Storage bucket 'digital-school-assets' & storage security policies
-- 10. Strict Row-Level Security (RLS) policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMIN USERS TABLE
-- Only users in this table have access to the CMS and write operations.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'superadmin'
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for speedy admin verification
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- 3. IS_ADMIN() SECURITY DEFINER FUNCTION
-- Securely checks whether the requesting user is in public.admin_users.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE public.admin_users.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY, -- e.g. 'class-3', 'class-4'
  name TEXT NOT NULL, -- 'Class 3'
  hindi_name TEXT, -- 'कक्षा ३'
  slug TEXT UNIQUE NOT NULL, -- 'class-3'
  level TEXT NOT NULL DEFAULT 'primary', -- 'pre-primary', 'primary', 'middle'
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  show_on_home BOOLEAN NOT NULL DEFAULT true,
  available_subject_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_classes_order ON public.classes(display_order);
CREATE INDEX IF NOT EXISTS idx_classes_active ON public.classes(is_active);

-- 5. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY, -- e.g. 'class-3-mathematics' or 'mathematics'
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Mathematics'
  hindi_name TEXT, -- 'गणित'
  slug TEXT NOT NULL, -- 'mathematics'
  icon TEXT DEFAULT 'BookOpen',
  color TEXT DEFAULT '#2563eb',
  bg_light TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_subjects_class ON public.subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_subjects_active ON public.subjects(is_active);

-- 6. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY, -- e.g. 'class-3-math-multiplication'
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  title TEXT NOT NULL,
  hindi_title TEXT,
  slug TEXT NOT NULL,
  chapter_number INTEGER NOT NULL DEFAULT 1,
  short_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_topics_class_subject ON public.topics(class_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_order ON public.topics(display_order);
CREATE INDEX IF NOT EXISTS idx_topics_active ON public.topics(is_active);

-- 7. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY, -- e.g. 'notes-class-3-math-multiplication'
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  overview TEXT,
  read_time TEXT DEFAULT '5 min read',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notes_topic ON public.notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_published ON public.notes(is_published);

-- 8. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  youtube_id TEXT,
  video_type TEXT DEFAULT 'youtube', -- 'youtube', 'youtube_shorts'
  thumbnail_url TEXT,
  duration TEXT,
  channel TEXT,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_videos_topic ON public.videos(topic_id);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published);

-- 9. WORKSHEETS TABLE
CREATE TABLE IF NOT EXISTS public.worksheets (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT DEFAULT 'application/pdf',
  file_size TEXT,
  questions_count INTEGER DEFAULT 0,
  total_marks INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'Medium', -- 'Easy', 'Medium', 'Advanced'
  instructions JSONB DEFAULT '[]'::jsonb,
  sample_questions JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_worksheets_topic ON public.worksheets(topic_id);
CREATE INDEX IF NOT EXISTS idx_worksheets_published ON public.worksheets(is_published);

-- 10. BOOKS TABLE
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id TEXT,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  hindi_title TEXT,
  publisher TEXT DEFAULT 'NCERT',
  edition TEXT DEFAULT '2026-27 Revised Edition',
  chapter_number INTEGER DEFAULT 1,
  pages INTEGER DEFAULT 0,
  description TEXT,
  cover_color TEXT DEFAULT '#2563eb',
  cover_image_url TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_books_class ON public.books(class_id);
CREATE INDEX IF NOT EXISTS idx_books_subject ON public.books(subject_id);
CREATE INDEX IF NOT EXISTS idx_books_published ON public.books(is_published);

-- ==============================================================================
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- ADMIN_USERS policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users"
  ON public.admin_users FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- CLASSES policies: Public can read active classes, Admin can read all and write
DROP POLICY IF EXISTS "Public can view active classes" ON public.classes;
CREATE POLICY "Public can view active classes"
  ON public.classes FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on classes" ON public.classes;
CREATE POLICY "Admin full control on classes"
  ON public.classes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- SUBJECTS policies: Public can read active subjects, Admin can read all and write
DROP POLICY IF EXISTS "Public can view active subjects" ON public.subjects;
CREATE POLICY "Public can view active subjects"
  ON public.subjects FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on subjects" ON public.subjects;
CREATE POLICY "Admin full control on subjects"
  ON public.subjects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- TOPICS policies: Public can read active topics, Admin can read all and write
DROP POLICY IF EXISTS "Public can view active topics" ON public.topics;
CREATE POLICY "Public can view active topics"
  ON public.topics FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on topics" ON public.topics;
CREATE POLICY "Admin full control on topics"
  ON public.topics FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- NOTES policies: Public can read published notes, Admin can read all and write
DROP POLICY IF EXISTS "Public can view published notes" ON public.notes;
CREATE POLICY "Public can view published notes"
  ON public.notes FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on notes" ON public.notes;
CREATE POLICY "Admin full control on notes"
  ON public.notes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- VIDEOS policies: Public can read published videos, Admin can read all and write
DROP POLICY IF EXISTS "Public can view published videos" ON public.videos;
CREATE POLICY "Public can view published videos"
  ON public.videos FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on videos" ON public.videos;
CREATE POLICY "Admin full control on videos"
  ON public.videos FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- WORKSHEETS policies: Public can read published worksheets, Admin can read all and write
DROP POLICY IF EXISTS "Public can view published worksheets" ON public.worksheets;
CREATE POLICY "Public can view published worksheets"
  ON public.worksheets FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on worksheets" ON public.worksheets;
CREATE POLICY "Admin full control on worksheets"
  ON public.worksheets FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- BOOKS policies: Public can read published books, Admin can read all and write
DROP POLICY IF EXISTS "Public can view published books" ON public.books;
CREATE POLICY "Public can view published books"
  ON public.books FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on books" ON public.books;
CREATE POLICY "Admin full control on books"
  ON public.books FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 12. STORAGE BUCKET CONFIGURATION
-- ==============================================================================

-- Create bucket 'digital-school-assets' for worksheets, books, and images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'digital-school-assets',
  'digital-school-assets',
  true,
  52428800, -- 50 MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access to digital-school-assets" ON storage.objects;
CREATE POLICY "Public Access to digital-school-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'digital-school-assets');

DROP POLICY IF EXISTS "Admin Upload to digital-school-assets" ON storage.objects;
CREATE POLICY "Admin Upload to digital-school-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'digital-school-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Update in digital-school-assets" ON storage.objects;
CREATE POLICY "Admin Update in digital-school-assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'digital-school-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Delete in digital-school-assets" ON storage.objects;
CREATE POLICY "Admin Delete in digital-school-assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'digital-school-assets' AND public.is_admin());

-- ==============================================================================
-- 13. AUTO-UPDATE TRIGGER FOR updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_classes_updated_at ON public.classes;
CREATE TRIGGER tr_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_subjects_updated_at ON public.subjects;
CREATE TRIGGER tr_subjects_updated_at BEFORE UPDATE ON public.subjects
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_topics_updated_at ON public.topics;
CREATE TRIGGER tr_topics_updated_at BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_notes_updated_at ON public.notes;
CREATE TRIGGER tr_notes_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_videos_updated_at ON public.videos;
CREATE TRIGGER tr_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_worksheets_updated_at ON public.worksheets;
CREATE TRIGGER tr_worksheets_updated_at BEFORE UPDATE ON public.worksheets
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS tr_books_updated_at ON public.books;
CREATE TRIGGER tr_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
