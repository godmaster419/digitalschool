"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  UploadCloud,
  File,
  X,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { uploadAssetFile, deleteAssetFile, formatBytes } from "@/lib/supabase/storage";
import { ALL_CLASSES } from "@/data/classes";
import { ALL_SUBJECTS } from "@/data/subjects";
import { getAllBooks } from "@/data/resources";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminBook {
  id: string;
  class_id: string;
  subject_id: string;
  topic_id?: string;
  title: string;
  hindi_title: string;
  publisher: string;
  edition: string;
  chapter_number: number;
  pages: number;
  description: string;
  cover_color: string;
  cover_image_url?: string;
  file_url: string;
  file_name: string;
  is_published: boolean;
  display_order: number;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [classesList, setClassesList] = useState<Array<{ id: string; name: string }>>([]);
  const [subjectsList, setSubjectsList] = useState<Array<{ id: string; name: string }>>([]);

  // Filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBook | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    class_id: "class-3",
    subject_id: "mathematics",
    title: "",
    hindi_title: "",
    publisher: "NCERT",
    edition: "2026-27 Revised Edition",
    chapter_number: 1,
    pages: 18,
    description: "",
    cover_color: "#2563eb",
    cover_image_url: "",
    file_url: "",
    file_name: "",
    is_published: true,
  });

  // PDF Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setClassesList(ALL_CLASSES.map((c) => ({ id: c.id, name: c.name })));
    setSubjectsList(ALL_SUBJECTS.map((s) => ({ id: s.id, name: s.name })));

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setBooks(
            (data as any[]).map((b: any) => ({
              id: b.id,
              class_id: b.class_id || "class-3",
              subject_id: b.subject_id?.replace(`${b.class_id}-`, "") || "general",
              topic_id: b.topic_id || undefined,
              title: b.title,
              hindi_title: b.hindi_title || "",
              publisher: b.publisher || "NCERT",
              edition: b.edition || "2026-27",
              chapter_number: b.chapter_number,
              pages: b.pages,
              description: b.description || "",
              cover_color: b.cover_color || "#2563eb",
              cover_image_url: b.cover_image_url || undefined,
              file_url: b.file_url,
              file_name: b.file_name || "book.pdf",
              is_published: b.is_published,
              display_order: b.display_order,
            }))
          );
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Default static mapping
    const defaultList = getAllBooks().map((b, idx) => ({
      id: `book-${b.topicId}`,
      class_id: b.classId,
      subject_id: b.subjectId,
      topic_id: b.topicId,
      title: b.title,
      hindi_title: b.hindiTitle || "",
      publisher: b.publisher,
      edition: b.edition,
      chapter_number: b.chapterNumber,
      pages: b.pages,
      description: `Official NCERT textbook chapter for ${b.topicTitle}`,
      cover_color: b.coverColor || "#059669",
      file_url: b.fileUrl,
      file_name: b.fileName,
      is_published: b.available,
      display_order: idx + 1,
    }));

    setBooks(defaultList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBook(null);
    setSelectedFile(null);
    setUploadError(null);
    setFormData({
      id: "",
      class_id: selectedClassFilter === "all" ? "class-3" : selectedClassFilter,
      subject_id: "mathematics",
      title: "",
      hindi_title: "",
      publisher: "NCERT",
      edition: "2026-27 Revised Edition",
      chapter_number: 1,
      pages: 18,
      description: "",
      cover_color: "#2563eb",
      cover_image_url: "",
      file_url: "",
      file_name: "",
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminBook) => {
    setEditingBook(item);
    setSelectedFile(null);
    setUploadError(null);
    setFormData({
      id: item.id,
      class_id: item.class_id,
      subject_id: item.subject_id,
      title: item.title,
      hindi_title: item.hindi_title,
      publisher: item.publisher,
      edition: item.edition,
      chapter_number: item.chapter_number,
      pages: item.pages,
      description: item.description,
      cover_color: item.cover_color,
      cover_image_url: item.cover_image_url || "",
      file_url: item.file_url,
      file_name: item.file_name,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: AdminBook) => {
    const updated = !item.is_published;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("books") as any).update({ is_published: updated }).eq("id", item.id);
    }
    setBooks((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, is_published: updated } : b))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setUploadError("Only PDF textbook chapters are supported.");
        return;
      }
      setUploadError(null);
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        file_name: file.name,
      }));
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalFileUrl = formData.file_url;
    let finalFileName = formData.file_name;

    if (selectedFile) {
      setUploading(true);
      setUploadError(null);
      const uploadRes = await uploadAssetFile(selectedFile, "books");
      if (!uploadRes.success || !uploadRes.fileUrl) {
        setUploadError(uploadRes.error || "File upload failed.");
        setUploading(false);
        return;
      }
      finalFileUrl = uploadRes.fileUrl;
      finalFileName = uploadRes.fileName || selectedFile.name;
      setUploading(false);
    }

    if (!finalFileUrl && !editingBook?.file_url) {
      setUploadError("Please upload a PDF book chapter file.");
      return;
    }

    const id = formData.id || `book-${formData.class_id}-${formData.subject_id}-ch${formData.chapter_number}`;

    const payload: AdminBook = {
      id,
      class_id: formData.class_id,
      subject_id: formData.subject_id,
      title: formData.title,
      hindi_title: formData.hindi_title,
      publisher: formData.publisher,
      edition: formData.edition,
      chapter_number: formData.chapter_number,
      pages: formData.pages,
      description: formData.description,
      cover_color: formData.cover_color,
      cover_image_url: formData.cover_image_url || undefined,
      file_url: finalFileUrl,
      file_name: finalFileName,
      is_published: formData.is_published,
      display_order: 1,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbPayload = {
        id,
        class_id: formData.class_id,
        subject_id: `${formData.class_id}-${formData.subject_id}`,
        title: formData.title,
        hindi_title: formData.hindi_title,
        publisher: formData.publisher,
        edition: formData.edition,
        chapter_number: formData.chapter_number,
        pages: formData.pages,
        description: formData.description,
        cover_color: formData.cover_color,
        cover_image_url: formData.cover_image_url || null,
        file_url: finalFileUrl,
        file_name: finalFileName,
        is_published: formData.is_published,
        display_order: 1,
      };

      if (editingBook) {
        await (supabase.from("books") as any).update(dbPayload).eq("id", editingBook.id);
      } else {
        await (supabase.from("books") as any).insert(dbPayload);
      }
    }

    if (editingBook) {
      setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? payload : b)));
    } else {
      setBooks((prev) => [payload, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("books").delete().eq("id", deleteTarget.id);
      if (deleteTarget.file_url) {
        await deleteAssetFile(deleteTarget.file_url);
      }
    }

    setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Filter
  const filteredBooks = books.filter((b) => {
    const matchesStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "published" && b.is_published) ||
      (selectedStatusFilter === "draft" && !b.is_published);
    const matchesClass =
      selectedClassFilter === "all" || b.class_id === selectedClassFilter;
    const matchesQuery =
      searchQuery === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hindi_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesClass && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Curriculum Books Library
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Curriculum Books Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage official NCERT and SCERT digital textbook chapters, PDF downloads, and publishing state.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Textbook Chapter</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Books ({books.length})</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Class:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Classes</option>
              {classesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search textbook title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading curriculum books...</span>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No books found matching the current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Book Details</th>
                  <th className="py-3 px-4">Class & Subject</th>
                  <th className="py-3 px-4">Publisher & Edition</th>
                  <th className="py-3 px-4">Pages / PDF</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredBooks.map((item) => {
                  const classItem = classesList.find((c) => c.id === item.class_id);
                  const subjectItem = subjectsList.find((s) => s.id === item.subject_id);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-10 rounded shadow-xs flex items-center justify-center text-white shrink-0 text-[10px] font-bold"
                            style={{ backgroundColor: item.cover_color }}
                          >
                            Ch {item.chapter_number}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {item.title}
                            </div>
                            {item.hindi_title && (
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {item.hindi_title}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                            {classItem ? classItem.name : item.class_id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 capitalize">
                            {subjectItem ? subjectItem.name : item.subject_id}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.publisher}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.edition}</div>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          {item.pages} Pages
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
                          {item.file_name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            item.is_published
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                          }`}
                        >
                          {item.is_published ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-amber-500" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {item.file_url && (
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Download PDF Chapter"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Book"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingBook ? `Edit Book: ${editingBook.title}` : "Add Curriculum Textbook"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    required
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {classesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {subjectsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Book Chapter Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Math-Magic Class 3 — Chapter 4: How Many Times?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hindi Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. गणित का जादू — पाठ 4: कितने गुना?"
                  value={formData.hindi_title}
                  onChange={(e) => setFormData({ ...formData, hindi_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* PDF File Upload Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  PDF Textbook Chapter *
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input
                    type="file"
                    id="book-pdf-file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="book-pdf-file"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                  >
                    <UploadCloud className="w-8 h-8 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {selectedFile ? "Replace Textbook PDF" : "Upload Chapter PDF File"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {selectedFile ? `${selectedFile.name} (${formatBytes(selectedFile.size)})` : formData.file_name ? `Current: ${formData.file_name}` : "Official NCERT/SCERT printable chapter"}
                    </span>
                  </label>
                </div>
                {uploadError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{uploadError}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Edition
                  </label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chapter #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.chapter_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chapter_number: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pages: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.cover_color}
                    onChange={(e) => setFormData({ ...formData, cover_color: e.target.value })}
                    className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.cover_color}
                    onChange={(e) => setFormData({ ...formData, cover_color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Publish Textbook (Visible in Books Library & Topic Hub)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Chapter PDF...</span>
                    </>
                  ) : (
                    <span>Save Book</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Textbook Chapter"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete Book"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
