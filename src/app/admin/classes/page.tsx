"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Loader2,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ALL_CLASSES } from "@/data/classes";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminClass {
  id: string;
  name: string;
  hindi_name: string;
  slug: string;
  level: string;
  description: string;
  display_order: number;
  is_active: boolean;
  show_on_home: boolean;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AdminClass | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminClass | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    hindi_name: "",
    slug: "",
    level: "primary",
    description: "",
    display_order: 1,
    is_active: true,
    show_on_home: true,
  });

  // Load Classes
  const loadClasses = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("classes")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setClasses(
            (data as any[]).map((c: any) => ({
              id: c.id,
              name: c.name,
              hindi_name: c.hindi_name || "",
              slug: c.slug,
              level: c.level,
              description: c.description || "",
              display_order: c.display_order,
              is_active: c.is_active,
              show_on_home: c.show_on_home,
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
    setClasses(
      ALL_CLASSES.map((c) => ({
        id: c.id,
        name: c.name,
        hindi_name: c.hindiName,
        slug: c.slug,
        level: c.level,
        description: c.description,
        display_order: c.order,
        is_active: c.active,
        show_on_home: c.showOnHome,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      id: `class-${classes.length + 1}`,
      name: "",
      hindi_name: "",
      slug: "",
      level: "primary",
      description: "",
      display_order: classes.length + 1,
      is_active: true,
      show_on_home: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminClass) => {
    setEditingClass(item);
    setFormData({
      id: item.id,
      name: item.name,
      hindi_name: item.hindi_name,
      slug: item.slug,
      level: item.level,
      description: item.description,
      display_order: item.display_order,
      is_active: item.is_active,
      show_on_home: item.show_on_home,
    });
    setIsModalOpen(true);
  };

  // Toggle Active
  const handleToggleActive = async (item: AdminClass) => {
    const updated = !item.is_active;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("classes") as any).update({ is_active: updated }).eq("id", item.id);
    }
    setClasses((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, is_active: updated } : c))
    );
  };

  // Toggle Show on Home
  const handleToggleHome = async (item: AdminClass) => {
    const updated = !item.show_on_home;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("classes") as any).update({ show_on_home: updated }).eq("id", item.id);
    }
    setClasses((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, show_on_home: updated } : c))
    );
  };

  // Move Order
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === classes.length - 1)
    )
      return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newClasses = [...classes];
    const temp = newClasses[index];
    newClasses[index] = newClasses[targetIndex];
    newClasses[targetIndex] = temp;

    // Reassign display_order
    const reordered = newClasses.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    setClasses(reordered);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await Promise.all(
        reordered.map((c) =>
          (supabase.from("classes") as any).update({ display_order: c.display_order }).eq("id", c.id)
        )
      );
    }
  };

  // Save Class (Insert or Update)
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");
    const payload: AdminClass = {
      ...formData,
      slug,
      id: formData.id || slug,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (editingClass) {
        await (supabase.from("classes") as any).update(payload).eq("id", editingClass.id);
      } else {
        await (supabase.from("classes") as any).insert(payload);
      }
    }

    if (editingClass) {
      setClasses((prev) => prev.map((c) => (c.id === editingClass.id ? payload : c)));
    } else {
      setClasses((prev) => [...prev, payload]);
    }

    setIsModalOpen(false);
  };

  // Delete Class
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("classes").delete().eq("id", deleteTarget.id);
    }

    setClasses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              CMS Curriculum Hierarchy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Class Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Control class syllabus visibility, home page showcase, and learning level order.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading classes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Class Details</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4 text-center">Active Status</th>
                  <th className="py-3 px-4 text-center">Home Showcase</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {classes.map((cls, idx) => (
                  <tr
                    key={cls.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Order column */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-400 w-4">{cls.display_order}</span>
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
                            disabled={idx === classes.length - 1}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Class Info */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{cls.name}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            ({cls.hindi_name})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ID: {cls.id} • Slug: /{cls.slug}
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {cls.level}
                      </span>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cls)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          cls.is_active
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cls.is_active ? (
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

                    {/* Home Showcase Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleHome(cls)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          cls.show_on_home
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cls.show_on_home ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Show on Home</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cls)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Class"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cls)}
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Class"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingClass ? `Edit Class: ${editingClass.name}` : "Add New Class"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 9"
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
                    placeholder="e.g. कक्षा ९"
                    value={formData.hindi_name}
                    onChange={(e) => setFormData({ ...formData, hindi_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slug / URL Path *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. class-9"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pre-primary">Pre-Primary (LKG/UKG)</option>
                    <option value="primary">Primary (Class 1-5)</option>
                    <option value="middle">Middle (Class 6-8)</option>
                    <option value="secondary">Secondary (Class 9-10)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Overview of syllabus for this class..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Active Curriculum</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.show_on_home}
                    onChange={(e) => setFormData({ ...formData, show_on_home: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show on Home Page</span>
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
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Class"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone and will delete all associated subjects and topics.`}
        confirmLabel="Yes, Delete Class"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
