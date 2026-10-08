/**
 * Digital School Configuration Layer
 * 
 * Future CMS / Admin Readiness:
 * In Version 1, this provides static configuration for class visibility
 * and platform metadata. Future Admin Dashboard can update this config
 * via database or CMS API without altering UI components.
 */

export interface SchoolConfig {
  siteName: string;
  tagline: string;
  hindiTagline: string;
  description: string;
  academicYear: string;
  curriculum: string;
  supportEmail: string;
  defaultTheme: 'light' | 'dark' | 'system';
  homepageClassIds: string[];
}

export const SCHOOL_CONFIG: SchoolConfig = {
  siteName: "Digital School",
  tagline: "Learn Better. Understand Better.",
  hindiTagline: "बेहतर सीखें। गहराई से समझें।",
  description: "A professional, lightweight educational learning platform for Classes 3 to 8. Notes, Books, Video Lectures, and Practice Worksheets in one unified place.",
  academicYear: "2026-2027",
  curriculum: "NCERT / State Board Aligned",
  supportEmail: "learning@digitalschool.edu",
  defaultTheme: "system",
  // Version 1 Active Homepage Classes
  homepageClassIds: [
    "class-3",
    "class-4",
    "class-5",
    "class-6",
    "class-7",
    "class-8",
  ],
};

/**
 * Future Admin Class Visibility Matrix
 * In future versions, this is synced with the Admin Dashboard / Database
 */
export const CLASS_VISIBILITY_CONFIG: Record<string, { active: boolean; showOnHome: boolean }> = {
  // Pre-Primary & Early Primary (Future Architecture - Inactive in V1)
  "lkg": { active: false, showOnHome: false },
  "ukg": { active: false, showOnHome: false },
  "class-1": { active: false, showOnHome: false },
  "class-2": { active: false, showOnHome: false },

  // V1 Active Classes
  "class-3": { active: true, showOnHome: true },
  "class-4": { active: true, showOnHome: true },
  "class-5": { active: true, showOnHome: true },
  "class-6": { active: true, showOnHome: true },
  "class-7": { active: true, showOnHome: true },
  "class-8": { active: true, showOnHome: true },
};
