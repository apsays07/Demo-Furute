/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import WebsitePreview from "@/components/admin/WebsitePreview";
import SaveSuccessBanner from "@/components/admin/SaveSuccessBanner";
import RichTextEditor from "@/components/admin/RichTextEditor";
import BulkActionBar from "@/components/admin/BulkActionBar";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { useConfirm } from "@/lib/context/ConfirmContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  company: string;
  review: string;
  image?: string;
  rating: number;
  featured: boolean;
  visible: boolean;
  createdAt: string;
}

interface TestimonialFormData {
  name: string;
  designation: string;
  company: string;
  review: string;
  featured: boolean;
  visible: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function TestimonialsContent() {
  const { adminUser } = useAdminUser();
  const searchParams = useSearchParams();
  const { confirm, toast } = useConfirm();
  
  // 1. STATE FOR LISTING & PAGINATION
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // 1b. STATE FOR BULK SELECTION
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  async function handleBulkDelete() {
    const isConfirmed = await confirm(`Are you sure you want to delete ${selectedIds.length} selected testimonials?`);
    if (!isConfirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) => fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" }))
      );
      setTestimonials((prev) => prev.filter((t) => !selectedIds.includes(t._id)));
      setSelectedIds([]);
      toast("Testimonials deleted successfully", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to delete some testimonials", "error");
    }
  }

  async function handleBulkToggleVisibility() {
    try {
      const itemsToUpdate = testimonials.filter((t) => selectedIds.includes(t._id));
      await Promise.all(
        itemsToUpdate.map((item) =>
          fetch(`/api/admin/testimonials/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visible: !item.visible }),
          })
        )
      );

      setTestimonials((prev) =>
        prev.map((t) => (selectedIds.includes(t._id) ? { ...t, visible: !t.visible } : t))
      );
      setSelectedIds([]);
      toast("Visibility toggled successfully", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to toggle visibility", "error");
    }
  }

  function handleBulkExport() {
    const selectedData = testimonials.filter((t) => selectedIds.includes(t._id));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `testimonials_export_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast("Data exported successfully", "success");
  }

  // 2. STATE FOR MODAL FORMS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TestimonialFormData>();

  // Load testimonials
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          page: page.toString(),
          limit: "6",
        });
        const res = await fetch(`/api/admin/testimonials?${query.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setTestimonials(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, page]);

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setImageBase64("");
    setFormError(null);
    reset({
      name: "",
      designation: "",
      company: "",
      review: "",
      featured: false,
      visible: true,
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

  function openEditModal(item: Testimonial) {
    setEditingItem(item);
    setImageBase64(item.image || "");
    setFormError(null);
    reset({
      name: item.name,
      designation: item.designation,
      company: item.company,
      review: item.review,
      featured: item.featured,
      visible: item.visible,
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
  async function handleSave(data: TestimonialFormData) {
    setFormSaving(true);
    setFormError(null);
    
    const payload = {
      ...data,
      image: imageBase64,
    };

    try {
      const url = editingItem
        ? `/api/admin/testimonials/${editingItem._id}`
        : "/api/admin/testimonials";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save testimonial");
      }

      // Close modal & reload data
      setIsModalOpen(false);
      setSaveSuccess(true);
      reset();
      setPage(1); // Back to first page
      // Trigger a reload
      setSearch((prev) => prev + " ");
      setTimeout(() => setSearch((prev) => prev.trim()), 50);
      toast(editingItem ? "Testimonial updated successfully!" : "Testimonial created successfully!", "success");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
      toast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setFormSaving(false);
    }
  }

  // Handle Toggle visibility directly in grid
  async function handleToggleVisible(item: Testimonial) {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !item.visible }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === item._id ? { ...t, visible: !t.visible } : t))
        );
        toast(item.visible ? "Testimonial marked as hidden!" : "Testimonial marked as visible!", "success");
      } else {
        toast("Failed to update visibility status", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred", "error");
    }
  }

  // Handle Toggle featured status directly in grid
  async function handleToggleFeatured(item: Testimonial) {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !item.featured }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === item._id ? { ...t, featured: !t.featured } : t))
        );
        toast(item.featured ? "Testimonial removed from featured!" : "Testimonial marked as featured!", "success");
      } else {
        toast("Failed to update featured status", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred", "error");
    }
  }

  async function handleDelete(id: string) {
    const isConfirmed = await confirm("Are you sure you want to delete this testimonial?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        toast("Testimonial deleted successfully!", "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to delete testimonial", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting testimonial", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top filter / action panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal rounded-xl text-sm outline-none transition-all"
            placeholder="Search name, reviews, designation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap justify-end">
          {testimonials.length > 0 && (
            <button
              onClick={() => {
                if (selectedIds.length === testimonials.length) {
                  setSelectedIds([]);
                } else {
                  setSelectedIds(testimonials.map((t) => t._id));
                }
              }}
              className="px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              {selectedIds.length === testimonials.length ? "Deselect All" : "Select All"}
            </button>
          )}
          <WebsitePreview path="/testimonials" label="Preview Testimonials" />
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>
      </div>

      <SaveSuccessBanner
        show={saveSuccess}
        onDismiss={() => setSaveSuccess(false)}
        previewPath="/testimonials"
        message="Testimonial saved! Changes are now live."
      />

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading testimonials catalog...</p>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className={`bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(16,27,53,0.015)] hover:shadow-[0_20px_40px_rgba(16,27,53,0.04)] hover:-translate-y-1.5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                item.visible ? "border-gray-200" : "border-gray-200 bg-gray-50/50 opacity-70"
              }`}
            >
              {/* Checkbox for Bulk Actions */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => {
                    setSelectedIds((prev) =>
                      prev.includes(item._id)
                        ? prev.filter((id) => id !== item._id)
                        : [...prev, item._id]
                    );
                  }}
                  className="w-4 h-4 rounded text-teal focus:ring-teal cursor-pointer"
                />
              </div>

              <div>
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm font-bold">
                        {item.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 truncate">
                      {item.designation} at <span className="font-semibold text-gray-700">{item.company}</span>
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-6 italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex gap-3 text-xs font-bold">
                  {/* Featured Status Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      item.featured
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    Featured
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => handleToggleVisible(item)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      item.visible
                        ? "bg-teal-light text-teal border-teal/20 hover:bg-teal-light/80"
                        : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                    }`}
                    title={item.visible ? "Hide Testimonial" : "Show Testimonial"}
                  >
                    {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 bg-gray-50 hover:bg-teal-light text-gray-600 hover:text-teal border border-gray-200 hover:border-teal/20 rounded-lg transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {adminUser?.role !== "editor" && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-650 border border-gray-200 hover:border-red-200 rounded-lg transition-all cursor-pointer"
                      title="Delete"
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
          <p className="text-gray-400 text-sm font-semibold">No testimonials match your filters.</p>
          <p className="text-xs text-gray-500 mt-1">Try resetting search query or add a new one.</p>
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
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
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

              {/* Grid 2 Column fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    placeholder="e.g. John Doe"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-500">{errors.name.message as string}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    placeholder="e.g. Founder / CEO"
                    {...register("designation", { required: "Designation is required" })}
                  />
                  {errors.designation && (
                    <span className="text-[10px] text-red-500">
                      {errors.designation.message as string}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="e.g. Acme Inc."
                  {...register("company", { required: "Company name is required" })}
                />
                {errors.company && (
                  <span className="text-[10px] text-red-500">{errors.company.message as string}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Review Text
                </label>
                <Controller
                  name="review"
                  control={control}
                  rules={{ required: "Review text is required" }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Paste review message here..."
                      rows={4}
                    />
                  )}
                />
                {errors.review && (
                  <span className="text-[10px] text-red-500">{errors.review.message as string}</span>
                )}
              </div>

              {/* Photo Uploader */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Author Profile Photo
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
                      Max 2MB. Supports PNG, JPG, WEBP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("featured")} className="rounded text-teal focus:ring-teal" />
                  Featured Testimonial
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("visible")} className="rounded text-teal focus:ring-teal" />
                  Visible on website
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
                    "Save Testimonial"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
        onToggleVisibility={handleBulkToggleVisibility}
        onExport={handleBulkExport}
        hasVisibility
      />
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<div>Loading Testimonials...</div>}>
      <TestimonialsContent />
    </Suspense>
  );
}
