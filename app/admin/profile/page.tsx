"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  User,
  Camera,
  Phone,
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  Lock,
  Mail,
  Pencil,
  Save,
  X,
  Shield,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  AtSign,
} from "lucide-react";
import { useAdminUser } from "@/lib/context/AdminUserContext";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  jobTitle: string;
}

interface AccountFormData {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/* ───────── Reusable Field Components ───────── */
function FieldInput({
  icon: Icon,
  label,
  disabled,
  error,
  hint,
  children,
}: {
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] mb-1.5">
        {label}
      </label>
      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
          disabled ? "" : "ring-0 focus-within:ring-2 focus-within:ring-teal/20"
        }`}
      >
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-350 z-10">
          <Icon className="w-4 h-4" />
        </span>
        {children}
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-[10px] text-slate-400">{hint}</p>
      )}
    </div>
  );
}

const inputCls = (disabled?: boolean) =>
  `w-full pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all duration-200 ${
    disabled
      ? "bg-transparent border-0 text-slate-700 cursor-default pl-10"
      : "bg-slate-50/80 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal/60 placeholder:text-slate-300"
  }`;

export default function AdminProfilePage() {
  const { adminUser, refreshUser } = useAdminUser();

  // Photo
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Profile section
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileEditMode, setProfileEditMode] = useState(false);

  // Account section
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: regP,
    handleSubmit: handleP,
    reset: resetP,
    formState: { errors: errP },
  } = useForm<ProfileFormData>({
    defaultValues: { firstName: "", lastName: "", phone: "", bio: "", jobTitle: "" },
  });

  const {
    register: regA,
    handleSubmit: handleA,
    reset: resetA,
    getValues: getA,
    formState: { errors: errA },
  } = useForm<AccountFormData>({
    defaultValues: { username: "", email: "", currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        const p = data.profile;
        resetP({ firstName: p.firstName ?? "", lastName: p.lastName ?? "", phone: p.phone ?? "", bio: p.bio ?? "", jobTitle: p.jobTitle ?? "" });
        resetA({ username: p.username ?? "", email: p.email ?? "", currentPassword: "", newPassword: "", confirmPassword: "" });
        setPhotoUrl(p.photoUrl ?? "");
      }
    } catch (err) {
      console.error("Load profile error:", err);
    }
  }, [resetP, resetA]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // Drag-and-drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file) validateAndSetFile(file);
    };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => { el.removeEventListener("dragover", onDragOver); el.removeEventListener("dragleave", onDragLeave); el.removeEventListener("drop", onDrop); };
  }, []);

  function validateAndSetFile(file: File) {
    setPhotoError(null);
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Only JPEG, PNG, and WebP images are supported.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { setPhotoError("File size must be under 2MB."); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  }

  async function handlePhotoUpload() {
    if (!photoFile) return;
    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      const res = await fetch("/api/admin/profile/photo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.photoUrl);
      setPhotoPreview(null);
      setPhotoFile(null);
      await refreshUser();
    } catch (err: unknown) {
      setPhotoError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function cancelPreview() {
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onProfileSubmit(data: ProfileFormData) {
    setProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update profile");
      setProfileSuccess("Profile updated successfully!");
      setProfileEditMode(false);
      await refreshUser();
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProfileLoading(false);
    }
  }

  async function onAccountSubmit(data: AccountFormData) {
    setAccountLoading(true);
    setAccountSuccess(null);
    setAccountError(null);
    const payload: Record<string, string> = { username: data.username, email: data.email };
    if (data.currentPassword && data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        setAccountError("New passwords do not match.");
        setAccountLoading(false);
        return;
      }
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
    }
    try {
      const res = await fetch("/api/admin/auth/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update account");
      setAccountSuccess("Account settings updated!");
      resetA({ username: result.user.username, email: result.user.email, currentPassword: "", newPassword: "", confirmPassword: "" });
      await refreshUser();
      setTimeout(() => setAccountSuccess(null), 4000);
    } catch (err: unknown) {
      setAccountError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setAccountLoading(false);
    }
  }

  // Derived values
  const firstName = adminUser?.firstName ?? "";
  const lastName = adminUser?.lastName ?? "";
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : adminUser?.username ?? "Admin";
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : (adminUser?.username?.slice(0, 2) ?? "AD").toUpperCase();

  // Only treat user-uploaded photos as valid (not site logos)
  const isValidProfilePhoto = (url: string) =>
    url.startsWith("/uploads/admins/") || url.startsWith("data:") || url.startsWith("http");

  const savedPhoto = photoUrl && isValidProfilePhoto(photoUrl) ? photoUrl
    : adminUser?.photoUrl && isValidProfilePhoto(adminUser.photoUrl) ? adminUser.photoUrl
    : "";
  const currentPhoto = photoPreview || savedPhoto;

  const roleLabel = adminUser?.role === "superadmin" ? "Super Admin" : adminUser?.role === "admin" ? "Admin" : "Editor";
  const roleGradient = adminUser?.role === "superadmin"
    ? "from-violet-500 to-indigo-600"
    : adminUser?.role === "admin"
    ? "from-teal to-cyan-500"
    : "from-amber-500 to-orange-500";
  const roleBg = adminUser?.role === "superadmin"
    ? "bg-gradient-to-br from-violet-500 to-indigo-600"
    : adminUser?.role === "admin"
    ? "bg-gradient-to-br from-teal to-cyan-500"
    : "bg-gradient-to-br from-amber-500 to-orange-500";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* ═══════════════ HERO IDENTITY CARD ═══════════════ */}
      <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(8,127,140,0.08)] border border-slate-100">

        {/* ── Banner + Avatar row ── */}
        <div className="relative" style={{ background: "linear-gradient(135deg, #087f8c 0%, #0ea5b0 40%, #6366f1 100%)" }}>
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
          <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/30" />
          <div className="absolute top-10 left-24 w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute top-6 right-32 w-3 h-3 rounded-full bg-white/20" />
          <div className="absolute bottom-8 right-12 w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />

          {/* Banner content: avatar on left, name on right — all inside the banner */}
          <div className="flex items-center justify-between px-8 py-8 gap-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0 group" ref={dropRef}>
                <div
                  className={`w-24 h-24 rounded-2xl border-[3px] border-white/80 shadow-2xl overflow-hidden transition-all duration-300 ${
                    isDragging ? "ring-4 ring-white/50 scale-105" : ""
                  } ${roleBg} flex items-center justify-center`}
                >
                  {currentPhoto ? (
                    <Image
                      src={currentPhoto}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      unoptimized={currentPhoto.startsWith("data:")}
                    />
                  ) : (
                    <span className="text-3xl font-black text-white select-none tracking-tight">{initials}</span>
                  )}
                </div>
                {/* Camera hover overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer border-none backdrop-blur-[1px]"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-[9px] font-bold text-white/90 tracking-wider">CHANGE</span>
                </button>
                {/* Online badge */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Name & meta — white text inside banner */}
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-black text-white tracking-tight drop-shadow-sm">{displayName}</h2>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full text-white bg-white/20 border border-white/30 backdrop-blur-sm shadow-sm`}>
                    <Sparkles className="w-2.5 h-2.5" />
                    {roleLabel}
                  </span>
                </div>
                <p className="text-sm text-white/75 mt-1 font-medium">{adminUser?.jobTitle || "Administrator"}</p>
                <p className="text-xs text-white/55 mt-0.5 font-medium">{adminUser?.email || ""}</p>
              </div>
            </div>

            {/* Upload button — right side inside banner */}
            <div className="shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white/90 bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 backdrop-blur-sm rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* White section: preview / error / hint */}
        <div className="bg-white px-8 pb-6 pt-4">
          {photoPreview && (
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl animate-slide-up">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-200 shrink-0">
                <Image src={photoPreview} alt="Preview" width={48} height={48} className="object-cover w-full h-full" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-900">Ready to upload</p>
                <p className="text-xs text-amber-600 truncate mt-0.5">{photoFile?.name} · {((photoFile?.size ?? 0) / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={cancelPreview} className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-500 transition-colors cursor-pointer border-none bg-transparent shrink-0">
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal to-teal-dark text-white text-xs font-black rounded-xl shadow-lg shadow-teal/25 hover:shadow-teal/40 transition-all disabled:opacity-60 cursor-pointer border-none shrink-0"
              >
                {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingPhoto ? "Uploading..." : "Save Photo"}
              </button>
            </div>
          )}

          {photoError && (
            <div className={`${photoPreview ? "mt-3" : ""} flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs animate-slide-up`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {photoError}
            </div>
          )}

          <p className={`${photoPreview || photoError ? "mt-3" : ""} text-[10px] text-slate-400 font-medium`}>
            Drag &amp; drop an image onto your avatar · JPEG, PNG, WebP · max 2MB
          </p>
        </div>
      </div>

      {/* ═══════════════ PERSONAL INFO ═══════════════ */}
      <div className="bg-white border border-slate-100/80 rounded-3xl shadow-[0_8px_40px_rgba(16,27,53,0.03)] overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal/10 to-cyan-50 flex items-center justify-center border border-teal/10">
              <User className="w-4.5 h-4.5 text-teal" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Personal Information</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Your name, role, and contact details</p>
            </div>
          </div>
          {!profileEditMode ? (
            <button
              onClick={() => setProfileEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-teal bg-slate-50 hover:bg-teal/5 border border-slate-200 hover:border-teal/30 rounded-xl transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          ) : (
            <span className="text-[10px] font-bold text-teal bg-teal/10 px-3 py-1.5 rounded-full border border-teal/20">Editing</span>
          )}
        </div>

        <div className="px-8 py-7">
          {/* Feedback banners */}
          {profileSuccess && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-800">{profileSuccess}</p>
            </div>
          )}
          {profileError && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-red-50 border border-red-200/80 rounded-2xl animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm font-bold text-red-800">{profileError}</p>
            </div>
          )}

          <form onSubmit={handleP(onProfileSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FieldInput icon={User} label="First Name" disabled={!profileEditMode} error={errP.firstName?.message as string}>
                <input
                  type="text"
                  disabled={!profileEditMode}
                  placeholder={profileEditMode ? "Enter first name" : "Not set"}
                  className={inputCls(!profileEditMode) + " rounded-xl"}
                  {...regP("firstName")}
                />
              </FieldInput>

              <FieldInput icon={User} label="Last Name" disabled={!profileEditMode} error={errP.lastName?.message as string}>
                <input
                  type="text"
                  disabled={!profileEditMode}
                  placeholder={profileEditMode ? "Enter last name" : "Not set"}
                  className={inputCls(!profileEditMode) + " rounded-xl"}
                  {...regP("lastName")}
                />
              </FieldInput>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FieldInput icon={Briefcase} label="Job Title" disabled={!profileEditMode}>
                <input
                  type="text"
                  disabled={!profileEditMode}
                  placeholder={profileEditMode ? "e.g. Marketing Director" : "Not set"}
                  className={inputCls(!profileEditMode) + " rounded-xl"}
                  {...regP("jobTitle")}
                />
              </FieldInput>

              <FieldInput icon={Phone} label="Phone Number" disabled={!profileEditMode}>
                <input
                  type="tel"
                  disabled={!profileEditMode}
                  placeholder={profileEditMode ? "+91 98765 43210" : "Not set"}
                  className={inputCls(!profileEditMode) + " rounded-xl"}
                  {...regP("phone")}
                />
              </FieldInput>
            </div>

            <FieldInput icon={FileText} label="Bio / About Me" disabled={!profileEditMode}>
              <textarea
                rows={profileEditMode ? 4 : 3}
                disabled={!profileEditMode}
                placeholder={profileEditMode ? "Write a short bio about yourself..." : "Not set"}
                className={inputCls(!profileEditMode) + " rounded-xl resize-none"}
                {...regP("bio")}
              />
            </FieldInput>

            {profileEditMode && (
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 animate-slide-up">
                <button
                  type="button"
                  onClick={() => { setProfileEditMode(false); setProfileSuccess(null); setProfileError(null); loadProfile(); }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white text-xs font-black rounded-xl shadow-md shadow-teal/25 transition-all disabled:opacity-50 cursor-pointer border-none"
                >
                  {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ═══════════════ ACCOUNT & SECURITY ═══════════════ */}
      <div className="bg-white border border-slate-100/80 rounded-3xl shadow-[0_8px_40px_rgba(16,27,53,0.03)] overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100/50">
            <Shield className="w-4.5 h-4.5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">Account &amp; Security</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Username, email address and password management</p>
          </div>
        </div>

        <div className="px-8 py-7">
          {accountSuccess && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-800">{accountSuccess}</p>
            </div>
          )}
          {accountError && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-red-50 border border-red-200/80 rounded-2xl animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm font-bold text-red-800">{accountError}</p>
            </div>
          )}

          <form onSubmit={handleA(onAccountSubmit)} className="space-y-5">
            {/* Credentials */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] mb-4">Credentials</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldInput icon={AtSign} label="Username" error={errA.username?.message as string}>
                  <input
                    type="text"
                    className={inputCls() + " rounded-xl"}
                    {...regA("username", { required: "Username is required" })}
                  />
                </FieldInput>

                <FieldInput icon={Mail} label="Email Address" error={errA.email?.message as string}>
                  <input
                    type="email"
                    className={inputCls() + " rounded-xl"}
                    {...regA("email", { required: "Email is required" })}
                  />
                </FieldInput>
              </div>
            </div>

            {/* Password section */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">Change Password</p>
                <span className="text-[10px] text-slate-300 font-medium">— leave blank to keep current</span>
              </div>

              <div className="space-y-4">
                <FieldInput icon={Lock} label="Current Password">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter your current password"
                    className={inputCls() + " rounded-xl pr-10"}
                    {...regA("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </FieldInput>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldInput icon={Lock} label="New Password" error={errA.newPassword?.message as string}
                    hint="Minimum 6 characters">
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="New secure password"
                      className={inputCls() + " rounded-xl pr-10"}
                      {...regA("newPassword", {
                        validate: (v) => {
                          if (getA("currentPassword") && !v) return "New password is required";
                          if (v && v.length < 6) return "Min 6 characters";
                          return true;
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </FieldInput>

                  <FieldInput icon={Lock} label="Confirm Password" error={errA.confirmPassword?.message as string}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      className={inputCls() + " rounded-xl pr-10"}
                      {...regA("confirmPassword", {
                        validate: (v) => {
                          const np = getA("newPassword");
                          if (np && v !== np) return "Passwords do not match";
                          return true;
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </FieldInput>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={accountLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 cursor-pointer border-none"
              >
                {accountLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {accountLoading ? "Saving..." : "Update Account"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
