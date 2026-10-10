"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  ArrowUp,
  ArrowDown,
  X,
  Loader2,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ALL_CLASSES } from "@/data/classes";
import { ALL_SUBJECTS } from "@/data/subjects";
import { ALL_TOPICS } from "@/data/topics";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminTopic {
  id: string;
  class_id: string;
  subject_id: string;
  title: string;
  hindi_title: string;
  slug: string;
  chapter_number: number;
  short_description: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [classesList, setClassesList] = useState<Array<{ id: string; name: string }>>([]);
  const [subjectsList, setSubjectsList] = useState<Array<{ id: string; name: string }>>([]);

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("class-3");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<AdminTopic | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTopic | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    class_id: "class-3",
    subject_id: "mathematics",
    title: "",
    hindi_title: "",
    slug: "",
    chapter_number: 1,
    short_description: "",
    display_order: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    setClassesList(ALL_CLASSES.map((c) => ({ id: c.id, name: c.name })));
    setSubjectsList(ALL_SUBJECTS.map((s) => ({ id: s.id, name: s.name })));

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setTopics(
            (data as any[]).map((t: any) => ({
              id: t.id,
              class_id: t.class_id || "class-3",
              subject_id: t.subject_id.replace(`${t.class_id}-`, ""),
              title: t.title,
              hindi_title: t.hindi_title || "",
              slug: t.slug,
              chapter_number: t.chapter_number,
              short_description: t.short_description || "",
              display_order: t.display_order,
              is_active: t.is_active,
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
    setTopics(
      ALL_TOPICS.map((t, idx) => ({
        id: t.id,
        class_id: t.classId,
        subject_id: t.subjectId,
        title: t.title,
        hindi_title: t.hindiTitle,
        slug: t.slug,
        chapter_number: t.chapterNumber,
        short_description: t.description,
        display_order: idx + 1,
        is_active: true,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingTopic(null);
    setFormData({
      id: "",
      class_id: selectedClassFilter === "all" ? "class-3" : selectedClassFilter,
      subject_id: selectedSubjectFilter === "all" ? "mathematics" : selectedSubjectFilter,
      title: "",
      hindi_title: "",
      slug: "",
      chapter_number: 1,
      short_description: "",
      display_order: topics.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminTopic) => {
    setEditingTopic(item);
    setFormData({
      id: item.id,
      class_id: item.class_id,
      subject_id: item.subject_id,
      title: item.title,
      hindi_title: item.hindi_title,
      slug: item.slug,
      chapter_number: item.chapter_number,
      short_description: item.short_description,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (item: AdminTopic) => {
    const updated = !item.is_active;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("topics") as any).update({ is_active: updated }).eq("id", item.id);
    }
    setTopics((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, is_active: updated } : t))
    );
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === filteredTopics.length - 1)
    )
      return;

    const currentItem = filteredTopics[index];
    const targetItem = direction === "up" ? filteredTopics[index - 1] : filteredTopics[index + 1];

    const updatedTopics = topics.map((t) => {
      if (t.id === currentItem.id) return { ...t, display_order: targetItem.display_order };
      if (t.id === targetItem.id) return { ...t, display_order: currentItem.display_order };
      return t;
    });

    setTopics(updatedTopics);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await Promise.all([
        (supabase.from("topics") as any).update({ display_order: targetItem.display_order }).eq("id", currentItem.id),
        (supabase.from("topics") as any).update({ display_order: currentItem.display_order }).eq("id", targetItem.id),
      ]);
    }
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = formData.id || `${formData.class_id}-${formData.subject_id}-${slug}`;

    const payload: AdminTopic = {
      ...formData,
      id,
      slug,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbPayload = {
        id,
        class_id: formData.class_id,
        subject_id: `${formData.class_id}-${formData.subject_id}`,
        title: formData.title,
        hindi_title: formData.hindi_title,
        slug,
        chapter_number: formData.chapter_number,
        short_description: formData.short_description,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (editingTopic) {
        await (supabase.from("topics") as any).update(dbPayload).eq("id", editingTopic.id);
      } else {
        await (supabase.from("topics") as any).insert(dbPayload);
      }
    }

    if (editingTopic) {
      setTopics((prev) => prev.map((t) => (t.id === editingTopic.id ? payload : t)));
    } else {
      setTopics((prev) => [...prev, payload]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("topics").delete().eq("id", deleteTarget.id);
    }

    setTopics((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Filter & Search
  const filteredTopics = topics
    .filter((t) => {
      const matchesClass =
        selectedClassFilter === "all" || t.class_id === selectedClassFilter;
      const matchesSubject =
        selectedSubjectFilter === "all" || t.subject_id === selectedSubjectFilter;
      const matchesQuery =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.hindi_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSubject && matchesQuery;
    })
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Chapters & Lessons
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Topic / Chapter Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage syllabus chapters, sequence ordering, and visibility across classes and subjects.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Topic</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
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

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
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
            placeholder="Search topic title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading topics...</span>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No topics found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">Order</th>
                  <th className="py-3 px-4 w-16 text-center">Ch #</th>
                  <th className="py-3 px-4">Topic / Chapter</th>
                  <th className="py-3 px-4">Class & Subject</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredTopics.map((topic, idx) => {
                  const classItem = classesList.find((c) => c.id === topic.class_id);
                  const subjectItem = subjectsList.find((s) => s.id === topic.subject_id);

                  return (
                    <tr
                      key={topic.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-slate-400 w-4">{idx + 1}</span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(idx, "up")}
                              disabled={idx === 0}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(idx, "down")}
                              disabled={idx === filteredTopics.length - 1}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                        {topic.chapter_number}
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{topic.title}</span>
                            <span className="text-xs text-slate-400 font-normal">
                              ({topic.hindi_title})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
                            {topic.short_description}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                            {classItem ? classItem.name : topic.class_id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 capitalize">
                            {subjectItem ? subjectItem.name : topic.subject_id}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(topic)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            topic.is_active
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {topic.is_active ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(topic)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Topic"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(topic)}
                            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete Topic"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTopic ? `Edit Topic: ${editingTopic.title}` : "Add New Topic"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-4 pt-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topic Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fractions"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    required
                    value={formData.chapter_number}
                    onChange={(e) =>
                      setFormData({ ...formData, chapter_number: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hindi Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. भिन्न"
                    value={formData.hindi_title}
                    onChange={(e) => setFormData({ ...formData, hindi_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slug / URL Key *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. fractions-basics"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of what students will learn in this topic..."
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Active & Visible to Students</span>
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
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Topic"
        message={`Are you sure you want to delete ${deleteTarget?.title}? All associated notes, videos, worksheets, and books for this topic will be removed.`}
        confirmLabel="Yes, Delete Topic"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
