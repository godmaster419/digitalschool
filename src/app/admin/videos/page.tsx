"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Play,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ALL_TOPICS } from "@/data/topics";
import { getAllVideos } from "@/data/resources";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AdminVideo {
  id: string;
  topic_id: string;
  topic_title: string;
  title: string;
  video_url: string;
  youtube_id: string;
  video_type: string;
  thumbnail_url: string;
  duration: string;
  channel: string;
  description: string;
  is_published: boolean;
  display_order: number;
}

/**
 * Extracts YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): { id: string; type: "youtube" | "youtube_shorts" } | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // YouTube Shorts: youtube.com/shorts/ID
  const shortsMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return { id: shortsMatch[1], type: "youtube_shorts" };
  }

  // Standard YouTube: watch?v=ID or youtu.be/ID
  const standardMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (standardMatch && standardMatch[1]) {
    return { id: standardMatch[1], type: "youtube" };
  }

  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return { id: cleanUrl, type: "youtube" };
  }

  return null;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [topicsList, setTopicsList] = useState<Array<{ id: string; title: string }>>([]);

  // Filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminVideo | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    topic_id: "",
    title: "",
    video_url: "",
    duration: "15:00",
    channel: "Digital School",
    description: "",
    is_published: true,
  });

  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);
  const [detectedYouTubeId, setDetectedYouTubeId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setTopicsList(ALL_TOPICS.map((t) => ({ id: t.id, title: `${t.title} (${t.classId})` })));

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("videos")
          .select("*, topics(title)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setVideos(
            data.map((v: any) => ({
              id: v.id,
              topic_id: v.topic_id,
              topic_title: v.topics?.title || v.topic_id,
              title: v.title,
              video_url: v.video_url,
              youtube_id: v.youtube_id || "",
              video_type: v.video_type || "youtube",
              thumbnail_url: v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`,
              duration: v.duration || "12:30",
              channel: v.channel || "Digital School",
              description: v.description || "",
              is_published: v.is_published,
              display_order: v.display_order,
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
    const defaultVideos = getAllVideos().map((v, idx) => ({
      id: `video-${v.topicId}`,
      topic_id: v.topicId,
      topic_title: v.topicTitle,
      title: v.title,
      video_url: `https://www.youtube.com/watch?v=${v.youtubeId}`,
      youtube_id: v.youtubeId,
      video_type: "youtube",
      thumbnail_url: v.thumbnailUrl,
      duration: v.duration,
      channel: v.channel,
      description: v.description || "",
      is_published: v.available,
      display_order: idx + 1,
    }));

    setVideos(defaultVideos);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingVideo(null);
    const firstTopic = topicsList[0];
    setFormData({
      id: "",
      topic_id: firstTopic ? firstTopic.id : "",
      title: "",
      video_url: "",
      duration: "15:00",
      channel: "Digital School Mathematics",
      description: "",
      is_published: true,
    });
    setUrlValidationError(null);
    setDetectedYouTubeId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminVideo) => {
    setEditingVideo(item);
    setFormData({
      id: item.id,
      topic_id: item.topic_id,
      title: item.title,
      video_url: item.video_url,
      duration: item.duration,
      channel: item.channel,
      description: item.description,
      is_published: item.is_published,
    });
    setUrlValidationError(null);
    setDetectedYouTubeId(item.youtube_id);
    setIsModalOpen(true);
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, video_url: url });
    if (!url.trim()) {
      setUrlValidationError(null);
      setDetectedYouTubeId(null);
      return;
    }

    const parsed = extractYouTubeId(url);
    if (parsed) {
      setUrlValidationError(null);
      setDetectedYouTubeId(parsed.id);
    } else {
      setUrlValidationError("Please paste a valid YouTube or YouTube Shorts URL.");
      setDetectedYouTubeId(null);
    }
  };

  const handleTogglePublish = async (item: AdminVideo) => {
    const updated = !item.is_published;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await (supabase.from("videos") as any).update({ is_published: updated }).eq("id", item.id);
    }
    setVideos((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, is_published: updated } : v))
    );
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = extractYouTubeId(formData.video_url);
    if (!parsed) {
      setUrlValidationError("A valid YouTube or YouTube Shorts URL is required.");
      return;
    }

    const id = formData.id || `video-${formData.topic_id}`;
    const selectedTopic = topicsList.find((t) => t.id === formData.topic_id);
    const thumbnailUrl = `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`;

    const payload: AdminVideo = {
      id,
      topic_id: formData.topic_id,
      topic_title: selectedTopic ? selectedTopic.title : formData.topic_id,
      title: formData.title,
      video_url: formData.video_url,
      youtube_id: parsed.id,
      video_type: parsed.type,
      thumbnail_url: thumbnailUrl,
      duration: formData.duration,
      channel: formData.channel,
      description: formData.description,
      is_published: formData.is_published,
      display_order: 1,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbPayload = {
        id,
        topic_id: formData.topic_id,
        title: formData.title,
        video_url: formData.video_url,
        youtube_id: parsed.id,
        video_type: parsed.type,
        thumbnail_url: thumbnailUrl,
        duration: formData.duration,
        channel: formData.channel,
        description: formData.description,
        is_published: formData.is_published,
        display_order: 1,
      };

      if (editingVideo) {
        await (supabase.from("videos") as any).update(dbPayload).eq("id", editingVideo.id);
      } else {
        await (supabase.from("videos") as any).insert(dbPayload);
      }
    }

    if (editingVideo) {
      setVideos((prev) => prev.map((v) => (v.id === editingVideo.id ? payload : v)));
    } else {
      setVideos((prev) => [payload, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("videos").delete().eq("id", deleteTarget.id);
    }

    setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Filter
  const filteredVideos = videos.filter((v) => {
    const matchesStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "published" && v.is_published) ||
      (selectedStatusFilter === "draft" && !v.is_published);
    const matchesQuery =
      searchQuery === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.topic_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Video Lectures Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Video Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Paste YouTube & Shorts links to automatically generate responsive embedded lessons for students.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Lecture</span>
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
            <option value="all">All Videos ({videos.length})</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search video by title or channel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Videos Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading videos...</span>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No video lectures found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Video Details</th>
                  <th className="py-3 px-4">Associated Topic</th>
                  <th className="py-3 px-4">Duration & Channel</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {filteredVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Thumbnail preview */}
                    <td className="py-3.5 px-4 w-28">
                      <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
                        {video.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Video className="w-5 h-5" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </td>

                    {/* Title & Type */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {video.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                            {video.video_type}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ID: {video.youtube_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Topic */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {video.topic_title}
                      </span>
                    </td>

                    {/* Duration / Channel */}
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div>{video.channel}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{video.duration}</div>
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(video)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          video.is_published
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                        }`}
                      >
                        {video.is_published ? (
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

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(video)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Video"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(video)}
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Video"
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

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingVideo ? `Edit Video: ${editingVideo.title}` : "Add Video Lecture"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
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
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 3 Maths: Multiplication as Repeated Addition"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Video URL with live validation & preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  YouTube or Shorts URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                  value={formData.video_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {urlValidationError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{urlValidationError}</span>
                  </p>
                )}
              </div>

              {/* Live Embed Preview */}
              {detectedYouTubeId && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      Player Embed Preview
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      ID: {detectedYouTubeId}
                    </span>
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${detectedYouTubeId}`}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Digital School Mathematics"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Approx Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14:20"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key concepts explained in this video lesson..."
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
                  <span>Publish Video (Visible on topic player & video explorer)</span>
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
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Video"
        message={`Are you sure you want to delete video "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete Video"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
