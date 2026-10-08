import { SubjectItem } from "@/types";

export const ALL_SUBJECTS: SubjectItem[] = [
  {
    id: "science",
    slug: "science",
    name: "Science",
    hindiName: "विज्ञान",
    icon: "Atom",
    color: "#2563eb", // blue-600
    bgLight: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900",
    description: "Observation, experiments, biology, physical laws, and natural processes.",
  },
  {
    id: "mathematics",
    slug: "mathematics",
    name: "Mathematics",
    hindiName: "गणित",
    icon: "Calculator",
    color: "#059669", // emerald-600
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
    description: "Numbers, geometry, arithmetic calculations, algebraic problem solving, and analytical reasoning.",
  },
  {
    id: "environmental-studies",
    slug: "environmental-studies",
    name: "Environmental Studies (EVS)",
    hindiName: "पर्यावरण अध्ययन",
    icon: "Leaf",
    color: "#16a34a", // green-600
    bgLight: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900",
    description: "Our surroundings, plants, animals, natural ecosystems, conservation, and health habits.",
  },
  {
    id: "social-science",
    slug: "social-science",
    name: "Social Science",
    hindiName: "सामाजिक विज्ञान",
    icon: "Globe",
    color: "#d97706", // amber-600
    bgLight: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    description: "History, geography, democratic civics, society, and our cultural heritage.",
  },
  {
    id: "hindi",
    slug: "hindi",
    name: "Hindi",
    hindiName: "हिन्दी",
    icon: "BookOpen",
    color: "#dc2626", // red-600
    bgLight: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900",
    description: "हिन्दी व्याकरण, साहित्य, गद्य एवं पद्य, निबंध एवं रचनात्मक भाषा कौशल।",
  },
  {
    id: "english",
    slug: "english",
    name: "English",
    hindiName: "अंग्रेज़ी",
    icon: "Languages",
    color: "#7c3aed", // violet-600
    bgLight: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-900",
    description: "Grammar, comprehension, literature, prose, poetry, and written communication skills.",
  },
  {
    id: "sanskrit",
    slug: "sanskrit",
    name: "Sanskrit",
    hindiName: "संस्कृत",
    icon: "Scroll",
    color: "#ea580c", // orange-600
    bgLight: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900",
    description: "संस्कृत व्याकरणम्, शब्दरूपाणि, धातुरूपाणि एवं नीतियुक्त श्लोक पाठनम्।",
  },
];

export function getAllSubjects(): SubjectItem[] {
  return ALL_SUBJECTS;
}

export function getSubjectById(idOrSlug: string): SubjectItem | undefined {
  return ALL_SUBJECTS.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}
