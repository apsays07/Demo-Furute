"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminUser } from "@/lib/context/AdminUserContext";
import { Loader2, Trash2, Key, UserPlus, X, User, Mail, Lock, Crown, ShieldCheck, PenTool, History, RefreshCw } from "lucide-react";
import { useConfirm } from "@/lib/context/ConfirmContext";

interface UserItem {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersManagementPage() {
  const { adminUser } = useAdminUser();
  const { confirm, alert, toast } = useConfirm();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  interface DeletedLog {
    _id: string;
    adminName: string;
    adminRole: string;
    module: string;
    targetTitle: string;
    createdAt: string;
  }

  const [deletedLogs, setDeletedLogs] = useState<DeletedLog[]>([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({ username: "", email: "", password: "", role: "admin" });
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [actionSaving, setActionSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load all users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const result = await res.json();
      if (res.ok) {
        setUsers(result.data);
      } else {
        setError(result.error || "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while loading users");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDeletedHistory = useCallback(async () => {
    setLoadingDeleted(true);
    try {
      const res = await fetch("/api/admin/deleted-history");
      const result = await res.json();
      if (res.ok) {
        setDeletedLogs(result.data);
      }
    } catch (err) {
      console.error("Failed to load deleted history:", err);
    } finally {
      setLoadingDeleted(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
      loadDeletedHistory();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadUsers, loadDeletedHistory]);

  // Handle create user
  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setActionSaving(true);
    setActionError(null);
    setSuccessMsg(null);

    if (addForm.password.length < 8) {
      setActionError("Password must be at least 8 characters long.");
      setActionSaving(false);
      return;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(addForm.password)) {
      setActionError("Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&).");
      setActionSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("User created successfully!");
        toast("User created successfully!", "success");
        setAddForm({ username: "", email: "", password: "", role: "admin" });
        setIsAddModalOpen(false);
        loadUsers();
      } else {
        setActionError(result.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      setActionError("An error occurred while creating user");
    } finally {
      setActionSaving(false);
    }
  }

  // Handle change role
  async function handleChangeRole(user: UserItem, newRole: string) {
    if (user._id === adminUser?.id) {
      await alert("You cannot change your own role!");
      return;
    }
    const isConfirmed = await confirm(`Are you sure you want to change ${user.username}'s role to ${newRole}?`);
    if (!isConfirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await res.json();
      if (res.ok) {
        toast("Role updated successfully!", "success");
        loadUsers();
      } else {
        await alert(result.error || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      await alert("An error occurred while updating role");
    }
  }

  // Handle reset password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setActionSaving(true);
    setActionError(null);
    setSuccessMsg(null);

    if (resetPasswordVal.length < 8) {
      setActionError("Password must be at least 8 characters long.");
      setActionSaving(false);
      return;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(resetPasswordVal)) {
      setActionError("Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&).");
      setActionSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPasswordVal }),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccessMsg(`Password for ${selectedUser.username} reset successfully!`);
        toast(`Password for ${selectedUser.username} reset successfully!`, "success");
        setResetPasswordVal("");
        setIsResetModalOpen(false);
        setSelectedUser(null);
      } else {
        setActionError(result.error || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setActionError("An error occurred while resetting password");
    } finally {
      setActionSaving(false);
    }
  }

  async function handleDeleteUser(user: UserItem) {
    if (user._id === adminUser?.id) {
      await alert("You cannot delete yourself!");
      return;
    }

    const isConfirmed = await confirm(`Are you sure you want to permanently delete user "${user.username}"?`);
    if (!isConfirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        toast("User deleted successfully!", "success");
        loadUsers();
        loadDeletedHistory();
      } else {
        await alert(result.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      await alert("An error occurred while deleting user");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(16,27,53,0.015)]">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Administrators & Editors</h2>
          <p className="text-xs text-slate-400 mt-1">Manage user credentials, roles, and platform permissions.</p>
        </div>
        <button
          onClick={() => {
            setActionError(null);
            setSuccessMsg(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal/10 border-none"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-semibold rounded-2xl">
          {successMsg}
        </div>
      )}

      {/* Main Listing Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(16,27,53,0.01)]">
          <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
          <p className="text-gray-400 text-sm font-semibold">Loading user registry...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-white border border-red-100 rounded-3xl text-center shadow-sm">
          <p className="text-red-500 font-semibold">{error}</p>
          <button onClick={loadUsers} className="mt-4 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 text-xs font-bold border-none cursor-pointer">
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(16,27,53,0.015)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/45 transition-all">
                    <td className="px-6 py-4 font-bold text-slate-900 truncate">
                      {user.username}
                      {user._id === adminUser?.id && (
                        <span className="ml-2 text-[9px] font-bold bg-teal/10 text-teal px-2 py-0.5 rounded-full border border-teal/10">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      {user._id === adminUser?.id ? (
                        <span className="inline-flex items-center bg-purple-50 text-purple-700 border border-purple-200/50 rounded-lg px-2.5 py-1 text-xs font-extrabold select-none">
                          Super Admin
                        </span>
                      ) : (
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            disabled={user._id === adminUser?.id}
                            onChange={(e) => handleChangeRole(user, e.target.value)}
                            className={`appearance-none border rounded-lg pl-3 pr-8 py-1.5 text-xs font-extrabold outline-none transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65em_auto] bg-[position:right_10px_center] bg-no-repeat ${
                              user.role === "superadmin"
                                ? "bg-purple-50 text-purple-700 border-purple-200/50 hover:bg-purple-100/50 focus:border-purple-300"
                                : user.role === "admin"
                                ? "bg-teal-light text-teal-dark border-teal/10 hover:bg-teal-light/70 focus:border-teal/30"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/75 focus:border-slate-300"
                            }`}
                          >
                            <option value="superadmin" className="text-slate-900 bg-white font-semibold">Super Admin</option>
                            <option value="admin" className="text-slate-900 bg-white font-semibold">Admin</option>
                            <option value="editor" className="text-slate-900 bg-white font-semibold">Editor</option>
                          </select>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setActionError(null);
                            setSuccessMsg(null);
                            setIsResetModalOpen(true);
                          }}
                          title="Reset Password"
                          className="p-2 bg-slate-50 hover:bg-teal/10 hover:text-teal text-slate-400 rounded-xl transition-all cursor-pointer border border-slate-100"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={user._id === adminUser?.id}
                          title="Delete User"
                          className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-650 text-slate-400 rounded-xl transition-all cursor-pointer border border-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
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
      )}

      {/* CREATE ACCOUNT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-slideUp">
            <div className="absolute top-5 right-5 z-10">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-655 border-none cursor-pointer bg-transparent transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4 font-sans">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Create Admin/Editor Account</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Fill in credentials and assign the appropriate platform role.</p>
              </div>

              {actionError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold rounded-xl">
                  {actionError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                    placeholder="e.g. johndoe"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 focus:border-teal focus:bg-white rounded-xl text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="e.g. john@furute.in"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 focus:border-teal focus:bg-white rounded-xl text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Min 8 chars, strong password"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 focus:border-teal focus:bg-white rounded-xl text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Account Role</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      value: "superadmin",
                      label: "Super Admin",
                      description: "Full access & admin management controls.",
                      icon: Crown,
                      color: "border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/5",
                      activeColor: "border-purple-500 bg-purple-50/10 text-purple-700 ring-2 ring-purple-500/10"
                    },
                    {
                      value: "admin",
                      label: "Admin",
                      description: "Manage all site content & view inquiries.",
                      icon: ShieldCheck,
                      color: "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/5",
                      activeColor: "border-teal-500 bg-teal-50/10 text-teal-750 ring-2 ring-teal-500/10"
                    },
                    {
                      value: "editor",
                      label: "Editor",
                      description: "Add & edit content pages. Cannot delete.",
                      icon: PenTool,
                      color: "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/5",
                      activeColor: "border-blue-500 bg-blue-50/10 text-blue-750 ring-2 ring-blue-500/10"
                    }
                  ].map((roleOpt) => {
                    const Icon = roleOpt.icon;
                    const isActive = addForm.role === roleOpt.value;
                    return (
                      <div
                        key={roleOpt.value}
                        onClick={() => setAddForm({ ...addForm, role: roleOpt.value })}
                        className={`flex items-start gap-3 p-3 border rounded-2xl cursor-pointer transition-all duration-205 select-none ${
                          isActive ? roleOpt.activeColor : roleOpt.color
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 transition-all ${
                          isActive ? "bg-white shadow-sm" : "bg-slate-50"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-none">{roleOpt.label}</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal">{roleOpt.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionSaving}
                  className="w-full py-2.5 bg-teal hover:bg-teal-dark disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-teal/10"
                >
                  {actionSaving ? "Saving..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  setIsResetModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Reset Password for <span className="text-teal font-black">{selectedUser.username}</span>
              </h3>

              {actionError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold rounded-xl">
                  {actionError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">New Password</label>
                <input
                  type="password"
                  required
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  placeholder="Min 8 chars, strong password"
                  className="w-full px-4 py-2 border border-slate-200 focus:border-teal rounded-xl text-sm outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={actionSaving}
                className="w-full py-2.5 bg-teal hover:bg-teal-dark disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-teal/10"
              >
                {actionSaving ? "Resetting..." : "Save Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deleted History Log Section */}
      <div id="deleted-history" className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(16,27,53,0.015)] space-y-6 mt-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-teal" />
              Deleted History Log
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Audit log of all deleted items (super admin view)</p>
          </div>
          <button
            onClick={loadDeletedHistory}
            disabled={loadingDeleted}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-655 cursor-pointer border-none bg-transparent transition-all disabled:opacity-50"
            title="Refresh Log"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDeleted ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loadingDeleted && deletedLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-teal animate-spin mb-2" />
              <p className="text-slate-450 text-xs font-semibold">Loading history...</p>
            </div>
          ) : deletedLogs && deletedLogs.length > 0 ? (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Admin User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">Deleted Item</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {deletedLogs.map((log: DeletedLog) => (
                  <tr key={log._id} className="hover:bg-slate-50/45 transition-all">
                    <td className="px-6 py-3.5 font-bold text-slate-800">{log.adminName}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                        log.adminRole.toLowerCase() === 'superadmin' ? 'bg-purple-50/10 text-purple-750 border-purple-200/50' : 'bg-teal-light text-teal border-teal/20'
                      }`}>
                        {log.adminRole.toLowerCase() === 'superadmin' ? 'Super Admin' : log.adminRole}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-550 font-semibold capitalize">{log.module}</td>
                    <td className="px-6 py-3.5 text-red-600 font-bold">{log.targetTitle}</td>
                    <td className="px-6 py-3.5 text-slate-400 font-medium">
                      {new Date(log.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                      {" · "}
                      {new Date(log.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-100 rounded-3xl bg-slate-50/20">
              <p className="text-xs font-bold text-slate-500">No deleted items found.</p>
              <p className="text-[10px] text-slate-400 mt-1">Audit logs of deleted testimonials, events, programs, etc. will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
