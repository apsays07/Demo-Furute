/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { useConfirm } from "@/lib/context/ConfirmContext";
import {
  Plus,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface GalleryImage {
  _id: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

interface GalleryFormData {
  category: string;
  featured: boolean;
}

function GalleryContent() {
  const { adminUser } = useAdminUser();
  const { confirm, toast } = useConfirm();
  // 1. STATE FOR LISTING & PAGINATION
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");

  // 2. STATE FOR MODAL FORMS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<GalleryFormData>();

  const categories = ["Office Sessions", "Global Workshops", "Mentoring Events", "Outdoor Breakthroughs", "General"];

  // Load gallery images
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          category: categoryFilter,
        });
        const res = await fetch(`/api/admin/gallery?${query.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setImages(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryFilter]);

  function openAddModal() {
    setImageBase64("");
    setFormError(null);
    reset({
      category: "General",
      featured: false,
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

  // Handle save
  async function handleSave(data: GalleryFormData) {
    if (!imageBase64) {
      setFormError("Please upload an image file.");
      return;
    }
    
    setFormSaving(true);
    setFormError(null);

    const payload = {
      ...data,
      imageUrl: imageBase64,
    };

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save image");
      }

      setIsModalOpen(false);
      reset();
      
      // Trigger a reload
      setCategoryFilter((prev) => prev);
      // Let's force a reload manually
      setImages((prev) => [result.data, ...prev]);
      toast("Image uploaded successfully!", "success");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
      toast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setFormSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const isConfirmed = await confirm("Are you sure you want to delete this gallery image?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img._id !== id));
        toast("Gallery image deleted successfully!", "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to delete image", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting image", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Category selector & actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <select
          className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10 "
        >
          <Plus className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Grid gallery */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading media gallery...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm group relative aspect-square flex flex-col justify-between"
            >
              <img src={item.imageUrl} alt="Gallery item" className="w-full h-full object-cover" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-black/60 text-white rounded-md uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded-md uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  {adminUser?.role !== "editor" && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md cursor-pointer transition-all"
                      title="Delete Image"
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
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Gallery is empty.</p>
          <p className="text-xs text-gray-500 mt-1">Upload pictures to showcase your events.</p>
        </div>
      )}

      {/* ADD GALLERY IMAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!formSaving) setIsModalOpen(false);
            }}
          />
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="font-extrabold text-gray-900">Upload Gallery Image</h3>
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

              {/* Photo Uploader */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Select Image File
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
                      Max 2MB.PNG, JPG, WEBP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 select-none cursor-pointer">
                  <input type="checkbox" {...register("featured")} className="rounded text-teal focus:ring-teal" />
                  Featured Image (stands out)
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
                      Uploading...
                    </>
                  ) : (
                    "Upload Image"
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

export default function GalleryPage() {
  return (
    <Suspense fallback={<div>Loading Gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
