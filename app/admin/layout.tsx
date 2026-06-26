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
  Mail,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  UserCircle,
  Plus,
} from "lucide-react";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { AdminUser, AdminUserContext } from "@/lib/context/AdminUserContext";
import { ConfirmProvider, useConfirm } from "@/lib/context/ConfirmContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConfirmProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ConfirmProvider>
    </SessionProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [sidebarUserOpen, setSidebarUserOpen] = useState(false);
  const [headerUserOpen, setHeaderUserOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // NextAuth Session
  const { data: session, status, update } = useSession();
  const { confirm } = useConfirm();

  // Map NextAuth session user to the legacy custom AdminUserContext context
  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/verify-otp") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user) {
      // Fetch details from session
      setAdminUser({
        id: session.user.id,
        username: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role,
      });
    }
  }, [session, status, pathname, router]);

  // Client-side route protection based on role (carried over from previous layout)
  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/verify-otp") return;
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

  const fetchUser = useCallback(async () => {
    // In NextAuth, session refresh is triggered by update()
    await update();
  }, [update]);

  // If we are on the login page or verify-otp page, just render the child container directly
  if (pathname === "/admin/login" || pathname === "/admin/verify-otp") {
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

  // Profile and Settings are now accessed via the admin profile card dropdown menu

  async function handleLogout() {
    const isConfirmed = await confirm(
      session?.user?.requires2FA
        ? "Are you sure you want to log out? You will need to enter your credentials and OTP to log in again."
        : "Are you sure you want to log out?",
      {
        title: "Confirm Sign Out",
        confirmText: "Sign Out",
        cancelText: "Cancel",
      }
    );
    if (!isConfirmed) return;

    try {
      await signOut({ callbackUrl: "/admin/login" });
    } catch (err) {
      console.warn("Logout failed:", err);
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
            src="/lion-logo.png"
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
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 py-1.5 text-slate-700">
                <Link
                  href="/admin/testimonials?openAdd=true"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-xs hover:bg-slate-50 hover:text-teal font-medium transition-all"
                >
                  + Add Testimonial
                </Link>
                <Link
                  href="/admin/videos?openAdd=true"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-xs hover:bg-slate-50 hover:text-teal font-medium transition-all"
                >
                  + Add Video
                </Link>
                <Link
                  href="/admin/events?openAdd=true"
                  onClick={() => {
                    setSidebarOpen(false);
                    setQuickMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-xs hover:bg-slate-50 hover:text-teal font-medium transition-all"
                >
                  + Add Event
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin select-none">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isActive ? activeLinkStyle : inactiveLinkStyle
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-teal" : "text-slate-400 group-hover:text-slate-650"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer detailing the current active Administrator */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3 relative">
        {sidebarUserOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-35" 
              onClick={() => setSidebarUserOpen(false)} 
            />
            <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_-10px_30px_rgba(16,27,53,0.08)] py-2 z-40 animate-scale-up text-slate-700">
              <Link
                href="/admin/profile"
                onClick={() => setSidebarUserOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-slate-50 hover:text-teal font-bold transition-all"
              >
                <UserCircle className="w-4 h-4 text-slate-400" />
                My Profile
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setSidebarUserOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-slate-50 hover:text-teal font-bold transition-all"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Account Settings
              </Link>
              <div className="h-px bg-slate-100 my-1.5" />
              <button
                onClick={() => {
                  setSidebarUserOpen(false);
                  handleLogout();
                }}
                className="w-[calc(100%-16px)] mx-2 flex items-center gap-2.5 px-3 py-2 text-red-650 hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer border-none text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => setSidebarUserOpen(!sidebarUserOpen)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/50 transition-colors w-full text-left bg-transparent border-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 text-brand-red flex items-center justify-center border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden shrink-0">
            {adminUser?.photoUrl ? (
              <Image src={adminUser.photoUrl} alt="Profile" width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <User className="w-5 h-5 text-teal" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate select-none">
              {adminUser?.firstName
                ? `${adminUser.firstName} ${adminUser.lastName || ""}`
                : adminUser?.username ?? "Administrator"}
            </p>
            <p className="text-[10px] font-extrabold text-slate-455 uppercase tracking-widest truncate select-none mt-0.5">
              {adminUser ? (adminUser.role === "superadmin" ? "Super Admin" : adminUser.role) : ""}
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  const contextLoading = status === "loading" || (!adminUser && pathname !== "/admin/login");

  return (
    <AdminUserContext.Provider value={{ adminUser, loading: contextLoading, refreshUser: fetchUser }}>
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
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shrink-0 z-30 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
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
              <div className="relative">
                <button
                  onClick={() => setHeaderUserOpen(!headerUserOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 text-brand-red flex items-center justify-center border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden">
                    {adminUser?.photoUrl ? (
                      <Image src={adminUser.photoUrl} alt="Profile" width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline select-none">
                    {adminUser?.firstName
                      ? `${adminUser.firstName}${adminUser.lastName ? " " + adminUser.lastName : ""}`
                      : adminUser?.username ?? "Admin"}
                  </span>
                </button>

                {headerUserOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-35" 
                      onClick={() => setHeaderUserOpen(false)} 
                    />
                    <div className="absolute right-0 top-11 bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_rgba(16,27,53,0.08)] py-2 w-48 z-40 animate-scale-up text-slate-700">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {adminUser?.firstName ? `${adminUser.firstName} ${adminUser.lastName || ""}` : adminUser?.username ?? "Admin"}
                        </p>
                        <p className="text-[10px] text-slate-450 uppercase tracking-wider mt-0.5 truncate">
                          {adminUser?.role || "Administrator"}
                        </p>
                      </div>
                      <Link
                        href="/admin/profile"
                        onClick={() => setHeaderUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-slate-50 hover:text-teal font-bold transition-all mt-1"
                      >
                        <UserCircle className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        onClick={() => setHeaderUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-slate-50 hover:text-teal font-bold transition-all"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Account Settings
                      </Link>
                      <div className="h-px bg-slate-100 my-1.5" />
                      <button
                        onClick={() => {
                          setHeaderUserOpen(false);
                          handleLogout();
                        }}
                        className="w-[calc(100%-16px)] mx-2 flex items-center gap-2.5 px-3 py-2 text-red-650 hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer border-none text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
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
  );
}
