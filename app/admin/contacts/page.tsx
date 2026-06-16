"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Search,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Phone,
  Building,
} from "lucide-react";
import { useConfirm } from "@/lib/context/ConfirmContext";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  status: "pending" | "replied";
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function ContactsContent() {
  const { confirm, toast } = useConfirm();
  // 1. STATE FOR LISTING & PAGINATION
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // 2. STATE FOR DETAILS MODAL
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Load contacts
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          status: statusFilter,
          page: page.toString(),
          limit: "10",
        });
        const res = await fetch(`/api/admin/contacts?${query.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setContacts(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, statusFilter, page]);

  // Toggle status (Pending / Replied)
  async function handleToggleStatus(item: Contact) {
    const newStatus = item.status === "replied" ? "pending" : "replied";
    try {
      const res = await fetch(`/api/admin/contacts/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const result = await res.json();
        // Update local list
        setContacts((prev) =>
          prev.map((c) => (c._id === item._id ? { ...c, status: newStatus } : c))
        );
        // Update selected modal details if open
        if (selectedContact && selectedContact._id === item._id) {
          setSelectedContact(result.data);
        }
        toast(`Inquiry status updated to ${newStatus}!`, "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to update status", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while updating status", "error");
    }
  }

  // Delete submission
  async function handleDelete(id: string) {
    const isConfirmed = await confirm("Are you sure you want to delete this contact inquiry record?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(null);
        }
        toast("Contact inquiry deleted successfully!", "success");
      } else {
        const result = await res.json();
        toast(result.error || "Failed to delete record", "error");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred while deleting record", "error");
    }
  }

  // Export to CSV
  function handleCSVExport() {
    if (contacts.length === 0) return;
    
    // Headers
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Organization",
      "Subject",
      "Message",
      "Status",
      "Submitted Date"
    ];

    // Escape values and construct CSV rows
    const rows = contacts.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.email}"`,
      `"${item.phone}"`,
      `"${(item.organization || "").replace(/"/g, '""')}"`,
      `"${item.subject.replace(/"/g, '""')}"`,
      `"${item.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${item.status || "pending"}"`,
      `"${new Date(item.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Furute_Contact_Inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Filtering, Search & CSV Export bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-teal focus:ring-1 focus:ring-teal rounded-xl text-sm outline-none transition-all"
              placeholder="Search sender name, email, query..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 focus:border-teal focus:ring-1 focus:ring-teal text-xs font-bold text-slate-700 rounded-xl outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23647086%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat shadow-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <button
          onClick={handleCSVExport}
          disabled={contacts.length === 0}
          className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-50 text-sm font-bold text-gray-700 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_24px_rgba(16,27,53,0.015)]">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading contact submissions...</p>
        </div>
      ) : contacts.length > 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(16,27,53,0.015)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Sender Details</th>
                  <th className="px-6 py-4">Inquiry Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {contacts.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/40 transition-all">
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 truncate">{item.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-700 truncate max-w-xs">{item.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          item.status === "replied"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {item.status === "replied" ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Replied
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedContact(item)}
                          className="p-1.5 bg-gray-50 hover:bg-teal-light text-gray-600 hover:text-teal border border-gray-200 rounded-lg cursor-pointer"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`p-1.5 border rounded-lg cursor-pointer ${
                            item.status === "replied"
                              ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                              : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                          }`}
                          title={item.status === "replied" ? "Mark Pending" : "Mark Replied"}
                        >
                          {item.status === "replied" ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-650 border border-gray-200 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-semibold">No inquiries logged.</p>
          <p className="text-xs text-gray-500 mt-1">Inbox is empty.</p>
        </div>
      )}

      {/* Pagination controls */}
      {!loading && pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500">
            Showing page <span className="font-bold text-gray-700">{page}</span> of{" "}
            <span className="font-bold text-gray-700">{pagination.pages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW CONTACT DETAILS MODAL */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setSelectedContact(null)} />
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="font-extrabold text-gray-900">Inquiry Message</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-sans">
              {/* User Bio Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-light text-teal flex items-center justify-center font-bold border border-teal/20">
                  {selectedContact.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedContact.name}</h4>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-xs text-teal hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              {/* Bio Stats Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${selectedContact.phone}`} className="hover:underline text-gray-700">
                    {selectedContact.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="truncate text-gray-700">
                    {selectedContact.organization || "No Organization"}
                  </span>
                </div>
              </div>

              {/* Message Copy */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Subject: {selectedContact.subject}
                </p>
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* Footer status buttons */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    selectedContact.status === "replied"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {selectedContact.status || "pending"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedContact)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                      selectedContact.status === "replied"
                        ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                        : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {selectedContact.status === "replied" ? "Mark Pending" : "Mark Replied"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="px-3 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-xs font-bold text-red-650 rounded-xl cursor-pointer"
                  >
                    Delete record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div>Loading Contacts...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
