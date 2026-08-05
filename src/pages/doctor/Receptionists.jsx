// src/pages/doctor/Receptionists.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Key,
  X,
  Users,
  UserCheck,
  UserX,
  User,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import receptionistService from "../../services/receptionistService";

export default function Receptionists() {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Feedback & Toast
  const [toast, setToast] = useState(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Add/Edit Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("active");
  const [formErrors, setFormErrors] = useState({});

  // Reset Password Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetErrors, setResetErrors] = useState({});

  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    const data = receptionistService.getReceptionists();
    setList(data);
  };

  const triggerToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Extract Initials
  const getInitials = (name) => {
    if (!name) return "RC";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Statistics
  const totalReceptionists = list.length;
  const activeReceptionists = list.filter(r => r.status === "active").length;
  const inactiveReceptionists = list.filter(r => r.status === "inactive" || r.status === "blocked").length;
  const lastAddedReceptionist = list.length > 0 ? list[0].fullName : "None";

  // Filtering & Sorting
  const filteredList = list.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.fullName.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.phone && item.phone.includes(q));

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    if (sortBy === "oldest") return a.id.localeCompare(b.id);
    if (sortBy === "login") return (b.lastLogin || "").localeCompare(a.lastLogin || "");
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedList.length / itemsPerPage) || 1;
  const paginatedList = sortedList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Handlers ---
  const openAddModal = () => {
    setFullName("");
    setEmail("");
    setMobile("");
    setPassword("");
    setConfirmPassword("");
    setStatus("active");
    setFormErrors({});
    setIsAddOpen(true);
  };

  const openEditModal = (target) => {
    setEditTarget(target);
    setFullName(target.fullName || "");
    setEmail(target.email || "");
    setMobile(target.phone || "");
    setStatus(target.status || "active");
    setFormErrors({});
  };

  const openResetPasswordModal = (target) => {
    setResetPasswordTarget(target);
    setNewPassword("");
    setConfirmNewPassword("");
    setResetErrors({});
  };

  const handleCreateReceptionist = (e) => {
    e.preventDefault();
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full Name is required";
    if (!email.trim()) errors.email = "Email Address is required";
    if (!mobile.trim()) errors.mobile = "Mobile Number is required";
    if (!password) errors.password = "Password is required";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const res = receptionistService.addReceptionist({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: mobile.trim(),
      password,
      status
    });

    if (res.success) {
      loadList();
      setIsAddOpen(false);
      triggerToast("Receptionist account created successfully!", "success");
    } else {
      triggerToast(res.message || "Failed to create receptionist", "error");
    }
  };

  const handleUpdateReceptionist = (e) => {
    e.preventDefault();
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full Name is required";
    if (!email.trim()) errors.email = "Email Address is required";
    if (!mobile.trim()) errors.mobile = "Mobile Number is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const res = receptionistService.updateReceptionist(editTarget.id, {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: mobile.trim(),
      status
    });

    if (res.success) {
      loadList();
      setEditTarget(null);
      triggerToast("Receptionist details updated!", "success");
    } else {
      triggerToast(res.message || "Failed to update receptionist", "error");
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newPassword) errors.newPassword = "New Password is required";
    if (newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmNewPassword) errors.confirmNewPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setResetErrors(errors);
      return;
    }

    const res = receptionistService.updateReceptionist(resetPasswordTarget.id, {
      password: newPassword
    });

    if (res.success) {
      setResetPasswordTarget(null);
      triggerToast("Receptionist password reset successfully!", "success");
    } else {
      triggerToast(res.message || "Failed to reset password", "error");
    }
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$";
    let gen = "";
    for (let i = 0; i < 8; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(gen);
    setConfirmNewPassword(gen);
  };

  const handleToggleStatus = (id) => {
    const res = receptionistService.toggleReceptionistStatus(id);
    if (res.success) {
      loadList();
      triggerToast("Receptionist status updated", "success");
    }
  };

  const handleDeleteReceptionist = (id) => {
    const res = receptionistService.removeReceptionist(id);
    if (res.success) {
      loadList();
      setConfirmDeleteId(null);
      triggerToast("Receptionist account deleted", "success");
    }
  };

  return (
    <div className="select-none min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 relative">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl border shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-extrabold">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY HEADER & BREADCRUMB (Req 2, 3, 15) */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
              <span>Doctor Home</span>
              <span>/</span>
              <span className="text-[#0E2A6D] font-extrabold">Receptionists</span>
            </div>

            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Receptionists
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Manage receptionist accounts, permissions, and login access.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer active:scale-98 transition-all duration-200 outline-none self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Receptionist</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6 space-y-6">
        
        {/* SUMMARY STATISTICS CARDS (Req 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Receptionists</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalReceptionists}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0E2A6D] flex items-center justify-center border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Receptionists</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{activeReceptionists}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Inactive Receptionists</p>
              <h3 className="text-2xl font-black text-slate-600 mt-1">{inactiveReceptionists}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
              <UserX className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Last Added</p>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1 truncate max-w-[140px]" title={lastAddedReceptionist}>
                {lastAddedReceptionist}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* SEARCH & FILTERS TOOLBAR (Req 5) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Name, Email, or Mobile..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
            />
          </div>

          {/* Status & Sort Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" }
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => { setStatusFilter(st.id); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === st.id ? "bg-white text-[#0E2A6D] shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-800 outline-none focus:border-[#0E2A6D]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="login">Last Login</option>
              </select>
            </div>

          </div>
        </div>

        {/* DATA TABLE / EMPTY STATE (Reqs 6, 7, 8, 9, 13, 14) */}
        {sortedList.length === 0 ? (
          /* EMPTY STATE (Req 9) */
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
              👥
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No Receptionists Found</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              Click "Add Receptionist" to create your first receptionist account.
            </p>
            <button
              onClick={openAddModal}
              className="mt-2 px-5 h-9.5 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs hover:bg-[#16398b] cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Receptionist</span>
            </button>
          </div>
        ) : (
          /* DATA TABLE */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Profile & Full Name</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Mobile</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Last Login</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {paginatedList.map((rec) => {
                    const initials = getInitials(rec.fullName);

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Profile Column (Avatar + Initials/Photo + Full Name + Role subtitle) */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {Boolean(rec.photoUrl && rec.photoUrl.trim()) ? (
                              <img
                                src={rec.photoUrl}
                                alt={rec.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] font-black text-xs flex items-center justify-center border border-[#0E2A6D]/20 flex-shrink-0">
                                {initials}
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="text-xs font-extrabold text-slate-900 truncate tracking-tight">
                                {rec.fullName}
                              </h4>
                              <p className="text-[10px] font-semibold text-slate-400">
                                Front Desk Receptionist
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6 text-slate-700 font-semibold">
                          {rec.email}
                        </td>

                        {/* Mobile */}
                        <td className="py-4 px-6 text-slate-700 font-mono font-semibold">
                          {rec.phone}
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            Receptionist
                          </span>
                        </td>

                        {/* Status Badge (Req 13) */}
                        <td className="py-4 px-6">
                          {rec.status === "active" ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : rec.status === "blocked" ? (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Blocked
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="py-4 px-6 text-slate-500 font-medium">
                          {rec.lastLogin || "Never"}
                        </td>

                        {/* Visible Actions (Req 8) */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(rec)}
                              className="px-2.5 h-8 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-bold hover:border-[#0E2A6D] hover:text-[#0E2A6D] bg-white cursor-pointer transition-all flex items-center gap-1"
                              title="Edit Receptionist"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openResetPasswordModal(rec)}
                              className="px-2.5 h-8 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-bold hover:border-amber-500 hover:text-amber-600 bg-white cursor-pointer transition-all flex items-center gap-1"
                              title="Reset Password"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-500" />
                              <span className="hidden xl:inline">Reset Password</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(rec.id)}
                              className={`px-2.5 h-8 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                rec.status === "active"
                                  ? "border border-slate-200 text-slate-600 hover:bg-slate-100"
                                  : "border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              }`}
                            >
                              {rec.status === "active" ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(rec.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer transition-all"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION TOOLBAR (Req 14) */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedList.length)} of {sortedList.length} entries
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL 1: ADD RECEPTIONIST (Req 10) */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-md rounded-[28px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 space-y-4">
              <button onClick={() => setIsAddOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>

              <h3 className="text-lg font-extrabold text-[#0E2A6D] tracking-tight">Add New Receptionist</h3>

              <form onSubmit={handleCreateReceptionist} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="e.g. Priya Sharma" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                  {formErrors.fullName && <p className="text-[10px] font-bold text-rose-500 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="priya.reception@kavuturu.com" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                  {formErrors.email && <p className="text-[10px] font-bold text-rose-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number *</label>
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="9876543220" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                  {formErrors.mobile && <p className="text-[10px] font-bold text-rose-500 mt-1">{formErrors.mobile}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password *</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                    {formErrors.password && <p className="text-[10px] font-bold text-rose-500 mt-1">{formErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm Password *</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                    {formErrors.confirmPassword && <p className="text-[10px] font-bold text-rose-500 mt-1">{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Account Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-600 hover:bg-[#F8FAFC]">Cancel</button>
                  <button type="submit" className="px-5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-2xs cursor-pointer transition-all duration-200 outline-none active:scale-98">Create Receptionist</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT RECEPTIONIST (Req 11) */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditTarget(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-md rounded-[28px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 space-y-4">
              <button onClick={() => setEditTarget(null)} className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>

              <h3 className="text-lg font-extrabold text-[#0E2A6D] tracking-tight">Edit Receptionist</h3>

              <form onSubmit={handleUpdateReceptionist} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number *</label>
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  💡 Password is not editable here. Use the 🔑 Reset Password action button from the table.
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditTarget(null)} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-600 hover:bg-[#F8FAFC]">Cancel</button>
                  <button type="submit" className="px-5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs cursor-pointer transition-all duration-200 outline-none active:scale-98">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: RESET PASSWORD (Req 12) */}
      <AnimatePresence>
        {resetPasswordTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResetPasswordTarget(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-md rounded-[28px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 space-y-4">
              <button onClick={() => setResetPasswordTarget(null)} className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Reset Password</h3>
                  <p className="text-xs text-slate-400 font-semibold">{resetPasswordTarget.fullName}</p>
                </div>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-extrabold text-[#0E2A6D] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-generate Temp Password</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">New Password *</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min 6 characters" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                  {resetErrors.newPassword && <p className="text-[10px] font-bold text-rose-500 mt-1">{resetErrors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm New Password *</label>
                  <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required placeholder="Re-enter new password" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0E2A6D]" />
                  {resetErrors.confirmNewPassword && <p className="text-[10px] font-bold text-rose-500 mt-1">{resetErrors.confirmNewPassword}</p>}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setResetPasswordTarget(null)} className="px-4 h-9.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 h-9.5 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs hover:bg-[#16398b]">Reset Password</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: DELETE CONFIRMATION */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDeleteId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-sm rounded-[24px] border border-slate-100 shadow-2xl p-6 text-center select-none z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100"><Trash2 className="w-6 h-6" /></div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Receptionist Account?</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">This receptionist will no longer have access to the clinic portal.</p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button onClick={() => setConfirmDeleteId(null)} className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
                <button onClick={() => handleDeleteReceptionist(confirmDeleteId)} className="px-4 h-9 rounded-xl bg-rose-600 text-white text-xs font-bold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
