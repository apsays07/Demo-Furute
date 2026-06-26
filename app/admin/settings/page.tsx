"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  User,
  KeyRound,
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Copy,
  Download,
  QrCode,
  Check,
  Trash2,
  Search,
} from "lucide-react";
import { useConfirm } from "@/lib/context/ConfirmContext";

export default function AdminSettingsPage() {
  const { confirm, toast } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // NextAuth Session
  const { data: session, update } = useSession();

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [setupOtp, setSetupOtp] = useState("");
  const [disablingOtp, setDisablingOtp] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);
  const [submitting2FA, setSubmitting2FA] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");
  const [backingUp, setBackingUp] = useState(false);

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

  // Load current admin details from NextAuth session
  useEffect(() => {
    if (session?.user) {
      setValue("username", session.user.name || "");
      setValue("email", session.user.email || "");
      setTwoFactorEnabled(session.user.requires2FA);
    }
  }, [session, setValue]);

  async function loadAuditLogs(searchVal = logSearch, actionVal = logActionFilter) {
    setLogsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchVal) params.set("search", searchVal);
      if (actionVal) params.set("action", actionVal);

      const res = await fetch(`/api/admin/auth/audit-logs?${params.toString()}`);
      const result = await res.json();
      if (res.ok) {
        setAuditLogs(result.logs || []);
      } else {
        console.error("Failed to load audit logs:", result.error);
      }
    } catch (err) {
      console.error("Error loading audit logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAuditLogs(logSearch, logActionFilter);
  };

  const [clearingLogs, setClearingLogs] = useState(false);

  async function handleClearLogs() {
    const isConfirmed = await confirm(
      "Are you sure you want to delete your entire security activity logs history? This action cannot be undone.",
      {
        title: "Clear Security History",
        confirmText: "Clear History",
        cancelText: "Cancel",
      }
    );
    if (!isConfirmed) return;

    setClearingLogs(true);
    try {
      const res = await fetch("/api/admin/auth/audit-logs", {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        setAuditLogs([]);
        toast("Security activity logs cleared successfully", "success");
      } else {
        toast(result.error || "Failed to clear history", "error");
      }
    } catch (err) {
      console.error("Error clearing logs:", err);
      toast("An error occurred while clearing history", "error");
    } finally {
      setClearingLogs(false);
    }
  }

  async function handleDownloadBackup() {
    setBackingUp(true);
    try {
      window.location.href = "/api/admin/backup";
      toast("Downloading database backup snapshot...", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to download backup", "error");
    } finally {
      setBackingUp(false);
    }
  }

  useEffect(() => {
    if (activeTab === "security") {
      loadAuditLogs();
    }
  }, [activeTab]);

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

      // Sync NextAuth session token client-side
      await update({
        username: result.user.username,
        email: result.user.email,
      });

      setSuccessMsg("Settings updated successfully!");
      loadAuditLogs();

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

  // 2FA Setup Activation flow
  async function handleStartSetup() {
    setSubmitting2FA(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/auth/2fa/generate");
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to generate 2FA secret");
      }
      setQrCode(result.qrCode);
      setSecret(result.secret);
      setIsSettingUp(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting2FA(false);
    }
  }

  async function handleVerifySetup() {
    if (!setupOtp || setupOtp.trim().length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code.");
      return;
    }
    setSubmitting2FA(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: setupOtp.trim() }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to verify authenticator code");
      }

      // Update session values so middleware/client immediately detects 2FA active state
      await update({
        requires2FA: true,
        is2FAVerified: true,
      });

      setBackupCodes(result.backupCodes);
      setTwoFactorEnabled(true);
      setIsSettingUp(false);
      setSetupOtp("");
      setSuccessMsg("Two-factor authentication enabled successfully!");
      loadAuditLogs();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting2FA(false);
    }
  }

  async function handleDisable2FA() {
    if (!disablingOtp || disablingOtp.trim() === "") {
      setErrorMsg("Please enter an authenticator code or recovery code.");
      return;
    }
    setSubmitting2FA(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: disablingOtp.trim() }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to disable 2FA");
      }

      // Update NextAuth token to set 2FA inactive
      await update({
        requires2FA: false,
        is2FAVerified: false,
      });

      setTwoFactorEnabled(false);
      setIsDisabling(false);
      setDisablingOtp("");
      setSuccessMsg("Two-factor authentication disabled successfully.");
      loadAuditLogs();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting2FA(false);
    }
  }

  const handleCopyBackupCodes = () => {
    if (!backupCodes) return;
    const text = backupCodes.join("\n");
    navigator.clipboard.writeText(text);
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    if (!backupCodes) return;
    const text = backupCodes.join("\r\n");
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "furute-admin-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Notifications */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-150 text-red-655 p-4 rounded-2xl text-sm flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-150 text-emerald-700 p-4 rounded-2xl text-sm flex items-start gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-100 gap-1 select-none">
        <button
          onClick={() => {
            setActiveTab("profile");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`pb-4 px-6 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === "profile"
              ? "border-teal text-teal font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
          }`}
        >
          Account Profile
        </button>
        <button
          onClick={() => {
            setActiveTab("security");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`pb-4 px-6 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === "security"
              ? "border-teal text-teal font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
          }`}
        >
          Security & 2FA
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal focus:bg-white transition-all"
                    {...register("username", { required: "Username is required" })}
                  />
                </div>
                {errors.username && (
                  <span className="text-[10px] text-red-500 block mt-1.5">{errors.username.message as string}</span>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal focus:bg-white transition-all"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-red-500 block mt-1.5">{errors.email.message as string}</span>
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
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal focus:bg-white transition-all"
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
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal focus:bg-white transition-all"
                        placeholder="Enter new password (min 8 chars, strong)"
                        {...register("newPassword", {
                          validate: (val) => {
                            if (getValues("currentPassword") && !val) {
                              return "New password is required to change password";
                            }
                            if (val) {
                              if (val.length < 8) {
                                return "Password must be at least 8 characters long";
                              }
                              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                              if (!regex.test(val)) {
                                return "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&)";
                              }
                            }
                            return true;
                          },
                        })}
                      />
                    </div>
                    {errors.newPassword && (
                      <span className="text-[10px] text-red-500 block mt-1.5">
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
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal focus:bg-white transition-all"
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
                      <span className="text-[10px] text-red-500 block mt-1.5">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          {/* Left Column Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">Two-Factor Security</h3>
            <p className="text-sm text-gray-500 mt-2">
              Protect your administrative access using a mobile authenticator app. Once enabled, standard logins will require a 2FA code.
            </p>
          </div>

          {/* Right Settings Container */}
          <div className="bg-white border border-slate-100 rounded-3xl p-[clamp(20px,2.5vw,36px)] shadow-[0_10px_30px_rgba(16,27,53,0.015)] md:col-span-2 relative overflow-hidden">
            
            {/* 1. Recovery / Backup Codes display (Final Step of Activation) */}
            {backupCodes && backupCodes.length > 0 ? (
              <div className="space-y-6">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">Save Your Recovery Codes</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    If you lose access to your authenticator device, you can use these backup codes to log in. Each code is single-use only. <strong>This is the only time they will be shown.</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-5 font-mono text-sm text-slate-800 tracking-wider text-center select-all">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="py-1.5 border-b border-slate-100/50">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleCopyBackupCodes}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border-none"
                  >
                    {copiedCodes ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Codes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadBackupCodes}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border-none"
                  >
                    <Download className="w-4 h-4" />
                    Download (.txt)
                  </button>
                  <button
                    onClick={() => setBackupCodes(null)}
                    className="px-5 py-2 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border-none ml-auto"
                  >
                    Done / Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Status Indicator */}
                <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      twoFactorEnabled 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Authenticator Status
                      </div>
                      <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                        {twoFactorEnabled ? "Two-Factor Active" : "Two-Factor Disabled"}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${
                    twoFactorEnabled
                      ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}>
                    {twoFactorEnabled ? "Secure" : "Vulnerable"}
                  </span>
                </div>

                {/* 2. Interactive Setup State */}
                {isSettingUp && qrCode && secret && (
                  <div className="border border-slate-100 rounded-2xl p-6 bg-white space-y-6 animate-scale-up">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-teal" />
                      <h4 className="text-sm font-bold text-slate-900">Scan QR Code</h4>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Scan this QR code with Google Authenticator, Duo, or another TOTP app. If scanning isn&apos;t possible, enter the secret code manually.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCode} alt="TOTP QR Code" className="w-[150px] h-[150px] object-contain block" />
                      </div>
                      <div className="space-y-3 text-center sm:text-left min-w-0">
                        <div className="min-w-0">
                          <strong className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Secret Key</strong>
                          <span className="font-mono text-sm text-slate-700 select-all block mt-0.5 tracking-wider bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold break-all">{secret}</span>
                        </div>
                        <div>
                          <strong className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Device Provider</strong>
                          <span className="text-xs text-slate-600 block mt-0.5 font-medium">Google Authenticator / Any TOTP app</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Verify */}
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                          Verify Authenticator Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          disabled={submitting2FA}
                          value={setupOtp}
                          onChange={(e) => setSetupOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-teal focus:ring-1 focus:ring-teal text-slate-900 font-mono tracking-widest text-center text-lg font-bold rounded-xl outline-none"
                          placeholder="000000"
                        />
                        <p className="text-[10px] text-slate-450 mt-1.5 leading-relaxed text-center">
                          Input the 6-digit code currently shown on your mobile device to complete activation.
                        </p>
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSettingUp(false);
                            setQrCode(null);
                            setSecret(null);
                            setSetupOtp("");
                            setErrorMsg(null);
                          }}
                          disabled={submitting2FA}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all border-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifySetup}
                          disabled={submitting2FA || setupOtp.trim().length !== 6}
                          className="px-5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md shadow-teal/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
                        >
                          {submitting2FA ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify & Enable"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Disable Action Prompt */}
                {isDisabling && (
                  <div className="border border-red-100 rounded-2xl p-6 bg-red-50/20 space-y-4 animate-scale-up">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-red-500" />
                      <h4 className="text-sm font-bold text-red-800">Confirm Deactivation</h4>
                    </div>

                    <p className="text-xs text-red-650 leading-relaxed">
                      Disabling 2FA reduces your account security. Please provide your current authenticator code or one of your backup recovery codes to confirm.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-red-600 uppercase mb-2">
                          Authenticator Code or Recovery Code
                        </label>
                        <input
                          type="text"
                          disabled={submitting2FA}
                          value={disablingOtp}
                          onChange={(e) => setDisablingOtp(e.target.value)}
                          className="w-full px-4 py-2.5 bg-red-50/30 border border-red-100 focus:bg-white focus:border-red-400 focus:ring-1 focus:ring-red-400 text-slate-900 font-mono tracking-widest text-center text-lg font-bold rounded-xl outline-none"
                          placeholder="000000 or XXXX-XXXX"
                        />
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDisabling(false);
                            setDisablingOtp("");
                            setErrorMsg(null);
                          }}
                          disabled={submitting2FA}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all border-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDisable2FA}
                          disabled={submitting2FA || disablingOtp.trim() === ""}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md shadow-red-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
                        >
                          {submitting2FA ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Deactivating...
                            </>
                          ) : (
                            "Confirm Disable"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Default Static Actions */}
                {!isSettingUp && !isDisabling && (
                  <div className="pt-2">
                    {twoFactorEnabled ? (
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Your account is protected by Two-Factor Authentication. If you ever need to disable it, click below. You will be prompted to verify using your OTP app.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDisabling(true);
                            setErrorMsg(null);
                            setSuccessMsg(null);
                          }}
                          className="px-5 py-2.5 border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Disable 2FA
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Secure your administrator access using a 2FA mobile device authenticator app. We support Google Authenticator, Authy, Duo, and all other standard TOTP generators.
                        </p>
                        <button
                          type="button"
                          onClick={handleStartSetup}
                          disabled={submitting2FA}
                          className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md shadow-teal/10 hover:shadow-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 border-none"
                        >
                          {submitting2FA ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Initializing...
                            </>
                          ) : (
                            "Enable 2FA"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* Audit Logs Section */}
                <div className="border-t border-slate-100 pt-8 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal" />
                      Recent Security Activity
                    </h4>
                    {auditLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearLogs}
                        disabled={clearingLogs}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100/70 text-red-600 hover:text-red-700 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 border border-red-100/50"
                      >
                        {clearingLogs ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Clear History
                      </button>
                    )}
                  </div>

                  {/* Search and Filters */}
                  <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={logSearch}
                        onChange={(e) => setLogSearch(e.target.value)}
                        placeholder="Search logs by email, IP, or action..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal focus:ring-1 focus:ring-teal text-xs rounded-xl outline-none transition-all"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <select
                      value={logActionFilter}
                      onChange={(e) => {
                        setLogActionFilter(e.target.value);
                        loadAuditLogs(logSearch, e.target.value);
                      }}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer"
                    >
                      <option value="">All Actions</option>
                      <option value="Login Success">Login Success</option>
                      <option value="Login Failed">Login Failed</option>
                      <option value="Account Locked">Account Locked</option>
                      <option value="2FA Enabled">2FA Enabled</option>
                      <option value="2FA Disabled">2FA Disabled</option>
                      <option value="Password Changed">Password Changed</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal hover:bg-teal-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none shadow-sm transition-all"
                    >
                      Search
                    </button>
                    {(logSearch || logActionFilter) && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogSearch("");
                          setLogActionFilter("");
                          loadAuditLogs("", "");
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer border border-slate-200 transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </form>
                  
                  {logsLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-teal" />
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No recent security events recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs.map((log) => (
                        <div key={log._id} className="flex items-start justify-between text-xs p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-all">
                          <div className="space-y-1">
                            <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${
                              log.action.includes("Failed")
                                ? "bg-red-50 text-red-600 border-red-100"
                                : log.action.includes("Enabled") || log.action.includes("Success")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-teal-light text-teal border-teal/10"
                            }`}>
                              {log.action}
                            </span>
                            <div className="text-slate-500 font-medium pt-1">
                              IP Address: <span className="font-mono text-slate-700 font-bold">{log.ip}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Backup & Database Maintenance Section (Superadmin Only) */}
                {session?.user?.role === "superadmin" && (
                  <div className="border-t border-slate-100 pt-8 mt-8">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <Download className="w-4 h-4 text-teal" />
                      System Maintenance & Backups
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      As a Super Administrator, you can download a full backup snapshot of the database collections (including all contacts, speaker requests, and testimonials) in a structured JSON format.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadBackup}
                      disabled={backingUp}
                      className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-teal/10 hover:shadow-teal/20 transition-all border-none flex items-center gap-2 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Download Database Snapshot
                    </button>
                  </div>
                )}
                
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
