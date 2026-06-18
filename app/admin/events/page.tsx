/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import WebsitePreview from "@/components/admin/WebsitePreview";
import SaveSuccessBanner from "@/components/admin/SaveSuccessBanner";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { useConfirm } from "@/lib/context/ConfirmContext";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  registrationLink?: string;
  status: "upcoming" | "past" | "active";
  featured: boolean;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  status: string;
  featured: boolean;
}

function EventsContent() {
  const { adminUser } = useAdminUser();
  const searchParams = useSearchParams();
  const { confirm, toast } = useConfirm();

  // 1. STATE FOR LISTING & PAGINATION
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // 2. STATE FOR MODAL FORMS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>();

  // Load events
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          status: statusFilter,
          page: page.toString(),
          limit: "6",
        });
        const res = await fetch(`/api/admin/events?${query.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setEvents(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, statusFilter, page]);

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setImageBase64("");
    setFormError(null);
    reset({
      title: "",
      description: "",
      date: "",
      location: "",
      registrationLink: "",
      status: "upcoming",
      featured: false,
    });
    setIsModalOpen(true);
  }, [reset]);

  // Open Add modal if url contains parameter (e.g. from dashboard quick action)
  useEffect(() => {
    if (searchParams.get("openAdd") === "true") {
      const timer = setTimeout(() => openAddModal(), 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, openAddModal]);

  function openEditModal(item: Event) {
    setEditingItem(item);
    setImageBase64(item.image || "");
    setFormError(null);
    reset({
      title: item.title,
      description: item.description,
      date: item.date,
      location: item.location,
      registrationLink: item.registrationLink,
      status: item.status,
      featured: item.featured,
    });
    setIsModalOpen(true);
  }

  // Handle local image file to base64 conversion
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError("Image size must be smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle form save (Create or Update)
  async function handleSave(data: EventFormData) {
    setFormSaving(true);
    setFormError(null);

    const payload = {
      ...data,
      image: imageBase64,
    };

    try {
      const url = editingItem ? `/api/admin/events/${editingItem._id}` : "/api/admin/events";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save event");
      }

      setIsModalOpen(false);
      setSaveSuccess(true);
      reset();
      setPage(1);
      // Trigger a reload
      setSearch((prev) => prev + " ");
      setTimeout(() => setSearch((prev) => prev.trim()), 50);
      toast(editingItem ? "Event updated successfully!" : "Event created successfully!", "success");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
      toast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setFormSaving(false);
    }
  }

  // Handle Toggle featured status
  async function handleToggleFeatured(item: Event) {
    try {
      const res = await fetch(`/api/admin/events/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !item.featured }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e._id === item._id ? { ...e, featured: !e.featured } : e))
        );
        toast(item.featured ? "Event removed from featured!" : "Event marked as featured!", "success");
      } else {
        toast("Failed to update event status", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred", "error");
    }
  }

  // Handle Delete event
  async function handleDelete(id: string) {
    const isConfirmed = await confirm("Are you sure you want to delete this event?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        toast("Event deleted successfully!", "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to delete event", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting event", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and action bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal rounded-xl text-sm outline-none transition-all"
              placeholder="Search title, location, description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <WebsitePreview path="/events" label="Preview Events" />
          <button
            onClick={openAddModal}
            className="w-full md:w-auto px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      <SaveSuccessBanner
        show={saveSuccess}
        onDismiss={() => setSaveSuccess(false)}
        previewPath="/events"
        message="Event saved! Changes are now live on the website."
      />

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading scheduled events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(16,27,53,0.015)] hover:shadow-[0_20px_40px_rgba(16,27,53,0.04)] hover:-translate-y-1.5 flex flex-col justify-between transition-all duration-300 relative"
            >
              {/* Premium Gradient Top Line */}
              <div className="h-[3px] w-full absolute top-0 left-0 bg-gradient-to-r from-teal to-mint z-10" />
              <div>
                {/* Event Cover Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden border-b border-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-150">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider text-white ${
                      item.status === "upcoming"
                        ? "bg-teal"
                        : item.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h4 className="font-extrabold text-gray-900 leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4 shrink-0 text-teal" />
                    <span>{new Date(item.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0 text-red-500" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/30">
                <button
                  onClick={() => handleToggleFeatured(item)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    item.featured
                      ? "bg-teal-light text-teal border-teal/20"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  Featured
                </button>

                <div className="flex items-center gap-2">
                  {item.registrationLink && (
                    <a
                      href={item.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-white hover:bg-teal-light text-teal border border-teal/20 rounded-lg cursor-pointer"
                      title="Registration Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 bg-white hover:bg-teal-light text-gray-600 border border-gray-200 hover:border-teal/20 rounded-lg cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {adminUser?.role !== "editor" && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 bg-white hover:bg-red-50 text-gray-600 border border-gray-200 hover:border-red-200 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-gray-400 text-sm font-semibold">No scheduled events found.</p>
          <p className="text-xs text-gray-500 mt-1">Try scheduling an upcoming event.</p>
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

      {/* ADD / EDIT MODAL DRAWER */}
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
                {editingItem ? "Edit Event details" : "Schedule New Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="bg-red-50 text-red-600 p-4 border border-red-100 rounded-xl text-xs flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="e.g. Breakthrough Pune 2026"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="text-[10px] text-red-500">{errors.title.message as string}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    {...register("date", { required: "Date is required" })}
                  />
                  {errors.date && (
                    <span className="text-[10px] text-red-500">{errors.date.message as string}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Status
                  </label>
                  <select
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
                    {...register("status")}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    placeholder="e.g. Swargate Office, Pune"
                    {...register("location", { required: "Location is required" })}
                  />
                  {errors.location && (
                    <span className="text-[10px] text-red-500">{errors.location.message as string}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Registration Link (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    placeholder="https://docs.google.com/forms/..."
                    {...register("registrationLink")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none resize-none"
                  placeholder="Tell people what this event is about, ticket details, speakers..."
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <span className="text-[10px] text-red-500">{errors.description.message as string}</span>
                )}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Event Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-150 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                    {imageBase64 ? (
                      <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      id="image-file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="image-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      Upload Photo
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Max 2MB. PNG, JPG, WEBP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("featured")} className="rounded text-teal focus:ring-teal" />
                  Featured Event (highlighted on page)
                </label>
              </div>

              {/* Submit Buttons */}
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
                    "Save Event"
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

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading Events...</div>}>
      <EventsContent />
    </Suspense>
  );
}
