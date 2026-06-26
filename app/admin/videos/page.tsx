/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useForm } from "react-hook-form";
import WebsitePreview from "@/components/admin/WebsitePreview";
import SaveSuccessBanner from "@/components/admin/SaveSuccessBanner";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { useConfirm } from "@/lib/context/ConfirmContext";
import {
  Plus,
  Search,
  Video,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Upload,
} from "lucide-react";

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url ? url.match(regExp) : null;
  return match && match[2] && match[2].length === 11 ? match[2] : null;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  featured: boolean;
  visible: boolean;
  thumbnail?: string;
  createdAt: string;
}

interface VideoFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  featured: boolean;
  visible: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function VideosContent() {
  const { adminUser } = useAdminUser();
  const { confirm, toast } = useConfirm();
  // 1. STATE FOR LISTING & PAGINATION
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // 2. STATE FOR MODAL FORMS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Video | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [thumbnailBase64, setThumbnailBase64] = useState("");
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VideoFormData>();

  // Categories list
  const categoriesList = ["Speaking", "Mentoring", "Interactions", "Workshops", "General"];

  // Load videos
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          category,
          page: page.toString(),
          limit: "6",
        });
        const res = await fetch(`/api/admin/videos?${query.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setVideos(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, category, page]);

  function openAddModal() {
    setEditingItem(null);
    setThumbnailBase64("");
    setFormError(null);
    reset({
      title: "",
      description: "",
      youtubeUrl: "",
      category: "General",
      featured: false,
      visible: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: Video) {
    setEditingItem(item);
    setThumbnailBase64(item.thumbnail || "");
    setFormError(null);
    reset({
      title: item.title,
      description: item.description,
      youtubeUrl: item.youtubeUrl,
      category: item.category,
      featured: item.featured,
      visible: item.visible,
    });
    setIsModalOpen(true);
  }

  // Handle thumbnail file selection
  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setThumbnailBase64(reader.result as string);
    reader.readAsDataURL(file);
  }

  // Handle form save (Create or Update)
  async function handleSave(data: VideoFormData) {
    setFormSaving(true);
    setFormError(null);

    // Use uploaded thumbnail if present, else auto-generate from YouTube
    const ytId = getYouTubeId(data.youtubeUrl);
    const thumbnail = thumbnailBase64 ||
      (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : "");
    const payload = { ...data, thumbnail };

    try {
      const url = editingItem ? `/api/admin/videos/${editingItem._id}` : "/api/admin/videos";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save video");
      }

      setIsModalOpen(false);
      setSaveSuccess(true);
      reset();
      setPage(1);
      // Trigger a reload
      setSearch((prev) => prev + " ");
      setTimeout(() => setSearch((prev) => prev.trim()), 50);
      toast(editingItem ? "Video updated successfully!" : "Video created successfully!", "success");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
      toast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setFormSaving(false);
    }
  }

  // Toggle visible status in grid
  async function handleToggleVisible(item: Video) {
    try {
      const res = await fetch(`/api/admin/videos/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !item.visible }),
      });
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, visible: !v.visible } : v))
        );
        // Trigger a reload since backend might have auto-deleted the oldest video to maintain limit
        setSearch((prev) => prev + " ");
        setTimeout(() => setSearch((prev) => prev.trim()), 50);
        toast(item.visible ? "Video marked as hidden!" : "Video marked as visible!", "success");
      } else {
        toast("Failed to update visibility status", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred", "error");
    }
  }

  // Toggle featured status in grid
  async function handleToggleFeatured(item: Video) {
    try {
      const res = await fetch(`/api/admin/videos/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !item.featured }),
      });
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, featured: !v.featured } : v))
        );
        // Trigger a reload since backend might have auto-deleted the oldest video to maintain limit
        setSearch((prev) => prev + " ");
        setTimeout(() => setSearch((prev) => prev.trim()), 50);
        toast(item.featured ? "Video removed from featured!" : "Video marked as featured!", "success");
      } else {
        toast("Failed to update featured status", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred", "error");
    }
  }

  // Delete video
  async function handleDelete(id: string) {
    const isConfirmed = await confirm("Are you sure you want to delete this video resource?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v._id !== id));
        toast("Video resource deleted successfully!", "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to delete video", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting video", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top filters and actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal rounded-xl text-sm outline-none transition-all"
              placeholder="Search title, description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <WebsitePreview path="/" hash="#events" label="Preview Videos" />
          <button
            onClick={openAddModal}
            className="w-full md:w-auto px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </div>
      </div>

      <SaveSuccessBanner
        show={saveSuccess}
        onDismiss={() => setSaveSuccess(false)}
        previewPath="/#events"
        message="Video saved! Mark as Featured to show on homepage."
      />

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading videos catalog...</p>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((item) => {
            const ytId = getYouTubeId(item.youtubeUrl);
            return (
              <div
                key={item._id}
                className={`bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(16,27,53,0.005)] hover:shadow-[0_8px_20px_rgba(16,27,53,0.015)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative ${
                  item.visible ? "border-slate-200" : "border-slate-200 bg-slate-50/50 opacity-70"
                }`}
              >
                <div>
                  {/* YouTube Thumbnail Preview */}
                  <div className="aspect-video bg-slate-50 relative overflow-hidden group border-b border-slate-100">
                    {ytId ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Video className="w-5 h-5" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 text-[7px] font-bold px-1.5 py-0.5 bg-black/60 backdrop-blur-md text-white rounded uppercase tracking-wider select-none">
                      {item.category}
                    </span>
                  </div>

                  {/* Copy content */}
                  <div className="p-3">
                    <h4 className="font-bold text-slate-800 text-xs leading-snug line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
                      {item.description || "No description provided."}
                    </p>
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[8px] text-teal hover:text-teal-dark font-bold uppercase tracking-wider mt-2.5"
                    >
                      Watch on YouTube
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 bg-slate-50/20">
                  <div className="flex gap-1.5 text-[8px] font-bold">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`px-1.5 py-0.5 rounded text-[8px] border transition-all cursor-pointer ${
                        item.featured
                          ? "bg-teal-light text-teal border-teal/20"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      Featured
                    </button>
                    <button
                      onClick={() => handleToggleVisible(item)}
                      className={`p-0.5 rounded border transition-all cursor-pointer ${
                        item.visible
                          ? "bg-teal-light text-teal border-teal/20 hover:bg-teal-light/80"
                          : "bg-white text-slate-400 border-slate-200 hover:bg-slate-150"
                      }`}
                    >
                      {item.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-0.5 bg-white hover:bg-teal-light text-slate-500 hover:text-teal border border-slate-200 hover:border-teal/20 rounded cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {adminUser?.role !== "editor" && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-0.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-gray-400 text-sm font-semibold">No videos found matching the criteria.</p>
          <p className="text-xs text-gray-500 mt-1">Try resetting search filters or upload a video.</p>
        </div>
      )}

      {/* Pagination controls */}
      {!loading && pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500">
            Showing page <span className="font-bold text-gray-700">{page}</span> of{" "}
            <span className="font-bold text-gray-700">{pagination.pages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!formSaving) setIsModalOpen(false);
            }}
          />
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="font-extrabold text-gray-900">
                {editingItem ? "Edit Video Info" : "Add Speaking/Mentoring Video"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 p-4 border border-red-100 rounded-xl text-xs flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Video Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="e.g. Passion Without Priority Keynote"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="text-[10px] text-red-500">{errors.title.message as string}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                    {...register("youtubeUrl", { required: "YouTube URL is required" })}
                  />
                  {errors.youtubeUrl && (
                    <span className="text-[10px] text-red-500">
                      {errors.youtubeUrl.message as string}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
                    {...register("category")}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none resize-none"
                  placeholder="Summary of the video speaking context..."
                  {...register("description")}
                />
              </div>

              {/* THUMBNAIL UPLOAD */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Custom Thumbnail <span className="font-normal normal-case text-gray-400">(optional — auto-uses YouTube thumbnail if blank)</span>
                </label>
                <div className="flex items-center gap-3">
                  {thumbnailBase64 ? (
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={thumbnailBase64} alt="thumb" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setThumbnailBase64(""); if (thumbInputRef.current) thumbInputRef.current.value = ""; }}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                      >✕</button>
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 flex-shrink-0">
                      <Video className="w-6 h-6" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("featured")} className="rounded text-teal focus:ring-teal" />
                  Featured Video
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("visible")} className="rounded text-teal focus:ring-teal" />
                  Visible on website
                </label>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSaving}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10  disabled:opacity-50"
                >
                  {formSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Video"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<div>Loading Videos...</div>}>
      <VideosContent />
    </Suspense>
  );
}
