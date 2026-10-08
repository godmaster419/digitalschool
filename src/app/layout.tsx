import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalschool.edu"),
  alternates: {
    canonical: "./",
  },
  title: "Digital School | Classes 3 to 8 Educational Learning Platform",
  description:
    "A professional, lightweight educational learning platform for Classes 3 to 8. Access topic-wise notes, conceptual video lectures, practice worksheets, and NCERT curriculum books.",
  keywords: [
    "Digital School",
    "Classes 3 to 8",
    "NCERT Notes",
    "Practice Worksheets",
    "Educational Videos",
    "Science",
    "Mathematics",
    "Hindi",
    "English",
    "Social Science",
  ],
  authors: [{ name: "Digital School Educational Foundation" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digitalschool.edu",
    title: "Digital School — Learn Better. Understand Better.",
    description: "Complete educational notes, books, videos, and practice worksheets for Classes 3 to 8.",
    siteName: "Digital School",
  },
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flicker theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('digital-school-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <Suspense fallback={<div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />}>
            <Header />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
