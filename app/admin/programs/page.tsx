/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { useConfirm } from "@/lib/context/ConfirmContext";
import {
  Plus,
  Search,
  Award,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
} from "lucide-react";

interface Program {
  _id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  image?: string;
  pdf?: string;
  visible: boolean;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ProgramFormData {
  title: string;
  description: string;
  duration: string;
  category: string;
  visible: boolean;
}

function ProgramsContent() {
  const { adminUser } = useAdminUser();
  const { confirm, toast } = useConfirm();
  // 1. STATE FOR LISTING & PAGINATION
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // 2. STATE FOR MODAL FORMS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Program | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>();

  const categories = ["1-Day Workshops", "Corporate Training", "Personal Mentoring", "Experiential", "Other"];

  // Load programs
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          category: categoryFilter,
          page: page.toString(),
          limit: "6",
        });
        const res = await fetch(`/api/admin/programs?${query.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setPrograms(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, categoryFilter, page]);

  function openAddModal() {
    setEditingItem(null);
    setImageBase64("");
    setPdfBase64("");
    setPdfName("");
    setFormError(null);
    reset({
      title: "",
      description: "",
      duration: "",
      category: "1-Day Workshops",
      visible: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: Program) {
    setEditingItem(item);
    setImageBase64(item.image || "");
    setPdfBase64(item.pdf || "");
    setPdfName(item.pdf ? "Brochure_File.pdf" : "");
    setFormError(null);
    reset({
      title: item.title,
      description: item.description,
      duration: item.duration,
      category: item.category,
      visible: item.visible,
    });
    setIsModalOpen(true);
  }

  // Handle local image file to base64
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

  // Handle local PDF brochure to base64
  function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setFormError("PDF brochure must be smaller than 4MB.");
        return;
      }
      setPdfName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle save
  async function handleSave(data: ProgramFormData) {
    setFormSaving(true);
    setFormError(null);

    const payload = {
      ...data,
      image: imageBase64,
      pdf: pdfBase64,
    };

    try {
      const url = editingItem ? `/api/admin/programs/${editingItem._id}` : "/api/admin/programs";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save program");
      }

      setIsModalOpen(false);
      reset();
      setPage(1);
      // Trigger a reload
      setSearch((prev) => prev + " ");
      setTimeout(() => setSearch((prev) => prev.trim()), 50);
      toast(editingItem ? "Program updated successfully!" : "Program created successfully!", "success");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
      toast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setFormSaving(false);
    }
  }

  // Toggle visibility directly
  async function handleToggleVisible(item: Program) {
    try {
      const res = await fetch(`/api/admin/programs/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !item.visible }),
      });
      if (res.ok) {
        setPrograms((prev) =>
          prev.map((p) => (p._id === item._id ? { ...p, visible: !p.visible } : p))
        );
        toast(item.visible ? "Program marked as hidden!" : "Program marked as visible!", "success");
      } else {
        toast("Failed to update program visibility", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred", "error");
    }
  }

  // Delete program
  async function handleDelete(id: string) {
    const isConfirmed = await confirm("Are you sure you want to delete this training program?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p._id !== id));
        toast("Training program deleted successfully!", "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to delete program", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting program", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters & action bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal rounded-xl text-sm outline-none transition-all"
              placeholder="Search program title, details..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="w-full md:w-auto px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10 "
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading programs catalog...</p>
        </div>
      ) : programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {programs.map((item) => (
            <div
              key={item._id}
              className={`bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(16,27,53,0.015)] hover:shadow-[0_20px_40px_rgba(16,27,53,0.04)] hover:-translate-y-1.5 flex flex-col justify-between transition-all duration-300 relative ${
                item.visible ? "border-gray-200" : "border-gray-200 bg-gray-50/50 opacity-70"
              }`}
            >
              <div>
                {/* Program image preview */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-150">
                      <Award className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-md uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h4 className="font-extrabold text-gray-900 leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs font-bold text-teal uppercase tracking-wider bg-teal-light px-2.5 py-1 rounded-md inline-block">
                    Duration: {item.duration}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/30">
                <div className="flex gap-3 text-xs font-bold">
                  {item.pdf && (
                    <a
                      href={item.pdf}
                      download={`${item.title.replace(/\s+/g, "_")}_Syllabus.pdf`}
                      className="px-2.5 py-1 rounded-lg border bg-white border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                      title="Download PDF brochure"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      PDF
                    </a>
                  )}
                  <button
                    onClick={() => handleToggleVisible(item)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      item.visible
                        ? "bg-teal-light text-teal border-teal/20 hover:bg-teal-light/80"
                        : "bg-white text-gray-400 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-2">
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
          <p className="text-gray-400 text-sm font-semibold">No training programs listed.</p>
          <p className="text-xs text-gray-500 mt-1">Create a new program syllabus to begin.</p>
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
                {editingItem ? "Edit Program Details" : "Add Training Program"}
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
                  Program Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="e.g. Breakthrough Execution Program"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="text-[10px] text-red-500">{errors.title.message as string}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Duration Info
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    placeholder="e.g. 6 Weeks / 1 Full Day"
                    {...register("duration", { required: "Duration info is required" })}
                  />
                  {errors.duration && (
                    <span className="text-[10px] text-red-500">{errors.duration.message as string}</span>
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none resize-none"
                  placeholder="Summarize course goals, modules, target audience..."
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <span className="text-[10px] text-red-500">{errors.description.message as string}</span>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-gray-100 py-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Program Image Cover
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-150 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                      {imageBase64 ? (
                        <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-4 h-4 text-gray-400" />
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold hover:bg-gray-50 cursor-pointer"
                      >
                        Upload Cover
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Brochure Syllabus (PDF)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-150 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                      {pdfBase64 ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <Upload className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <input
                        type="file"
                        id="pdf-file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handlePdfUpload}
                      />
                      <label
                        htmlFor="pdf-file"
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold hover:bg-gray-50 cursor-pointer"
                      >
                        Upload PDF
                      </label>
                      {pdfName && <p className="text-[9px] text-gray-500 truncate max-w-[120px]">{pdfName}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("visible")} className="rounded text-teal focus:ring-teal" />
                  Visible on website catalog
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
                    "Save Program"
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

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div>Loading Programs...</div>}>
      <ProgramsContent />
    </Suspense>
  );
}
