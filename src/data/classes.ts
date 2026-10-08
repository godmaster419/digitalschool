import { ClassItem } from "@/types";
import { CLASS_VISIBILITY_CONFIG } from "./config";

export const ALL_CLASSES: ClassItem[] = [
  // Future Inactive Classes (Ready in architecture)
  {
    id: "lkg",
    slug: "lkg",
    name: "LKG",
    hindiName: "एलकेजी (पूर्व प्राथमिक)",
    level: "pre-primary",
    description: "Foundational early childhood learning with phonics, numbers, and sensory activities.",
    active: CLASS_VISIBILITY_CONFIG["lkg"]?.active ?? false,
    showOnHome: CLASS_VISIBILITY_CONFIG["lkg"]?.showOnHome ?? false,
    order: 1,
    availableSubjectIds: ["english", "hindi", "mathematics", "environmental-studies"],
  },
  {
    id: "ukg",
    slug: "ukg",
    name: "UKG",
    hindiName: "यूकेजी (उच्च प्राथमिक पूर्व)",
    level: "pre-primary",
    description: "Kindergarten reading fluency, foundational counting, and creative expression.",
    active: CLASS_VISIBILITY_CONFIG["ukg"]?.active ?? false,
    showOnHome: CLASS_VISIBILITY_CONFIG["ukg"]?.showOnHome ?? false,
    order: 2,
    availableSubjectIds: ["english", "hindi", "mathematics", "environmental-studies"],
  },
  {
    id: "class-1",
    slug: "class-1",
    name: "Class 1",
    hindiName: "कक्षा १",
    level: "primary",
    description: "Primary fundamentals: word building, simple arithmetic, and nature exploration.",
    active: CLASS_VISIBILITY_CONFIG["class-1"]?.active ?? false,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-1"]?.showOnHome ?? false,
    order: 3,
    availableSubjectIds: ["hindi", "english", "mathematics", "environmental-studies"],
  },
  {
    id: "class-2",
    slug: "class-2",
    name: "Class 2",
    hindiName: "कक्षा २",
    level: "primary",
    description: "Early numeracy, sentence formation, storytelling, and general awareness.",
    active: CLASS_VISIBILITY_CONFIG["class-2"]?.active ?? false,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-2"]?.showOnHome ?? false,
    order: 4,
    availableSubjectIds: ["hindi", "english", "mathematics", "environmental-studies"],
  },

  // Version 1 Active Classes (Class 3 to 8)
  {
    id: "class-3",
    slug: "class-3",
    name: "Class 3",
    hindiName: "कक्षा ३",
    level: "primary",
    description: "Primary school concepts in Multiplication, Environmental Studies, Language Arts & Grammar.",
    active: CLASS_VISIBILITY_CONFIG["class-3"]?.active ?? true,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-3"]?.showOnHome ?? true,
    order: 5,
    availableSubjectIds: ["mathematics", "environmental-studies", "hindi", "english"],
  },
  {
    id: "class-4",
    slug: "class-4",
    name: "Class 4",
    hindiName: "कक्षा ४",
    level: "primary",
    description: "Conceptual foundations in fractions, plant science, creative reading, and geography.",
    active: CLASS_VISIBILITY_CONFIG["class-4"]?.active ?? true,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-4"]?.showOnHome ?? true,
    order: 6,
    availableSubjectIds: ["mathematics", "environmental-studies", "hindi", "english"],
  },
  {
    id: "class-5",
    slug: "class-5",
    name: "Class 5",
    hindiName: "कक्षा ५",
    level: "primary",
    description: "Primary graduation level: fractions & decimals, environmental systems, advanced language comprehension.",
    active: CLASS_VISIBILITY_CONFIG["class-5"]?.active ?? true,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-5"]?.showOnHome ?? true,
    order: 7,
    availableSubjectIds: ["mathematics", "environmental-studies", "hindi", "english"],
  },
  {
    id: "class-6",
    slug: "class-6",
    name: "Class 6",
    hindiName: "कक्षा ६",
    level: "middle",
    description: "Middle school science, algebra & integers, historical civilizations, and linguistic depth.",
    active: CLASS_VISIBILITY_CONFIG["class-6"]?.active ?? true,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-6"]?.showOnHome ?? true,
    order: 8,
    availableSubjectIds: ["science", "mathematics", "social-science", "hindi", "english", "sanskrit"],
  },
  {
    id: "class-7",
    slug: "class-7",
    name: "Class 7",
    hindiName: "कक्षा ७",
    level: "middle",
    description: "Advanced digestive biology, rational numbers, medieval history, and literature analysis.",
    active: CLASS_VISIBILITY_CONFIG["class-7"]?.active ?? true,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-7"]?.showOnHome ?? true,
    order: 9,
    availableSubjectIds: ["science", "mathematics", "social-science", "hindi", "english", "sanskrit"],
  },
  {
    id: "class-8",
    slug: "class-8",
    name: "Class 8",
    hindiName: "कक्षा ८",
    level: "middle",
    description: "Board preparation foundations: cellular biology, physics of forces, algebraic expressions & modern history.",
    active: CLASS_VISIBILITY_CONFIG["class-8"]?.active ?? true,
    showOnHome: CLASS_VISIBILITY_CONFIG["class-8"]?.showOnHome ?? true,
    order: 10,
    availableSubjectIds: ["science", "mathematics", "social-science", "hindi", "english", "sanskrit"],
  },
];

/**
 * Helper query functions
 */
export function getAllClasses(): ClassItem[] {
  return ALL_CLASSES;
}

export function getActiveClasses(): ClassItem[] {
  return ALL_CLASSES.filter((c) => c.active);
}

export function getHomeClasses(): ClassItem[] {
  return ALL_CLASSES.filter((c) => c.active && c.showOnHome).sort((a, b) => a.order - b.order);
}

export function getClassById(idOrSlug: string): ClassItem | undefined {
  return ALL_CLASSES.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}
