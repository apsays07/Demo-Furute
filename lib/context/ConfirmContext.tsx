"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { AlertCircle, HelpCircle, CheckCircle2, Info, X } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

interface AlertOptions {
  title?: string;
  okText?: string;
}

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
}

interface ConfirmContextProps {
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
  alert: (message: string, options?: AlertOptions) => Promise<void>;
  toast: (message: string, type?: ToastType) => void;
}

const ConfirmContext = createContext<ConfirmContextProps | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Are you sure?");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"alert" | "confirm">("confirm");
  const [confirmText, setConfirmText] = useState("Confirm");
  const [cancelText, setCancelText] = useState("Cancel");
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  // Toast State
  const [toastState, setToastState] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const confirm = (message: string, options?: ConfirmOptions) => {
    setModalMessage(message);
    setModalTitle(options?.title || "Are you sure?");
    setConfirmText(options?.confirmText || "Delete");
    setCancelText(options?.cancelText || "Cancel");
    setModalType("confirm");
    setModalOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const alert = (message: string, options?: AlertOptions) => {
    setModalMessage(message);
    setModalTitle(options?.title || "Notice");
    setConfirmText(options?.okText || "OK");
    setModalType("alert");
    setModalOpen(true);
    return new Promise<void>((resolve) => {
      resolveRef.current = () => {
        resolve();
      };
    });
  };

  const toast = (message: string, type: ToastType = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastState({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastState(null);
    }, 3500);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    if (resolveRef.current) {
      resolveRef.current(true);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
    }
  };

  const closeToast = () => {
    setToastState(null);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, alert, toast }}>
      {children}

      {/* Global Confirm/Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[4px] animate-fade-in select-none">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl max-w-md w-full relative overflow-hidden animate-slide-up font-sans">
            {/* Top decorative color stripe */}
            <div className={`h-[4px] w-full absolute top-0 left-0 ${modalType === "confirm" ? "bg-brand-red" : "bg-teal"}`} />
            
            <div className="flex items-start gap-4 mt-2">
              <div className={`p-3 rounded-2xl shrink-0 ${modalType === "confirm" ? "bg-brand-red-light text-brand-red" : "bg-teal-light text-teal"}`}>
                {modalType === "confirm" ? (
                  <HelpCircle className="w-6 h-6 animate-pulse" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>
              
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-base font-extrabold text-slate-800 tracking-tight leading-none pt-1">
                  {modalTitle}
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2 whitespace-pre-line">
                  {modalMessage}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              {modalType === "confirm" && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-xl text-xs transition-all border border-slate-100 cursor-pointer"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer border-none ${
                  modalType === "confirm"
                    ? "bg-brand-red hover:bg-brand-red-dark shadow-brand-red/10"
                    : "bg-teal hover:bg-teal-dark shadow-teal/10"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toastState && (
        <div className="fixed top-6 right-6 z-[110] animate-slide-in-right select-none font-sans">
          <div className={`bg-white border rounded-2xl p-4 shadow-xl flex items-center gap-3.5 max-w-sm min-w-[280px] relative overflow-hidden transition-all duration-300 ${
            toastState.type === "success"
              ? "border-emerald-100 shadow-emerald-500/5"
              : toastState.type === "error"
              ? "border-rose-100 shadow-rose-500/5"
              : "border-blue-100 shadow-blue-500/5"
          }`}>
            {/* Left status vertical strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${
              toastState.type === "success"
                ? "bg-emerald-500"
                : toastState.type === "error"
                ? "bg-rose-500"
                : "bg-blue-500"
            }`} />

            <div className={`p-1.5 rounded-lg shrink-0 ${
              toastState.type === "success"
                ? "bg-emerald-550/10 text-emerald-600"
                : toastState.type === "error"
                ? "bg-rose-55/10 text-rose-600"
                : "bg-blue-50 text-blue-600"
            }`}>
              {toastState.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : toastState.type === "error" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-800 leading-snug">
                {toastState.message}
              </p>
            </div>

            <button
              onClick={closeToast}
              className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
