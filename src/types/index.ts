export type ClassLevel = 'pre-primary' | 'primary' | 'middle';

export interface ClassItem {
  id: string; // e.g. "class-3"
  slug: string; // "class-3"
  name: string; // "Class 3"
  hindiName: string; // "कक्षा ३"
  level: ClassLevel;
  description: string;
  active: boolean;
  showOnHome: boolean;
  order: number;
  availableSubjectIds: string[];
}

export interface SubjectItem {
  id: string; // "mathematics"
  slug: string;
  name: string; // "Mathematics"
  hindiName: string; // "गणित"
  icon: string;
  color: string;
  bgLight: string;
  description: string;
}

export interface NoteDefinition {
  term: string;
  definition: string;
}

export interface NoteExample {
  title: string;
  explanation: string;
}

export interface NoteTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface NoteCallout {
  type: 'info' | 'tip' | 'important';
  title?: string;
  text: string;
}

export interface NoteSection {
  id: string;
  heading: string;
  hindiHeading?: string;
  content: string;
  bulletPoints?: string[];
  numberedPoints?: string[];
  definitions?: NoteDefinition[];
  examples?: NoteExample[];
  table?: NoteTable;
  callout?: NoteCallout;
}

export interface NoteContent {
  available: boolean;
  readTime: string;
  overview: string;
  sections: NoteSection[];
}

export interface VideoContent {
  available: boolean;
  title: string;
  youtubeId: string;
  duration: string;
  channel: string;
  thumbnailUrl: string;
  description?: string;
}

export interface WorksheetContent {
  available: boolean;
  title: string;
  fileUrl: string;
  fileName: string;
  questionsCount: number;
  totalMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  instructions?: string[];
  sampleQuestions: string[];
}

export interface BookContent {
  available: boolean;
  title: string;
  hindiTitle?: string;
  publisher: string;
  edition: string;
  chapterNumber: number;
  pages: number;
  fileUrl: string;
  fileName: string;
  coverColor?: string;
}

export interface TopicItem {
  id: string; // "fraction-basics"
  slug: string;
  title: string; // "Fractions"
  hindiTitle: string; // "भिन्न"
  classId: string; // "class-5"
  subjectId: string; // "mathematics"
  chapterNumber: number;
  description: string;
  notes: NoteContent;
  video?: VideoContent;
  worksheet?: WorksheetContent;
  book?: BookContent;
}

export interface SearchResultItem {
  id: string;
  type: 'topic' | 'subject' | 'class' | 'book' | 'worksheet' | 'video';
  title: string;
  hindiTitle?: string;
  classId?: string;
  className?: string;
  subjectId?: string;
  subjectName?: string;
  url: string;
  description: string;
  badge: string;
}
