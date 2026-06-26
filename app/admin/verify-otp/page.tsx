"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { ShieldCheck, AlertCircle, Loader2, LogOut, Check } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // If session is already verified or 2FA not required, redirect to dashboard
  // Skip redirect when isSuccess is true — let the success popup show first
  useEffect(() => {
    if (isSuccess) return;

    if (status === "authenticated" && session?.user) {
      if (!session.user.requires2FA || session.user.is2FAVerified) {
        router.push("/admin/dashboard");
      }
    } else if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [session, status, router, isSuccess]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.trim() === "") {
      setErrorMsg("Verification code is required");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/auth/2fa/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Verification failed. Please try again.");
      }

      // Update NextAuth token state (triggers jwt update callback)
      await update({ is2FAVerified: true });
      
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    await signOut({ callbackUrl: "/admin/login" });
  }

  if (status === "loading" && !isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-tr from-[#f3f8fc] via-white to-[#fffbfa] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-teal mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            Verifying Authentication Context...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#f3f8fc] via-white to-[#fffbfa] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal/6 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-mint/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none [animation-delay:3s]" />
      
      <div className="h-[3px] bg-gradient-to-r from-teal via-mint to-brand-red w-full absolute top-0 left-0 z-50 shadow-sm" />

      {/* Verification Card */}
      <div className="w-full max-w-[420px] bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_20px_50px_rgba(16,27,53,0.05)] relative z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-5">
            <Image
              src="/lion-logo.png"
              alt="Furute Logo"
              width={138}
              height={58}
              priority
              className="object-contain"
            />
          </div>
          
          <span className="text-[10px] font-extrabold tracking-widest text-teal uppercase bg-teal-light px-3 py-1 rounded-full border border-teal/10">
            2FA Verification
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Security Challenge
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Enter the 6-digit verification code from your authenticator app (e.g. Google Authenticator) or one of your backup recovery codes to log in.
          </p>
        </div>

        {/* Profile Card */}
        {session?.user && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl p-3.5 mb-6 shadow-sm hover:border-teal/30 transition-all duration-300 group">
            {session.user.image ? (
              <div className="relative shrink-0">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={44}
                  height={44}
                  className="rounded-full object-cover border-2 border-teal-light shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal border-2 border-white rounded-full animate-pulse" />
              </div>
            ) : (
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal/20 to-teal/5 border border-teal/20 flex items-center justify-center text-teal font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {session.user.name
                    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                    : session.user.email
                    ? session.user.email.slice(0, 2).toUpperCase()
                    : "AD"}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal border-2 border-white rounded-full" />
              </div>
            )}
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-teal transition-colors duration-250">
                {session.user.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-500 truncate font-medium">
                {session.user.email}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px] font-extrabold text-teal bg-teal-light px-2.5 py-0.5 rounded-full border border-teal/15 uppercase tracking-wider">
                {session.user.role || "Admin"}
              </span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs mb-6 flex items-start gap-3">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <strong className="font-bold">Invalid Code:</strong>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Authenticator / Recovery Code
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <ShieldCheck className="w-4.5 h-4.5 text-teal" />
              </span>
              <input
                type="text"
                disabled={loading}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                  setOtp(val);
                  if (val.length === 6) {
                    // Auto-submit after 6 digits entered
                    setTimeout(() => {
                      const form = e.target.closest("form");
                      if (form) form.requestSubmit();
                    }, 150);
                  }
                }}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal focus:ring-1 focus:ring-teal text-slate-900 rounded-xl text-sm transition-all outline-none font-mono tracking-widest text-center text-lg font-bold"
                placeholder="123456"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.trim() === ""}
            className="w-full py-3 px-4 bg-teal hover:bg-teal-dark text-white font-extrabold rounded-xl shadow-md shadow-teal/10 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider border-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Confirm & Access"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 mt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cancel and Sign Out
          </button>
        </form>
      </div>

      {isSuccess && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-2xl p-10 max-w-sm w-full text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center space-y-6 animate-scale-up relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 rounded-t-2xl" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-1 relative">
              <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
              <Check className="w-8 h-8 relative z-10 stroke-[2.5] animate-check-pop" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Authentication Successful
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                Session established for <span className="font-semibold text-slate-800 capitalize">{session?.user?.name || "Admin"}</span>. Initializing secure channel.
              </p>
            </div>
            
            <div className="w-full space-y-3">
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 bottom-0 bg-emerald-500 rounded-full animate-progress-fill" />
              </div>
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>Redirecting to Console...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
