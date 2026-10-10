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
  X,
  Loader2,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ALL_CLASSES } from "@/data/classes";
import { getSubjectById } from "@/data/subjects";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminSubject {
  id: string;
  class_id: string;
  name: string;
  hindi_name: string;
  slug: string;
  icon: string;
  color: string;
  bg_light: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [classesList, setClassesList] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AdminSubject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminSubject | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    class_id: "class-3",
    name: "",
    hindi_name: "",
    slug: "",
    icon: "BookOpen",
    color: "#2563eb",
    bg_light: "bg-blue-50 text-blue-700 border-blue-200",
    description: "",
    display_order: 1,
    is_active: true,
  });

  // Load Classes & Subjects
  const loadData = async () => {
    setLoading(true);

    // Classes list
    const classes = ALL_CLASSES.map((c) => ({ id: c.id, name: c.name }));
    setClassesList(classes);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setSubjects(
            (data as any[]).map((s: any) => ({
              id: s.id,
              class_id: s.class_id || "class-3",
              name: s.name,
              hindi_name: s.hindi_name || "",
              slug: s.slug,
              icon: s.icon || "BookOpen",
              color: s.color || "#2563eb",
              bg_light: s.bg_light || "",
              description: s.description || "",
              display_order: s.display_order,
              is_active: s.is_active,
            }))
          );
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Default static mapping: create class-assigned subjects
    const defaultList: AdminSubject[] = [];
    for (const c of ALL_CLASSES) {
      let order = 1;
      for (const subId of c.availableSubjectIds) {
        const sub = getSubjectById(subId);
        if (sub) {
          defaultList.push({
            id: `${c.id}-${sub.slug}`,
            class_id: c.id,
            name: sub.name,
            hindi_name: sub.hindiName,
            slug: sub.slug,
            icon: sub.icon,
            color: sub.color,
            bg_light: sub.bgLight,
            description: sub.description,
            display_order: order++,
            is_active: true,
          });
        }
      }
    }

    setSubjects(defaultList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      id: "",
      class_id: selectedClassFilter === "all" ? "class-3" : selectedClassFilter,
      name: "",
      hindi_name: "",
      slug: "",
      icon: "BookOpen",
      color: "#2563eb",
      bg_light: "bg-blue-50 text-blue-700 border-blue-200",
      description: "",
      display_order: subjects.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminSubject) => {
    setEditingSubject(item);
    setFormData({
      id: item.id,
      class_id: item.class_id,
      name: item.name,
      hindi_name: item.hindi_name,
      slug: item.slug,
      icon: item.icon,
      color: item.color,
      bg_light: item.bg_light,
      description: item.description,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (item: AdminSubject) => {
    const updated = !item.is_active;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("subjects") as any).update({ is_active: updated }).eq("id", item.id);
    }
    setSubjects((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, is_active: updated } : s))
    );
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");
    const id = formData.id || `${formData.class_id}-${slug}`;

    const payload: AdminSubject = {
      ...formData,
      id,
      slug,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (editingSubject) {
        await (supabase.from("subjects") as any).update(payload).eq("id", editingSubject.id);
      } else {
        await (supabase.from("subjects") as any).insert(payload);
      }
    }

    if (editingSubject) {
      setSubjects((prev) => prev.map((s) => (s.id === editingSubject.id ? payload : s)));
    } else {
      setSubjects((prev) => [...prev, payload]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("subjects").delete().eq("id", deleteTarget.id);
    }

    setSubjects((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Filter & Search
  const filteredSubjects = subjects.filter((s) => {
    const matchesClass =
      selectedClassFilter === "all" || s.class_id === selectedClassFilter;
    const matchesQuery =
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindi_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Curriculum Subjects
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Subjects Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure subjects, class syllabi, icons, and visibility across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Class Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Classes ({subjects.length} subjects)</option>
            {classesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search subject name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading subjects...</span>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No subjects match your filter or search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Icon / Color</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredSubjects.map((sub) => {
                  const classItem = classesList.find((c) => c.id === sub.class_id);
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{sub.name}</span>
                            <span className="text-xs text-slate-400 font-normal">
                              ({sub.hindi_name})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            ID: {sub.id} • Slug: /{sub.slug}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {classItem ? classItem.name : sub.class_id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: sub.color }}
                          />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {sub.icon}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(sub)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            sub.is_active
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {sub.is_active ? (
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
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Subject"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(sub)}
                            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete Subject"
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
                {editingSubject ? `Edit Subject: ${editingSubject.name}` : "Add New Subject"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Class *
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hindi Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. गणित"
                    value={formData.hindi_name}
                    onChange={(e) => setFormData({ ...formData, hindi_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slug / URL Key *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mathematics"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Subject learning objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <span>Active & Visible in Syllabus</span>
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Subject"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This will remove it from the class syllabus and delete associated topics.`}
        confirmLabel="Yes, Delete Subject"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
