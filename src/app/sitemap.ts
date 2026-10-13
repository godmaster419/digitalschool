import type { MetadataRoute } from "next";
import { getAllClasses } from "@/data/classes";
import { getAllTopics } from "@/data/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalschool-neon.vercel.app";
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/classes",
    "/books",
    "/videos",
    "/worksheets",
    "/about",
    "/search",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Active classes
  const activeClasses = getAllClasses().filter((c) => c.active);
  const classRoutes: MetadataRoute.Sitemap = activeClasses.map((c) => ({
    url: `${baseUrl}/classes/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Active subjects
  const subjectRoutes: MetadataRoute.Sitemap = [];
  for (const c of activeClasses) {
    for (const subId of c.availableSubjectIds) {
      subjectRoutes.push({
        url: `${baseUrl}/classes/${c.slug}/${subId}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

  // Active topics
  const activeClassIds = new Set(activeClasses.map((c) => c.id));
  const topicRoutes: MetadataRoute.Sitemap = getAllTopics()
    .filter((t) => activeClassIds.has(t.classId))
    .map((t) => ({
      url: `${baseUrl}/classes/${t.classId}/${t.subjectId}/${t.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...classRoutes, ...subjectRoutes, ...topicRoutes];
}
