"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";

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
  };
  recentActivity: DashboardActivity[];
  adminActivities?: AdminActivity[];
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
      return "bg-slate-50 text-slate-650 border-slate-200/50";
  }
};

const formatRoleName = (role: string) => {
  if (role.toLowerCase() === "superadmin") return "Super Admin";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-white">
            Welcome back, Ashay Shah!
          </h2>
          <p className="text-slate-300 mt-1.5 text-xs md:text-sm">
            Here is a consolidated overview of what has been happening on the Furute platform.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 relative z-10">
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border border-white/10"
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

      {/* Grid statistics with responsive clamp font size and card hover lifts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(16,27,53,0.01)] hover:-translate-y-1 hover:border-teal/20 hover:shadow-[0_12px_30px_rgba(8,127,140,0.04)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between mt-1">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-1.5 leading-none">
                    {card.count}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl transition-all duration-300 bg-slate-50 border border-slate-100 text-slate-500 group-hover:scale-110 group-hover:bg-teal-light group-hover:text-teal group-hover:border-teal/20">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="border-t border-slate-50 mt-5 pt-4">
                <Link
                  href={card.href}
                  className="flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-teal transition-colors hover:opacity-85"
                >
                  Configure Module
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

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
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-50 text-slate-650 border border-slate-100"
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
            <History className="w-4 h-4 text-slate-400" />
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
                          <p className="text-xs text-slate-650 mt-1">
                            <span className="font-semibold text-slate-500 capitalize">{activity.action}</span>{" "}
                            <span className="text-slate-450">{activity.module}:</span>{" "}
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
