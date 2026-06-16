"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, ChevronRight } from "lucide-react";

// Google Identity Services (GSI) Type Declarations
interface GsiCredentialResponse {
  credential: string;
}

interface GsiRenderButtonOptions {
  theme?: string;
  size?: string;
  width?: string;
  shape?: string;
}

interface GsiId {
  initialize: (config: {
    client_id: string;
    callback: (response: GsiCredentialResponse) => void;
  }) => void;
  renderButton: (
    element: HTMLElement | null,
    options: GsiRenderButtonOptions
  ) => void;
  prompt: () => void;
}

interface GoogleGsi {
  accounts: {
    id: GsiId;
  };
}

// Window extension to recognize window.google safely without 'any' type casting
declare global {
  interface Window {
    google?: GoogleGsi;
  }
}

interface EmailLoginModalProps {
  onSuccess: (email: string) => void;
}

export default function EmailLoginModal({ onSuccess }: EmailLoginModalProps) {
  const [step, setStep] = useState<"choose" | "input">("choose");
  const [customEmail, setCustomEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const hasClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId) {
      // Load official Google Identity Services
      const initGsi = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: GsiCredentialResponse) => {
              try {
                const parts = response.credential.split(".");
                if (parts[1]) {
                  const payload = JSON.parse(atob(parts[1])) as { email?: string };
                  if (payload.email) {
                    const verifiedEmail = payload.email.toLowerCase();
                    localStorage.setItem("guest_verified_email", verifiedEmail);
                    onSuccess(verifiedEmail);
                  }
                }
              } catch (err) {
                console.error("GSI token decode failed:", err);
              }
            },
          });
          const btnElem = document.getElementById("official-google-btn");
          if (btnElem) {
            window.google.accounts.id.renderButton(
              btnElem,
              { theme: "outline", size: "large", width: "100%", shape: "rectangular" }
            );
          }
          window.google.accounts.id.prompt();
        }
      };

      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGsi;
        document.body.appendChild(script);
      } else {
        initGsi();
      }
    }
  }, [onSuccess]);

  const handleSelectSimulated = (email: string) => {
    localStorage.setItem("guest_verified_email", email);
    onSuccess(email);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customEmail.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }

    const verifiedEmail = customEmail.trim().toLowerCase();
    localStorage.setItem("guest_verified_email", verifiedEmail);
    onSuccess(verifiedEmail);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[5px] select-none font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-[8px] px-10 py-9 shadow-2xl max-w-[450px] w-full text-center relative overflow-hidden animate-slide-up">
        {/* Google Icon Logo */}
        <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.89h12.66c-.55 2.92-2.19 5.39-4.66 7.05l7.21 5.58c4.22-3.89 6.79-9.61 6.79-16.83z"/>
          <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
          <path fill="#34A853" d="M24 38.5c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c6.48 0 11.93-2.13 15.89-5.81l-7.21-5.58c-2.11 1.41-4.8 2.39-7.68 2.39z"/>
        </svg>

        {step === "choose" ? (
          <>
            <h3 className="text-2xl font-normal text-slate-800 tracking-tight leading-none font-sans">
              Choose an account
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-sans font-normal">
              to continue to <span className="font-semibold text-slate-700">Furute</span>
            </p>

            {/* List of Simulated Google Accounts */}
            <div className="mt-8 border border-slate-200/80 rounded-md overflow-hidden text-left divide-y divide-slate-100 bg-white">
              {/* Account 1 */}
              <button
                onClick={() => handleSelectSimulated("ashayshah@gmail.com")}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-all border-none outline-none cursor-pointer bg-white text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Ashay Shah</p>
                    <p className="text-[10px] text-slate-500 font-semibold">ashayshah@gmail.com</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Account 2 */}
              <button
                onClick={() => handleSelectSimulated("guest.user@gmail.com")}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-all border-none outline-none cursor-pointer bg-white text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm">
                    G
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Guest User</p>
                    <p className="text-[10px] text-slate-500 font-semibold">guest.user@gmail.com</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Add Account Option */}
              <button
                onClick={() => setStep("input")}
                className="w-full flex items-center gap-3.5 p-3.5 hover:bg-slate-50 transition-all border-none outline-none cursor-pointer bg-white text-left"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-650 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Use another account</span>
              </button>
            </div>

            {/* Render official Google Sign-In button if client ID is configured */}
            {hasClientId && (
              <div className="mt-6">
                <div className="relative flex py-2.5 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">Or login officially</span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>
                <div id="official-google-btn" className="mt-3.5 w-full flex justify-center" />
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-2xl font-normal text-slate-800 tracking-tight leading-none font-sans">
              Sign in
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-sans font-normal">
              with your Google Account
            </p>

            <form onSubmit={handleCustomSubmit} className="mt-8 text-left space-y-4">
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Email or phone"
                    value={customEmail}
                    onChange={(e) => {
                      setCustomEmail(e.target.value);
                      setEmailError(null);
                    }}
                    className={`w-full px-3.5 py-3 border rounded-[4px] text-sm font-normal text-slate-800 outline-none transition-all ${
                      emailError
                        ? "border-rose-500 focus:border-rose-600"
                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("choose");
                    setEmailError(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-750 transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Back to accounts
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[4px] text-xs transition-colors shadow-sm cursor-pointer border-none"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {/* Footer disclosure */}
        <p className="text-[10px] text-slate-400 font-normal mt-10 leading-relaxed text-left">
          To continue, Google will share your name, email address, language preference, and profile picture with <span className="font-semibold text-slate-500">Furute</span>. Before using this app, you can review its privacy policy and terms of service.
        </p>
      </div>
    </div>
  );
}
