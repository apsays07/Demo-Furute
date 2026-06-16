"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  KeyRound,
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  interface SettingsFormData {
    username: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SettingsFormData>({
    defaultValues: {
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load current admin details
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const result = await res.json();
          setValue("username", result.user.username);
          setValue("email", result.user.email);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, [setValue]);

  interface UpdatePayload {
    username: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }

  async function onSubmit(data: SettingsFormData) {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: UpdatePayload = {
      username: data.username,
      email: data.email,
    };

    if (data.currentPassword && data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        setErrorMsg("New passwords do not match.");
        setLoading(false);
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
      if (!res.ok) {
        throw new Error(result.error || "Failed to update settings");
      }

      setSuccessMsg("Settings updated successfully!");
      
      // Clear password fields
      reset({
        username: result.user.username,
        email: result.user.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Notifications */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-150 text-red-650 p-4 rounded-2xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-150 text-green-700 p-4 rounded-2xl text-sm flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">Admin Account Info</h3>
          <p className="text-sm text-gray-500 mt-2">
            Configure username, email context, and change your password to keep the admin portal secure.
          </p>
        </div>

        {/* Right Form Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-[clamp(20px,2.5vw,36px)] shadow-[0_10px_30px_rgba(16,27,53,0.015)] md:col-span-2 relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  {...register("username", { required: "Username is required" })}
                />
              </div>
              {errors.username && (
                <span className="text-[10px] text-red-500">{errors.username.message as string}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <span className="text-[10px] text-red-500">{errors.email.message as string}</span>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-teal" />
                Change Password
              </h4>

              <div className="space-y-4">
                {/* Current password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                      placeholder="Enter current password"
                      {...register("currentPassword")}
                    />
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                      placeholder="Enter new password (min 6 chars)"
                      {...register("newPassword", {
                        validate: (val) => {
                          if (getValues("currentPassword") && !val) {
                            return "New password is required to change password";
                          }
                          if (val && val.length < 6) {
                            return "Password must be at least 6 characters long";
                          }
                          return true;
                        },
                      })}
                    />
                  </div>
                  {errors.newPassword && (
                    <span className="text-[10px] text-red-500">
                      {errors.newPassword.message as string}
                    </span>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                      placeholder="Confirm new password"
                      {...register("confirmPassword", {
                        validate: (val) => {
                          const newPass = getValues("newPassword");
                          if (newPass && val !== newPass) {
                            return "New passwords do not match";
                          }
                          return true;
                        },
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-[10px] text-red-500">
                      {errors.confirmPassword.message as string}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-teal/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
