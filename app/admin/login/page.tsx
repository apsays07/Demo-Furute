"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { KeyRound, User, AlertCircle, Loader2, Check } from "lucide-react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ username: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  interface LoginFormData {
    username?: string;
    password?: string;
  }

  // Handle credentials submission via NextAuth signIn
  async function onSubmitCredentials(data: LoginFormData) {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error || "Login failed. Please check your credentials.");
      }

      // Fetch the authenticated session details
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.requires2FA && !session?.user?.is2FAVerified) {
        // Redirect to dedicated 2FA verification page
        router.push("/admin/verify-otp");
      } else {
        // Normal password-only login successful
        setLoggedInUser({ username: session?.user?.name || "Admin" });
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 2000);
      }
    } catch (err: unknown) {
      // Use console.warn to prevent Next.js development overlay from popping up for expected credential errors
      console.warn("Login client error:", err);
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#f3f8fc] via-white to-[#fffbfa] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic colorful blobs moving slowly in the background */}
      <div className="absolute top-1/4 left-1/4 w-[clamp(300px,30vw,500px)] h-[clamp(300px,30vw,500px)] bg-teal/6 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[clamp(300px,30vw,500px)] h-[clamp(300px,30vw,500px)] bg-mint/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none [animation-delay:3s]" />
      
      {/* Decorative top header bar on the login card too */}
      <div className="h-[3px] bg-gradient-to-r from-teal via-mint to-brand-red w-full absolute top-0 left-0 z-50 shadow-sm" />

      {/* Login Card with responsive bounds & hover shadow lifts */}
      <div className="w-full max-w-[clamp(380px,28vw,440px)] bg-white border border-slate-100 rounded-3xl p-[clamp(28px,3vw,44px)] shadow-[0_20px_50px_rgba(16,27,53,0.05)] hover:shadow-[0_30px_60px_rgba(16,27,53,0.08)] hover:-translate-y-1.5 transition-all duration-500 ease-out relative z-10">
        <div className="text-center mb-[clamp(20px,2.5vh,32px)]">
          {/* Logo container with micro hover scaling */}
          <div className="flex justify-center mb-5 transition-transform duration-300 hover:scale-105">
            <Image
              src="/lion-logo.png"
              alt="Furute Logo"
              width={138}
              height={58}
              priority
              className="object-contain"
            />
          </div>
          
          <span className="text-[10px] font-extrabold tracking-widest text-teal uppercase bg-teal-light px-3 py-1 rounded-full border border-teal/10 select-none">
            Administrative Gateway
          </span>
          <h1 className="text-[clamp(20px,1.5vw,25px)] font-extrabold text-slate-900 mt-4 tracking-tight select-none">
            Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 select-none">
            Authenticate to access the admin workspace.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs mb-6 flex items-start gap-3 animate-shake">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <strong className="font-bold">Access Denied:</strong>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-[clamp(10px,0.6vw,12px)] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <User className="w-4.5 h-4.5 text-teal group-focus-within:text-mint transition-colors" />
              </span>
              <input
                type="text"
                disabled={loading}
                className="w-full pl-11 pr-4 py-[clamp(10px,1.2vh,14px)] bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-teal focus:ring-1 focus:ring-teal text-slate-900 rounded-xl placeholder-slate-400 text-sm transition-all outline-none"
                placeholder="admin@furute.in"
                {...register("username", {
                  required: "Username or Email is required",
                })}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[clamp(10px,0.6vw,12px)] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <KeyRound className="w-4.5 h-4.5 text-teal group-focus-within:text-mint transition-colors" />
              </span>
              <input
                type="password"
                disabled={loading}
                className="w-full pl-11 pr-4 py-[clamp(10px,1.2vh,14px)] bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-teal focus:ring-1 focus:ring-teal text-slate-900 rounded-xl placeholder-•••••••• text-sm transition-all outline-none"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[clamp(12px,1.4vh,16px)] px-4 bg-teal hover:bg-teal-dark text-white font-extrabold rounded-xl shadow-md shadow-teal/10 hover:shadow-lg hover:shadow-teal/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider border-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Securing Session...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[10px] text-slate-400 select-none">
            For support or access requests, contact info@furute.in.
          </p>
        </div>
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
                Session established for <span className="font-semibold text-slate-800 capitalize">{loggedInUser ? loggedInUser.username : "Admin"}</span>. Initializing secure channel.
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
