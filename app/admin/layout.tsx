"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Video,
  Calendar,
  Award,
  Image as ImageIcon,
  Mail,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Plus,
} from "lucide-react";

import { AdminUser, AdminUserContext } from "@/lib/context/AdminUserContext";
import { ConfirmProvider } from "@/lib/context/ConfirmContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch admin user data on mount
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Failed to load user info:", err);
    }
  }, [router]);

  useEffect(() => {
    // Only verify if we are not on the login page
    if (pathname !== "/admin/login") {
      const timer = setTimeout(() => {
        fetchUser();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, fetchUser]);

  // Client-side route protection based on role
  useEffect(() => {
    if (!adminUser) return;

    const role = adminUser.role;
    if (role === "editor") {
      const isAllowed = [
        "/admin/dashboard",
        "/admin/testimonials",
        "/admin/videos",
        "/admin/events",
        "/admin/programs",
        "/admin/gallery",
        "/admin/settings"
      ].some(allowedPath => pathname === allowedPath || pathname.startsWith(allowedPath + "/"));

      if (!isAllowed && pathname !== "/admin/login") {
        router.push("/admin/dashboard");
      }
    } else if (role === "admin") {
      if (pathname.startsWith("/admin/users")) {
        router.push("/admin/dashboard");
      }
    }
  }, [pathname, adminUser, router]);

  // If we are on the login page, just render the child login container
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Dynamic Navigation Links based on role
  const baseLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Videos", href: "/admin/videos", icon: Video },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Programs", href: "/admin/programs", icon: Award },
  ];

  const navLinks = [...baseLinks];

  if (adminUser?.role === "admin" || adminUser?.role === "superadmin") {
    navLinks.push(
      { name: "Contacts", href: "/admin/contacts", icon: Mail },
      { name: "Speaker Requests", href: "/admin/speaker-requests", icon: FileText }
    );
  }

  if (adminUser?.role === "superadmin") {
    navLinks.push(
      { name: "Manage Admins", href: "/admin/users", icon: User }
    );
  }

  navLinks.push({ name: "Settings", href: "/admin/settings", icon: Settings });

  async function handleLogout() {
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  // A premium light sidebar matching Vercel/Stripe aesthetics
  const activeLinkStyle = "bg-teal-light text-teal border-l-4 border-l-teal font-semibold shadow-sm";
  const inactiveLinkStyle = "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-4 border-l-transparent transition-all duration-200";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-700 select-none">
      {/* Brand Logo Card nested inside the light sidebar */}
      <div className="pt-8 pb-5 flex items-center justify-center px-5 border-b border-slate-100 bg-white">
        <Link href="/" className="transition-all hover:scale-[1.02] flex items-center justify-center w-full">
          <Image
            src="/furute-logo.webp"
            alt="Furute Logo"
            width={138}
            height={68}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Collapsible Quick Actions Dropdown */}
      <div className="px-4 pt-5 pb-1 bg-white relative">
        <div className="relative">
          <button
            onClick={() => setQuickMenuOpen(!quickMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-teal hover:bg-teal-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-teal/10 cursor-pointer border-none"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              Quick Actions
            </span>
            <span className="text-[9px] opacity-70">{quickMenuOpen ? "▲" : "▼"}</span>
          </button>
          
          {quickMenuOpen && (
            <>
              {/* Overlay backdrop */}
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setQuickMenuOpen(false)} 
              />
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-150 rounded-xl shadow-2xl z-30 py-1.5 text-slate-750">
                <Link
                  href="/admin/testimonials?openAdd=true"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  Add Testimonial
                </Link>
                <Link
                  href="/admin/events?openAdd=true"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  Schedule Event
                </Link>
                <Link
                  href="/admin/gallery"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  Upload Gallery
                </Link>
                <Link
                  href="/admin/contacts"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Mail className="w-3 h-3 text-slate-400" />
                  View Submissions
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto bg-white scrollbar-thin">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-r-xl text-sm font-semibold tracking-wide ${
                isActive ? activeLinkStyle : inactiveLinkStyle
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-colors ${
                isActive ? "text-teal" : "text-slate-400 group-hover:text-slate-600"
              }`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-2xl mb-3 shadow-sm">
          <div className="w-8.5 h-8.5 rounded-full bg-teal text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-teal/10">
            {adminUser ? adminUser.username.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {adminUser ? adminUser.username : "Administrator"}
            </p>
            <p className="text-[10px] text-teal font-bold truncate capitalize">
              {adminUser ? (adminUser.role === "superadmin" ? "Super Admin" : adminUser.role) : ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100/70 text-red-650 hover:text-red-700 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer border border-red-100/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <ConfirmProvider>
      <AdminUserContext.Provider value={{ adminUser, loading: !adminUser, refreshUser: fetchUser }}>
        <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 font-sans relative pt-[3px]">
        {/* Premium top brand bar running across the viewport */}
        <div className="h-[3px] bg-gradient-to-r from-teal via-mint to-brand-red w-full absolute top-0 left-0 z-50 shadow-sm" />

        {/* Sidebar for Desktop with bulletproof width to avoid flex-shrink issues */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-150 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.01)] relative z-20">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer Sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-45 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-150 z-50 transform transition-transform duration-300 md:hidden flex flex-col shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {sidebarContent}
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Navbar matching website header shadow/border */}
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shrink-0 z-10 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl md:hidden cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-extrabold text-slate-800 capitalize tracking-tight select-none">
                {pathname.split("/").pop()?.replace("-", " ")}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-brand-red flex items-center justify-center border border-slate-100 shadow-sm shadow-slate-100">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline select-none">
                  {adminUser ? adminUser.username : "Admin"}
                </span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc] scrollbar-thin">
            {children}
          </main>
        </div>
      </div>
      </AdminUserContext.Provider>
    </ConfirmProvider>
  );
}
