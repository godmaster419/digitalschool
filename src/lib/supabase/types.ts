export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          hindi_name: string | null;
          slug: string;
          level: string;
          description: string | null;
          display_order: number;
          is_active: boolean;
          show_on_home: boolean;
          available_subject_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          hindi_name?: string | null;
          slug: string;
          level?: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          show_on_home?: boolean;
          available_subject_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          hindi_name?: string | null;
          slug?: string;
          level?: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          show_on_home?: boolean;
          available_subject_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          class_id: string | null;
          name: string;
          hindi_name: string | null;
          slug: string;
          icon: string | null;
          color: string | null;
          bg_light: string | null;
          description: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          class_id?: string | null;
          name: string;
          hindi_name?: string | null;
          slug: string;
          icon?: string | null;
          color?: string | null;
          bg_light?: string | null;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string | null;
          name?: string;
          hindi_name?: string | null;
          slug?: string;
          icon?: string | null;
          color?: string | null;
          bg_light?: string | null;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          class_id: string | null;
          subject_id: string;
          title: string;
          hindi_title: string | null;
          slug: string;
          chapter_number: number;
          short_description: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          class_id?: string | null;
          subject_id: string;
          title: string;
          hindi_title?: string | null;
          slug: string;
          chapter_number?: number;
          short_description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string | null;
          subject_id?: string;
          title?: string;
          hindi_title?: string | null;
          slug?: string;
          chapter_number?: number;
          short_description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          content: Json;
          overview: string | null;
          read_time: string | null;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          topic_id: string;
          title: string;
          content?: Json;
          overview?: string | null;
          read_time?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          title?: string;
          content?: Json;
          overview?: string | null;
          read_time?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          video_url: string;
          youtube_id: string | null;
          video_type: string | null;
          thumbnail_url: string | null;
          duration: string | null;
          channel: string | null;
          description: string | null;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          topic_id: string;
          title: string;
          video_url: string;
          youtube_id?: string | null;
          video_type?: string | null;
          thumbnail_url?: string | null;
          duration?: string | null;
          channel?: string | null;
          description?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          title?: string;
          video_url?: string;
          youtube_id?: string | null;
          video_type?: string | null;
          thumbnail_url?: string | null;
          duration?: string | null;
          channel?: string | null;
          description?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      worksheets: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_name: string | null;
          file_type: string | null;
          file_size: string | null;
          questions_count: number;
          total_marks: number;
          difficulty: string | null;
          instructions: Json;
          sample_questions: Json;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          topic_id: string;
          title: string;
          description?: string | null;
          file_url: string;
          file_name?: string | null;
          file_type?: string | null;
          file_size?: string | null;
          questions_count?: number;
          total_marks?: number;
          difficulty?: string | null;
          instructions?: Json;
          sample_questions?: Json;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_name?: string | null;
          file_type?: string | null;
          file_size?: string | null;
          questions_count?: number;
          total_marks?: number;
          difficulty?: string | null;
          instructions?: Json;
          sample_questions?: Json;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          class_id: string | null;
          subject_id: string | null;
          topic_id: string | null;
          title: string;
          hindi_title: string | null;
          publisher: string | null;
          edition: string | null;
          chapter_number: number;
          pages: number;
          description: string | null;
          cover_color: string | null;
          cover_image_url: string | null;
          file_url: string;
          file_name: string | null;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          class_id?: string | null;
          subject_id?: string | null;
          topic_id?: string | null;
          title: string;
          hindi_title?: string | null;
          publisher?: string | null;
          edition?: string | null;
          chapter_number?: number;
          pages?: number;
          description?: string | null;
          cover_color?: string | null;
          cover_image_url?: string | null;
          file_url: string;
          file_name?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string | null;
          subject_id?: string | null;
          topic_id?: string | null;
          title?: string;
          hindi_title?: string | null;
          publisher?: string | null;
          edition?: string | null;
          chapter_number?: number;
          pages?: number;
          description?: string | null;
          cover_color?: string | null;
          cover_image_url?: string | null;
          file_url?: string;
          file_name?: string | null;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { user_id?: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
