import React from "react";
import Link from "next/link";
import {
  Atom,
  Calculator,
  Leaf,
  Globe,
  BookOpen,
  Languages,
  Scroll,
  ArrowRight,
} from "lucide-react";
import { SubjectItem } from "@/types";

interface SubjectCardProps {
  subject: SubjectItem;
  classSlug: string;
  topicCount?: number;
}

export function SubjectCard({ subject, classSlug, topicCount = 0 }: SubjectCardProps) {
  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case "Atom":
        return <Atom {...props} />;
      case "Calculator":
        return <Calculator {...props} />;
      case "Leaf":
        return <Leaf {...props} />;
      case "Globe":
        return <Globe {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "Languages":
        return <Languages {...props} />;
      case "Scroll":
        return <Scroll {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  return (
    <Link
      href={`/classes/${classSlug}/${subject.slug}`}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className={`p-3 rounded-xl border ${subject.bgLight} transition-colors`}>
            {renderIcon(subject.icon)}
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {topicCount > 0 ? `${topicCount} Chapter${topicCount > 1 ? "s" : ""}` : "Syllabus Ready"}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {subject.name}
          </h3>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {subject.hindiName}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {subject.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
        <span>View Topics & Chapters</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
