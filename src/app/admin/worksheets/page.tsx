"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  UploadCloud,
  File,
  X,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { uploadAssetFile, deleteAssetFile, formatBytes } from "@/lib/supabase/storage";
import { ALL_TOPICS } from "@/data/topics";
import { getAllWorksheets } from "@/data/resources";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminWorksheet {
  id: string;
  topic_id: string;
  topic_title: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: string;
  questions_count: number;
  total_marks: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  is_published: boolean;
  display_order: number;
}

export default function AdminWorksheetsPage() {
  const [worksheets, setWorksheets] = useState<AdminWorksheet[]>([]);
  const [topicsList, setTopicsList] = useState<Array<{ id: string; title: string }>>([]);

  // Filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorksheet, setEditingWorksheet] = useState<AdminWorksheet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminWorksheet | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    topic_id: "",
    title: "",
    description: "",
    file_url: "",
    file_name: "",
    file_size: "1.2 MB",
    questions_count: 15,
    total_marks: 25,
    difficulty: "Medium" as "Easy" | "Medium" | "Advanced",
    is_published: true,
  });

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setTopicsList(ALL_TOPICS.map((t) => ({ id: t.id, title: `${t.title} (${t.classId})` })));

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("worksheets")
          .select("*, topics(title)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setWorksheets(
            data.map((w: any) => ({
              id: w.id,
              topic_id: w.topic_id,
              topic_title: w.topics?.title || w.topic_id,
              title: w.title,
              description: w.description || "",
              file_url: w.file_url,
              file_name: w.file_name || "worksheet.pdf",
              file_type: w.file_type || "application/pdf",
              file_size: w.file_size || "1.2 MB",
              questions_count: w.questions_count,
              total_marks: w.total_marks,
              difficulty: (w.difficulty as any) || "Medium",
              is_published: w.is_published,
              display_order: w.display_order,
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
    const defaultList = getAllWorksheets().map((w, idx) => ({
      id: `worksheet-${w.topicId}`,
      topic_id: w.topicId,
      topic_title: w.topicTitle,
      title: w.title,
      description: `Practice worksheet for ${w.topicTitle}`,
      file_url: w.fileUrl,
      file_name: w.fileName,
      file_type: "application/pdf",
      file_size: "1.2 MB",
      questions_count: w.questionsCount,
      total_marks: w.totalMarks,
      difficulty: w.difficulty,
      is_published: w.available,
      display_order: idx + 1,
    }));

    setWorksheets(defaultList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingWorksheet(null);
    setSelectedFile(null);
    setUploadError(null);
    const firstTopic = topicsList[0];
    setFormData({
      id: "",
      topic_id: firstTopic ? firstTopic.id : "",
      title: "",
      description: "",
      file_url: "",
      file_name: "",
      file_size: "",
      questions_count: 15,
      total_marks: 25,
      difficulty: "Medium",
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminWorksheet) => {
    setEditingWorksheet(item);
    setSelectedFile(null);
    setUploadError(null);
    setFormData({
      id: item.id,
      topic_id: item.topic_id,
      title: item.title,
      description: item.description,
      file_url: item.file_url,
      file_name: item.file_name,
      file_size: item.file_size,
      questions_count: item.questions_count,
      total_marks: item.total_marks,
      difficulty: item.difficulty,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: AdminWorksheet) => {
    const updated = !item.is_published;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("worksheets") as any).update({ is_published: updated }).eq("id", item.id);
    }
    setWorksheets((prev) =>
      prev.map((w) => (w.id === item.id ? { ...w, is_published: updated } : w))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setUploadError("Only PDF files are supported for practice worksheets.");
        return;
      }
      setUploadError(null);
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        file_name: file.name,
        file_size: formatBytes(file.size),
      }));
    }
  };

  const handleSaveWorksheet = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalFileUrl = formData.file_url;
    let finalFileName = formData.file_name;
    let finalFileSize = formData.file_size;

    // Upload file if selected
    if (selectedFile) {
      setUploading(true);
      setUploadError(null);
      const uploadRes = await uploadAssetFile(selectedFile, "worksheets");
      if (!uploadRes.success || !uploadRes.fileUrl) {
        setUploadError(uploadRes.error || "File upload failed.");
        setUploading(false);
        return;
      }
      finalFileUrl = uploadRes.fileUrl;
      finalFileName = uploadRes.fileName || selectedFile.name;
      finalFileSize = uploadRes.fileSize || formatBytes(selectedFile.size);
      setUploading(false);
    }

    if (!finalFileUrl && !editingWorksheet?.file_url) {
      setUploadError("Please upload a PDF worksheet file.");
      return;
    }

    const id = formData.id || `worksheet-${formData.topic_id}`;
    const selectedTopic = topicsList.find((t) => t.id === formData.topic_id);

    const payload: AdminWorksheet = {
      id,
      topic_id: formData.topic_id,
      topic_title: selectedTopic ? selectedTopic.title : formData.topic_id,
      title: formData.title,
      description: formData.description,
      file_url: finalFileUrl,
      file_name: finalFileName,
      file_type: "application/pdf",
      file_size: finalFileSize,
      questions_count: formData.questions_count,
      total_marks: formData.total_marks,
      difficulty: formData.difficulty,
      is_published: formData.is_published,
      display_order: 1,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbPayload = {
        id,
        topic_id: formData.topic_id,
        title: formData.title,
        description: formData.description,
        file_url: finalFileUrl,
        file_name: finalFileName,
        file_type: "application/pdf",
        file_size: finalFileSize,
        questions_count: formData.questions_count,
        total_marks: formData.total_marks,
        difficulty: formData.difficulty,
        is_published: formData.is_published,
        display_order: 1,
      };

      if (editingWorksheet) {
        await (supabase.from("worksheets") as any).update(dbPayload).eq("id", editingWorksheet.id);
      } else {
        await (supabase.from("worksheets") as any).insert(dbPayload);
      }
    }

    if (editingWorksheet) {
      setWorksheets((prev) => prev.map((w) => (w.id === editingWorksheet.id ? payload : w)));
    } else {
      setWorksheets((prev) => [payload, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("worksheets").delete().eq("id", deleteTarget.id);
      if (deleteTarget.file_url) {
        await deleteAssetFile(deleteTarget.file_url);
      }
    }

    setWorksheets((prev) => prev.filter((w) => w.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Filter
  const filteredWorksheets = worksheets.filter((w) => {
    const matchesStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "published" && w.is_published) ||
      (selectedStatusFilter === "draft" && !w.is_published);
    const matchesQuery =
      searchQuery === "" ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.topic_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Practice Worksheets
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Worksheet Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Upload PDF printable problem sets, manage question counts, and toggle student availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Worksheet</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Worksheets ({worksheets.length})</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search worksheet title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Worksheets Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading worksheets...</span>
          </div>
        ) : filteredWorksheets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No worksheets found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Difficulty & Questions</th>
                  <th className="py-3 px-4">File Details</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredWorksheets.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description || "Printable practice worksheet"}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {item.topic_title}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.difficulty === "Easy"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                              : item.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {item.questions_count} Qs • {item.total_marks} Marks
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <File className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate max-w-[140px] font-mono text-[11px]">
                          {item.file_name}
                        </span>
                        <span className="text-[10px] text-slate-400">({item.file_size})</span>
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
                            title="Download / View PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Worksheet"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Worksheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingWorksheet ? `Edit Worksheet: ${editingWorksheet.title}` : "Upload New Worksheet"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWorksheet} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Associated Topic *
                </label>
                <select
                  required
                  value={formData.topic_id}
                  onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {topicsList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Worksheet Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 3 Mathematics: Multiplication Practice Sheet 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* PDF File Upload Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  PDF Worksheet File (Max 50MB) *
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input
                    type="file"
                    id="worksheet-pdf-file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="worksheet-pdf-file"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                  >
                    <UploadCloud className="w-8 h-8 text-blue-500" />
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {selectedFile ? "Replace Selected File" : "Choose PDF Document"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {selectedFile ? `${selectedFile.name} (${formatBytes(selectedFile.size)})` : formData.file_name ? `Current: ${formData.file_name}` : "Upload high-quality printable PDF"}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.questions_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        questions_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.total_marks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_marks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Instructions for students (e.g. Time limit: 30 minutes)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
                  <span>Publish Worksheet (Available in Worksheets Explorer)</span>
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
                      <span>Uploading to Supabase Storage...</span>
                    </>
                  ) : (
                    <span>Save Worksheet</span>
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
        title="Delete Worksheet"
        message={`Are you sure you want to delete worksheet "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete Worksheet"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
