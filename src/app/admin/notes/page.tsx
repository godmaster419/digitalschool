"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Loader2,
  Heading2,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlertCircle,
  Link2,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ALL_CLASSES } from "@/data/classes";
import { ALL_TOPICS } from "@/data/topics";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminNote {
  id: string;
  topic_id: string;
  topic_title: string;
  class_id: string;
  subject_id: string;
  title: string;
  content: string; // Markdown / formatted string
  overview: string;
  read_time: string;
  is_published: boolean;
  display_order: number;
}

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [topicsList, setTopicsList] = useState<Array<{ id: string; title: string; class_id: string; subject_id: string }>>([]);

  // Filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AdminNote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminNote | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    topic_id: "",
    title: "",
    overview: "",
    read_time: "5 min read",
    content: "",
    is_published: true,
  });

  const loadData = async () => {
    setLoading(true);

    const mappedTopics = ALL_TOPICS.map((t) => ({
      id: t.id,
      title: `${t.title} (${t.classId} ${t.subjectId})`,
      class_id: t.classId,
      subject_id: t.subjectId,
    }));
    setTopicsList(mappedTopics);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("notes")
          .select("*, topics(title, class_id, subject_id)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setNotes(
            data.map((n: any) => {
              const t = n.topics;
              let contentStr = "";
              if (typeof n.content === "string") {
                contentStr = n.content;
              } else if (n.content?.sections) {
                // Flatten sections to readable markdown
                contentStr = n.content.sections
                  .map((s: any) => `## ${s.heading}\n\n${s.content}`)
                  .join("\n\n");
              }
              return {
                id: n.id,
                topic_id: n.topic_id,
                topic_title: t?.title || n.topic_id,
                class_id: t?.class_id || "class-3",
                subject_id: t?.subject_id?.replace(`${t.class_id}-`, "") || "general",
                title: n.title,
                content: contentStr || n.overview || "",
                overview: n.overview || "",
                read_time: n.read_time || "5 min read",
                is_published: n.is_published,
                display_order: n.display_order,
              };
            })
          );
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Default static mapping from ALL_TOPICS
    const defaultList: AdminNote[] = [];
    for (const t of ALL_TOPICS) {
      if (t.notes) {
        const contentStr = t.notes.sections
          .map((s) => `## ${s.heading}\n\n${s.content}`)
          .join("\n\n");

        defaultList.push({
          id: `notes-${t.id}`,
          topic_id: t.id,
          topic_title: t.title,
          class_id: t.classId,
          subject_id: t.subjectId,
          title: `${t.title} Notes`,
          content: contentStr,
          overview: t.notes.overview,
          read_time: t.notes.readTime,
          is_published: t.notes.available,
          display_order: 1,
        });
      }
    }

    setNotes(defaultList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingNote(null);
    const firstTopic = topicsList[0];
    setFormData({
      id: "",
      topic_id: firstTopic ? firstTopic.id : "",
      title: "",
      overview: "",
      read_time: "5 min read",
      content: "## Introduction\n\nWrite your educational explanation here...",
      is_published: true,
    });
    setActiveTab("write");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminNote) => {
    setEditingNote(item);
    setFormData({
      id: item.id,
      topic_id: item.topic_id,
      title: item.title,
      overview: item.overview,
      read_time: item.read_time,
      content: item.content,
      is_published: item.is_published,
    });
    setActiveTab("write");
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: AdminNote) => {
    const updated = !item.is_published;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("notes") as any).update({ is_published: updated }).eq("id", item.id);
    }
    setNotes((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_published: updated } : n))
    );
  };

  // Helper toolbar actions for Notes editor
  const insertSyntax = (before: string, after: string = "") => {
    const textarea = document.getElementById("notes-editor-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = `${before}${selected || "text"}${after}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setFormData({ ...formData, content: newContent });
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formData.id || `notes-${formData.topic_id}`;
    const selectedTopic = topicsList.find((t) => t.id === formData.topic_id);

    // Build structured sections from markdown for compatibility
    const sections = formData.content
      .split(/\n(?=## )/)
      .map((block, idx) => {
        const lines = block.trim().split("\n");
        const headingLine = lines[0].startsWith("## ") ? lines[0].replace("## ", "") : `Section ${idx + 1}`;
        const contentBody = lines.slice(1).join("\n").trim() || block;
        return {
          id: `sec-${idx + 1}`,
          heading: headingLine,
          content: contentBody,
        };
      });

    const structuredNotes = {
      available: formData.is_published,
      readTime: formData.read_time,
      overview: formData.overview,
      sections,
    };

    const payload: AdminNote = {
      id,
      topic_id: formData.topic_id,
      topic_title: selectedTopic ? selectedTopic.title : formData.topic_id,
      class_id: selectedTopic ? selectedTopic.class_id : "class-3",
      subject_id: selectedTopic ? selectedTopic.subject_id : "general",
      title: formData.title,
      content: formData.content,
      overview: formData.overview,
      read_time: formData.read_time,
      is_published: formData.is_published,
      display_order: 1,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbPayload = {
        id,
        topic_id: formData.topic_id,
        title: formData.title,
        content: structuredNotes,
        overview: formData.overview,
        read_time: formData.read_time,
        is_published: formData.is_published,
        display_order: 1,
      };

      if (editingNote) {
        await (supabase.from("notes") as any).update(dbPayload).eq("id", editingNote.id);
      } else {
        await (supabase.from("notes") as any).insert(dbPayload);
      }
    }

    if (editingNote) {
      setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? payload : n)));
    } else {
      setNotes((prev) => [payload, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("notes").delete().eq("id", deleteTarget.id);
    }

    setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Filtering
  const filteredNotes = notes.filter((n) => {
    const matchesStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "published" && n.is_published) ||
      (selectedStatusFilter === "draft" && !n.is_published);
    const matchesClass =
      selectedClassFilter === "all" || n.class_id === selectedClassFilter;
    const matchesQuery =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topic_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesClass && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Curriculum Content
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Chapter Notes Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Create, edit, format reading notes, and toggle Draft / Published status for students.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter Notes</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses ({notes.length})</option>
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
              {ALL_CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Notes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading notes...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No notes found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title & Overview</th>
                  <th className="py-3 px-4">Associated Topic</th>
                  <th className="py-3 px-4">Read Time</th>
                  <th className="py-3 px-4 text-center">Publish Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {note.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {note.overview || "Structured reading notes"}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {note.topic_title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                          {note.class_id}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {note.read_time}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(note)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          note.is_published
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                        }`}
                      >
                        {note.is_published ? (
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
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(note)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Notes"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(note)}
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Notes"
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

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingNote ? `Edit Notes: ${editingNote.title}` : "Add New Chapter Notes"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Topic *
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
                    Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7 min read"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fractions Chapter Notes & Key Concepts"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter Overview / Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="A short introductory overview of this topic..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Notes Content Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Content Body (Headings, Paragraphs, Bullet points)
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                        activeTab === "write"
                          ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400"
                          : "text-slate-500"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                        activeTab === "preview"
                          ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400"
                          : "text-slate-500"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {activeTab === "write" ? (
                  <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                    {/* Formatting Toolbar */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1 flex-wrap text-slate-600 dark:text-slate-300">
                      <button
                        type="button"
                        onClick={() => insertSyntax("\n## ", "\n")}
                        title="Heading"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-xs flex items-center gap-1"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                        <span>H2</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("**", "**")}
                        title="Bold"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("*", "*")}
                        title="Italic"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("\n- ", "")}
                        title="Bullet List"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("\n1. ", "")}
                        title="Numbered List"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("\n> **Important:** ", "\n")}
                        title="Important Note / Callout"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-xs flex items-center gap-1 text-amber-600"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Callout</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("[", "](https://...)")}
                        title="Link"
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      id="notes-editor-textarea"
                      rows={8}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Use ## Heading for section headers, bullet points, etc."
                      className="w-full p-3 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="p-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs sm:text-sm max-h-60 overflow-y-auto space-y-3">
                    <div className="font-bold text-base text-blue-600 dark:text-blue-400">
                      {formData.title}
                    </div>
                    {formData.overview && (
                      <p className="text-slate-600 dark:text-slate-300 italic">
                        {formData.overview}
                      </p>
                    )}
                    <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                      {formData.content}
                    </div>
                  </div>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Publish Notes (Publicly visible to students)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Chapter Notes"
        message={`Are you sure you want to delete notes for "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete Notes"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
