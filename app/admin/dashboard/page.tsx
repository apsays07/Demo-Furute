"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { useConfirm } from "@/lib/context/ConfirmContext";
import {
  MessageSquare,
  Video,
  Calendar,
  Award,
  Mail,
  FileText,
  ArrowRight,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Trash2,
  History,
  LayoutGrid,
  ChevronDown,
  Mic,
  FileEdit,
  Star,
  Sparkles,
  Activity,
  Shield,
  TrendingUp,
} from "lucide-react";
import DashboardChart from "@/components/admin/DashboardChart";

interface DashboardActivity {
  id: string;
  type: "contact" | "speaker";
  title: string;
  subtitle: string;
  time: string;
  status: string;
}

interface AdminActivity {
  _id: string;
  adminName: string;
  adminRole: string;
  action: string;
  module: string;
  targetTitle: string;
  createdAt: string;
}

interface DashboardStats {
  counts: {
    testimonials: number;
    videos: number;
    events: number;
    programs: number;
    contacts: number;
    speakerRequests: number;
    pendingTestimonials?: number;
    pendingContacts?: number;
    pendingSpeakerRequests?: number;
    draftPrograms?: number;
  };
  recentActivity: DashboardActivity[];
  adminActivities?: AdminActivity[];
  chartData?: any[];
}

// Styling helpers for admin activity actions
const getActionStyle = (action: string) => {
  switch (action.toLowerCase()) {
    case "created":
    case "added":
      return {
        bg: "bg-teal-light text-teal border-teal/20",
        icon: "plus"
      };
    case "updated":
      return {
        bg: "bg-violet/10 text-violet border-violet/20",
        icon: "edit"
      };
    case "deleted":
      return {
        bg: "bg-brand-red-light text-brand-red border-brand-red/20",
        icon: "trash"
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-500 border-slate-100",
        icon: "history"
      };
  }
};

// Styling helpers for admin role badges
const getRoleBadgeStyle = (role: string) => {
  switch (role.toLowerCase()) {
    case "superadmin":
      return "bg-violet/10 text-violet border-violet/20";
    case "admin":
      return "bg-teal-light text-teal border-teal/20";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200/50";
  }
};

const formatRoleName = (role: string) => {
  if (role.toLowerCase() === "superadmin") return "Super Admin";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function AdminDashboard() {
  const { adminUser } = useAdminUser();
  const { confirm, toast } = useConfirm();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showTotals, setShowTotals] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleScrollToAnalytics = (e: React.MouseEvent) => {
    e.preventDefault();
    const chartElement = document.getElementById("analytics-chart");
    if (chartElement) {
      chartElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  async function handleClearHistory() {
    const isConfirmed = await confirm("Are you sure you want to clear the entire admin audit logs history? This action cannot be undone.");
    if (!isConfirmed) return;

    setClearing(true);
    try {
      const res = await fetch("/api/admin/stats", { method: "DELETE" });
      if (res.ok) {
        toast("Admin audit logs cleared successfully!", "success");
        setStats(prev => prev ? { ...prev, adminActivities: [] } : null);
      } else {
        const data = await res.json();
        toast(data.error || "Failed to clear logs history", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while clearing history", "error");
    } finally {
      setClearing(false);
    }
  }

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-sans">
        <div className="w-10 h-10 border-4 border-teal/10 border-t-teal rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-sm">Aggregating dashboard insights...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Testimonials",
      count: stats?.counts?.testimonials || 0,
      icon: MessageSquare,
      href: "/admin/testimonials",
    },
    {
      title: "Videos",
      count: stats?.counts?.videos || 0,
      icon: Video,
      href: "/admin/videos",
    },
    {
      title: "Events Scheduled",
      count: stats?.counts?.events || 0,
      icon: Calendar,
      href: "/admin/events",
    },
    {
      title: "Training Programs",
      count: stats?.counts?.programs || 0,
      icon: Award,
      href: "/admin/programs",
    },
    {
      title: "Contact Submissions",
      count: stats?.counts?.contacts || 0,
      icon: Mail,
      href: "/admin/contacts",
    },
    {
      title: "Speaker Invitations",
      count: stats?.counts?.speakerRequests || 0,
      icon: FileText,
      href: "/admin/speaker-requests",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Premium Dark Welcome Banner matching parent website dark card elements */}
      <div className="bg-gradient-to-br from-ink to-ink-light border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_10px_30px_rgba(16,27,53,0.03)] relative overflow-hidden text-white">
        {/* Colorful glowing background blobs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-mint/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal shadow-inner">
            <Sparkles className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {getGreeting()}, {adminUser?.username ? adminUser.username.charAt(0).toUpperCase() + adminUser.username.slice(1) : "Admin"}
            </h2>
            <p className="text-slate-300 mt-1 text-xs md:text-sm font-medium">
              Welcome back. Here is a consolidated summary of what requires your attention today.
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 relative z-10">
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer border border-white/10"
          >
            Manage Settings
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal/10 hover:shadow-teal/20 border-none"
          >
            Visit Website
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Personalized Row: Today's Overview (Grid of 4) & Quick Actions (Grid of 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Overview Card Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(16,27,53,0.015)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-4 h-4 text-teal" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Today's Overview</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mb-6">Action items and pending reviews waiting for your response</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact Requests */}
              <Link
                href="/admin/contacts?status=pending"
                className="group p-5 bg-white border border-slate-100 hover:border-teal/20 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-[0_8px_25px_rgba(8,127,140,0.02)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-light border border-teal/10 flex items-center justify-center text-teal shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">New Contact Requests</h4>
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <p className="text-2xl font-bold text-slate-800 leading-none">
                        {stats?.counts?.pendingContacts || 0}
                      </p>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-teal-light text-teal border border-teal/10 uppercase tracking-wider shrink-0 select-none">Review pending</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Speaker Invitations */}
              <Link
                href="/admin/speaker-requests?status=pending"
                className="group p-5 bg-white border border-slate-100 hover:border-amber-500/20 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-[0_8px_25px_rgba(245,158,11,0.02)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Speaker Invitations</h4>
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <p className="text-2xl font-bold text-slate-800 leading-none">
                        {stats?.counts?.pendingSpeakerRequests || 0}
                      </p>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200/30 uppercase tracking-wider shrink-0 select-none">Action needed</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Draft Blogs */}
              <Link
                href="/admin/programs"
                className="group p-5 bg-white border border-slate-100 hover:border-indigo-500/20 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-[0_8px_25px_rgba(99,102,241,0.02)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-500 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Draft Blogs</h4>
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <p className="text-2xl font-bold text-slate-800 leading-none">3</p>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200/30 uppercase tracking-wider shrink-0 select-none">Static Drafts</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* New Testimonials */}
              <Link
                href="/admin/testimonials"
                className="group p-5 bg-white border border-slate-100 hover:border-violet-500/20 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-[0_8px_25px_rgba(111,88,201,0.02)]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-violet-50/50 border border-violet-100/50 flex items-center justify-center text-violet shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">New Testimonials</h4>
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <p className="text-2xl font-bold text-slate-800 leading-none">
                        {stats?.counts?.pendingTestimonials || 0}
                      </p>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-violet-50 text-violet border border-violet-200/30 uppercase tracking-wider shrink-0 select-none">Awaiting Appr.</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Card Column (1/3 width on large screens) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(16,27,53,0.015)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Activity className="w-4 h-4 text-teal" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Quick Actions</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mb-6">Create new entries and navigate platform modules smoothly</p>
            
            <div className="flex flex-col gap-3">
              <Link
                href="/admin/programs?openAdd=true"
                className="p-3 bg-slate-50/50 hover:bg-teal-light border border-slate-100/70 hover:border-teal/20 rounded-2xl flex items-center justify-between transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-teal group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Plus className="w-4 h-4 text-teal" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">Add Program</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Create a training program</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/events?openAdd=true"
                className="p-3 bg-slate-50/50 hover:bg-teal-light border border-slate-100/70 hover:border-teal/20 rounded-2xl flex items-center justify-between transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-teal group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Plus className="w-4 h-4 text-teal" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">Add Event</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Schedule a calendar event</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/testimonials?openAdd=true"
                className="p-3 bg-slate-50/50 hover:bg-teal-light border border-slate-100/70 hover:border-teal/20 rounded-2xl flex items-center justify-between transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-teal group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Plus className="w-4 h-4 text-teal" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight">Add Testimonial</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Submit client testimonial</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible totals section replacing details tag */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(16,27,53,0.015)] transition-all duration-300">
        <button
          onClick={() => setShowTotals(!showTotals)}
          className="w-full flex items-center justify-between font-bold text-xs text-slate-500 uppercase tracking-widest cursor-pointer outline-none hover:text-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            <span>Platform Volume Summary</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal">
            <span>{showTotals ? "Hide Details" : "Show All Totals"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showTotals ? "rotate-180" : ""}`} />
          </div>
        </button>
        
        {showTotals && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-slate-50 animate-fade-in">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-slate-50/50 hover:bg-white border border-slate-100/60 hover:border-teal/20 rounded-2xl p-4 shadow-sm hover:shadow-[0_10px_25px_rgba(8,127,140,0.03)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-widest truncate group-hover:text-slate-500 transition-colors">
                      {card.title}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-3 leading-none">
                    {card.count}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {stats?.chartData && stats.chartData.length > 0 && (
        <div id="analytics-chart" className="animate-fade-in">
          <DashboardChart data={stats.chartData} />
        </div>
      )}



      {/* Bottom section: Two column layout on lg screen, one column on smaller screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Platform Activities */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(16,27,53,0.01)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Recent Platform Activities</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Latest enquiries and speaker requests</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flow-root">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="divide-y divide-slate-100/70">
                {stats.recentActivity.map((activity: DashboardActivity) => (
                  <div
                    key={activity.id}
                    className="group/item flex flex-col sm:flex-row sm:items-center justify-between py-5 first:pt-0 last:pb-0 gap-4 transition-all duration-300 hover:bg-slate-50/50 -mx-4 px-4 rounded-2xl"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Icon container with soft shadow and subtle scale on hover */}
                      <div
                        className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 bg-slate-50 border border-slate-100 text-slate-500 group-hover/item:scale-105 group-hover/item:bg-teal-light group-hover/item:text-teal group-hover/item:border-teal/20 shadow-sm shadow-slate-100/5"
                      >
                        {activity.type === "speaker" ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <Mail className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-bold text-slate-800 tracking-tight">
                            {activity.title}
                          </span>
                          <span
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100"
                          >
                            {activity.type === "speaker" ? "Speaker Invitation" : "Contact Enquiry"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {activity.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Status, Time & Quick Action Link */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-15 sm:pl-0">
                      <div className="flex items-center gap-3.5">
                        {/* Status indicator dot + label */}
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-100"
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-teal" />
                          {activity.status}
                        </span>

                        {/* Dynamic date/time */}
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-[10px] text-slate-400 font-bold">
                            {new Date(activity.time).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {new Date(activity.time).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Action link */}
                      <Link
                        href={activity.type === "speaker" ? "/admin/speaker-requests" : "/admin/contacts"}
                        className="h-8 w-8 rounded-xl bg-slate-50 group-hover/item:bg-white border border-slate-100 group-hover/item:border-slate-200 flex items-center justify-center text-slate-400 group-hover/item:text-teal transition-all shadow-sm group-hover/item:shadow-md cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/item:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-100 rounded-3xl bg-slate-50/20">
                <p className="text-xs font-bold text-slate-500">No recent submissions found.</p>
                <p className="text-[10px] text-slate-400 mt-1">Activities will log here once inquiries are submitted.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Admin Audit Logs */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(16,27,53,0.01)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Admin Audit Logs</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Recent actions performed in the admin panel</p>
            </div>
            <div className="flex items-center gap-3">
              {adminUser?.role === "superadmin" && (
                <>
                  <Link
                    href="/admin/users#deleted-history"
                    className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal hover:bg-teal-light border border-teal-200/50 rounded-lg transition-all flex items-center gap-1"
                    title="View deleted history"
                  >
                    <History className="w-3.5 h-3.5" />
                    Deleted History
                  </Link>
                  <button
                    onClick={handleClearHistory}
                    disabled={clearing}
                    className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50 rounded-lg transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    title="Clear all audit logs"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear Logs
                  </button>
                </>
              )}
              <History className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flow-root">
            {stats?.adminActivities && stats.adminActivities.length > 0 ? (
              <div className="divide-y divide-slate-100/70">
                {stats.adminActivities.map((activity: AdminActivity) => {
                  const style = getActionStyle(activity.action);
                  const ActionIcon = style.icon === "plus" ? Plus : style.icon === "edit" ? RefreshCw : style.icon === "trash" ? Trash2 : History;
                  return (
                    <div
                      key={activity._id}
                      className="group/item flex flex-col sm:flex-row sm:items-center justify-between py-5 first:pt-0 last:pb-0 gap-4 transition-all duration-300 hover:bg-slate-50/50 -mx-4 px-4 rounded-2xl"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Colored action icon container */}
                        <div
                          className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 border ${style.bg} group-hover/item:scale-105 shadow-sm shadow-slate-100/5`}
                        >
                          <ActionIcon className="w-5 h-5" />
                        </div>

                        {/* Log description */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Admin username */}
                            <span className="text-sm font-bold text-slate-800 tracking-tight">
                              {activity.adminName}
                            </span>
                            {/* Admin role badge */}
                            <span
                              className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getRoleBadgeStyle(activity.adminRole)}`}
                            >
                              {formatRoleName(activity.adminRole)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            <span className="font-semibold text-slate-500 capitalize">{activity.action}</span>{" "}
                            <span className="text-slate-400">{activity.module}:</span>{" "}
                            <span className="font-medium text-slate-700">{activity.targetTitle}</span>
                          </p>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-15 sm:pl-0">
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-[10px] text-slate-400 font-bold">
                            {new Date(activity.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {new Date(activity.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-100 rounded-3xl bg-slate-50/20">
                <p className="text-xs font-bold text-slate-500">No activity recorded yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Actions taken on videos, testimonials, events, programs, etc. will show up here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
