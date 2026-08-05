// src/pages/doctor/DoctorProfile.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Key, 
  Users, 
  Eye, 
  EyeOff, 
  Plus, 
  Pencil, 
  RefreshCw, 
  Trash2,
  CheckCircle, 
  AlertCircle, 
  X, 
  Check,
  Loader2,
  Lock,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";
import doctorAccountService from "../../services/doctorAccountService";
import receptionistService from "../../services/receptionistService";
import { useAuth } from "../../context/AuthContext";

const isValidEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

const isValidPhone = (phoneStr) => {
  if (!phoneStr || typeof phoneStr !== "string") return false;
  const digitsOnly = phoneStr.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

export default function DoctorProfile() {
  const { updateUser } = useAuth();
  const [toast, setToast] = useState(null);

  // Section 1: Doctor Profile State
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [qualification, setQualification] = useState("");
  const [email, setEmail] = useState("");
  const [profileErrors, setProfileErrors] = useState({});

  // Section 2: Change Password State
  const [passSaving, setPassSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passErrors, setPassErrors] = useState({});

  // Section 3: Receptionist Management State
  const [receptionists, setReceptionists] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State for Add / Edit Receptionist
  const [recName, setRecName] = useState("");
  const [recEmail, setRecEmail] = useState("");
  const [recPhone, setRecPhone] = useState("");
  const [recPassword, setRecPassword] = useState("");
  const [recConfirmPassword, setRecConfirmPassword] = useState("");
  const [recStatus, setRecStatus] = useState("Active");
  const [showRecPass, setShowRecPass] = useState(false);
  const [showRecConfirmPass, setShowRecConfirmPass] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalErrors, setModalErrors] = useState({});

  // Reset Password Form State
  const [resetPassVal, setResetPassVal] = useState("");
  const [resetConfirmPassVal, setResetConfirmPassVal] = useState("");
  const [showResetPass, setShowResetPass] = useState(false);
  const [showResetConfirmPass, setShowResetConfirmPass] = useState(false);

  const triggerToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadDoctorProfile();
    loadReceptionists();
  }, []);

  const loadDoctorProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await doctorAccountService.getProfile();
      if (res.data) {
        setDoctorName(res.data.name || "");
        setQualification(res.data.qualification || "BDS, MDS – Conservative Dentistry & Endodontics");
        setEmail(res.data.email || "");
      }
    } catch (err) {
      console.error("Failed to load doctor profile:", err);
      triggerToast("Failed to load profile details.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const loadReceptionists = async () => {
    setRecLoading(true);
    try {
      const res = await receptionistService.getReceptionists();
      if (res.data) {
        setReceptionists(res.data);
      }
    } catch (err) {
      console.error("Failed to load receptionists:", err);
      triggerToast("Failed to load receptionists list.", "error");
    } finally {
      setRecLoading(false);
    }
  };

  // ==========================================
  // SECTION 1: SAVE DOCTOR PROFILE
  // ==========================================
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!doctorName.trim()) errs.doctorName = "Doctor Name is required.";
    if (!qualification.trim()) errs.qualification = "Qualification is required.";
    if (!email.trim()) {
      errs.email = "Email Address is required.";
    } else if (!isValidEmail(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setProfileErrors({});
    setProfileSaving(true);

    try {
      const res = await doctorAccountService.updateProfile({
        name: doctorName.trim(),
        qualification: qualification.trim(),
        email: email.trim(),
      });
      if (res.success) {
        if (res.data) {
          updateUser(res.data);
        }
        triggerToast("Doctor profile updated successfully!", "success");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update profile.";
      triggerToast(errMsg, "error");
    } finally {
      setProfileSaving(false);
    }
  };

  // ==========================================
  // SECTION 2: CHANGE PASSWORD
  // ==========================================
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!currentPassword) errs.currentPassword = "Current Password is required.";
    if (!newPassword) {
      errs.newPassword = "New Password is required.";
    } else if (newPassword.length < 8) {
      errs.newPassword = "New password must be at least 8 characters.";
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "New Password and Confirm Password must match.";
    }

    if (Object.keys(errs).length > 0) {
      setPassErrors(errs);
      triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setPassErrors({});
    setPassSaving(true);

    try {
      const res = await doctorAccountService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        triggerToast("Password updated successfully.", "success");
      }
    } catch (err) {
      console.error("Failed to change password:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to change password.";
      triggerToast(errMsg, "error");
    } finally {
      setPassSaving(false);
    }
  };

  // ==========================================
  // SECTION 3: RECEPTIONIST MANAGEMENT
  // ==========================================
  const isLimitReached = receptionists.length >= 5;

  const openAddModal = () => {
    if (isLimitReached) return;
    setRecName("");
    setRecEmail("");
    setRecPhone("");
    setRecPassword("");
    setRecConfirmPassword("");
    setRecStatus("Active");
    setShowRecPass(false);
    setShowRecConfirmPass(false);
    setModalErrors({});
    setIsAddModalOpen(true);
  };

  const openEditModal = (rec) => {
    setEditTarget(rec);
    setRecName(rec.name);
    setRecEmail(rec.email);
    setRecPhone(rec.phone);
    setRecStatus(rec.isActive ? "Active" : "Inactive");
    setModalErrors({});
  };

  const openResetModal = (rec) => {
    setResetTarget(rec);
    setResetPassVal("");
    setResetConfirmPassVal("");
    setShowResetPass(false);
    setShowResetConfirmPass(false);
    setModalErrors({});
  };

  const openDeleteModal = (rec) => {
    setDeleteTarget(rec);
  };

  // Create Receptionist Handler
  const handleCreateReceptionist = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!recName.trim()) errs.name = "Receptionist Name is required.";
    if (!recEmail.trim()) {
      errs.email = "Email Address is required.";
    } else if (!isValidEmail(recEmail)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!recPhone.trim()) {
      errs.phone = "Phone Number is required.";
    } else if (!isValidPhone(recPhone)) {
      errs.phone = "Please enter a valid phone number.";
    }
    if (!recPassword) {
      errs.password = "Password is required.";
    } else if (recPassword.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (recPassword !== recConfirmPassword) {
      errs.confirmPassword = "Password and Confirm Password must match.";
    }

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs);
      triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setModalErrors({});
    setModalSubmitting(true);

    try {
      const res = await receptionistService.createReceptionist({
        name: recName.trim(),
        email: recEmail.trim(),
        phone: recPhone.trim(),
        password: recPassword,
        confirmPassword: recConfirmPassword,
        status: recStatus,
      });

      if (res.success) {
        triggerToast("Receptionist account created successfully!", "success");
        setIsAddModalOpen(false);
        loadReceptionists();
      }
    } catch (err) {
      console.error("Failed to create receptionist:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to create receptionist.";
      triggerToast(errMsg, "error");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Edit Receptionist Handler
  const handleUpdateReceptionist = async (e) => {
    if (e) e.preventDefault();
    if (!editTarget) return;

    const errs = {};
    if (!recName.trim()) errs.name = "Receptionist Name is required.";
    if (!recEmail.trim()) {
      errs.email = "Email Address is required.";
    } else if (!isValidEmail(recEmail)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!recPhone.trim()) {
      errs.phone = "Phone Number is required.";
    } else if (!isValidPhone(recPhone)) {
      errs.phone = "Please enter a valid phone number.";
    }

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs);
      triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setModalErrors({});
    setModalSubmitting(true);

    try {
      const res = await receptionistService.updateReceptionist(editTarget._id, {
        name: recName.trim(),
        email: recEmail.trim(),
        phone: recPhone.trim(),
        status: recStatus,
      });

      if (res.success) {
        triggerToast("Receptionist details updated successfully!", "success");
        setEditTarget(null);
        loadReceptionists();
      }
    } catch (err) {
      console.error("Failed to update receptionist:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update receptionist.";
      triggerToast(errMsg, "error");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!resetTarget) return;

    const errs = {};
    if (!resetPassVal) {
      errs.password = "New Password is required.";
    } else if (resetPassVal.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (resetPassVal !== resetConfirmPassVal) {
      errs.confirmPassword = "Passwords must match.";
    }

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs);
      triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setModalErrors({});
    setModalSubmitting(true);

    try {
      const res = await receptionistService.resetPassword(resetTarget._id, {
        newPassword: resetPassVal,
        confirmPassword: resetConfirmPassVal,
      });

      if (res.success) {
        triggerToast("Receptionist password updated successfully.", "success");
        setResetTarget(null);
      }
    } catch (err) {
      console.error("Failed to reset receptionist password:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to reset password.";
      triggerToast(errMsg, "error");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Delete Receptionist Handler
  const handleDeleteReceptionist = async () => {
    if (!deleteTarget) return;
    setModalSubmitting(true);

    try {
      const res = await receptionistService.deleteReceptionist(deleteTarget._id);
      if (res.success) {
        triggerToast("Receptionist account deleted successfully.", "success");
        setDeleteTarget(null);
        loadReceptionists();
      }
    } catch (err) {
      console.error("Failed to delete receptionist:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to delete receptionist.";
      triggerToast(errMsg, "error");
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 select-none font-sans w-full max-w-[1280px] mx-auto pb-16">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                : "bg-red-50/95 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-xs font-bold leading-snug">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* SECTION 1: MY PROFILE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#0E2A6D]" />
            Section 1 – My Profile
          </h2>
          <span className="text-[11px] font-bold text-[#0E2A6D] bg-sky-50 px-2.5 py-1 rounded-lg">
            Doctor Account
          </span>
        </div>

        {profileLoading ? (
          <div className="py-8 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0E2A6D]" />
            <span className="text-xs font-medium">Loading profile information...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Doctor Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Doctor Name *
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                  placeholder="e.g. Dr. K. Ravindra Babu"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
                {profileErrors.doctorName && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">{profileErrors.doctorName}</p>
                )}
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  Qualification *
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  placeholder="e.g. BDS, MDS – Conservative Dentistry & Endodontics"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
                {profileErrors.qualification && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">{profileErrors.qualification}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address (Login Email) *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. dr.ravindra@kavuturudentalclinic.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
                {profileErrors.email && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">{profileErrors.email}</p>
                )}
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                {profileSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
                <span>{profileSaving ? "Saving..." : "Save All Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: CHANGE PASSWORD */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0E2A6D]" />
            Section 2 – Change Password
          </h2>
          <span className="text-[11px] font-medium text-slate-400">
            Min 8 characters required
          </span>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Current Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passErrors.currentPassword && (
                <p className="text-[10px] text-red-600 font-bold mt-1">{passErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 8 characters"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passErrors.newPassword && (
                <p className="text-[10px] text-red-600 font-bold mt-1">{passErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passErrors.confirmPassword && (
                <p className="text-[10px] text-red-600 font-bold mt-1">{passErrors.confirmPassword}</p>
              )}
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passSaving}
              className="px-6 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
            >
              {passSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>{passSaving ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: RECEPTIONIST MANAGEMENT */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0E2A6D]" />
              Section 3 – Receptionist Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Doctor can create up to 5 receptionist accounts. Receptionists log in using their credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Accounts: <strong className={isLimitReached ? "text-red-600" : "text-[#0E2A6D]"}>{receptionists.length} / 5</strong>
            </span>

            <button
              type="button"
              onClick={openAddModal}
              disabled={isLimitReached}
              className={`px-4 h-9.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-2xs cursor-pointer outline-none active:scale-98 ${
                isLimitReached
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-[#16A34A] hover:bg-[#15803D] text-white"
              }`}
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Receptionist</span>
            </button>
          </div>
        </div>

        {/* Limit Reached Banner */}
        {isLimitReached && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Receptionist Limit Reached
              </h4>
              <p className="text-xs font-medium text-amber-800 mt-0.5 leading-relaxed">
                You have reached the maximum limit of 5 receptionist accounts. Please delete an existing receptionist before adding a new one.
              </p>
            </div>
          </div>
        )}

        {/* Table / List View */}
        {recLoading ? (
          <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0E2A6D]" />
            <span className="text-xs font-medium">Loading receptionists...</span>
          </div>
        ) : receptionists.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold">No receptionist accounts found.</p>
            <p className="text-[11px] text-slate-400">Click "Add Receptionist" above to create the first account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Receptionist Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {receptionists.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {rec.name}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.email}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.phone || "—"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          rec.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            rec.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {rec.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(rec)}
                          title="Edit Receptionist"
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#0E2A6D]/40 text-slate-700 hover:text-[#0E2A6D] text-[11px] font-bold transition-all flex items-center gap-1 bg-white hover:bg-slate-50 cursor-pointer shadow-2xs"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* Reset Password */}
                        <button
                          type="button"
                          onClick={() => openResetModal(rec)}
                          title="Reset Password"
                          className="px-2.5 py-1 rounded-lg border border-amber-200 hover:border-amber-400 text-amber-700 hover:text-amber-800 text-[11px] font-bold transition-all flex items-center gap-1 bg-amber-50/50 hover:bg-amber-50 cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-600" />
                          <span>Reset Password</span>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(rec)}
                          title="Delete Receptionist"
                          className="px-2 py-1 rounded-lg border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 text-[11px] font-bold transition-all flex items-center gap-1 bg-red-50/50 hover:bg-red-50 cursor-pointer shadow-2xs"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD RECEPTIONIST */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0E2A6D]" />
                  Add Receptionist
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateReceptionist} className="space-y-4 text-xs">
                
                {/* Receptionist Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Receptionist Name *
                  </label>
                  <input
                    type="text"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    required
                    placeholder="e.g. Anitha Sharma"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                  {modalErrors.name && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.name}</p>}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={recEmail}
                      onChange={(e) => setRecEmail(e.target.value)}
                      required
                      placeholder="e.g. anitha@kavuturu.com"
                      className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                    />
                    {modalErrors.email && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      value={recPhone}
                      onChange={(e) => setRecPhone(e.target.value)}
                      required
                      placeholder="e.g. +91 9876543210"
                      className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                    />
                    {modalErrors.phone && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.phone}</p>}
                  </div>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showRecPass ? "text" : "password"}
                        value={recPassword}
                        onChange={(e) => setRecPassword(e.target.value)}
                        required
                        placeholder="Min 8 chars"
                        className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3 pr-9 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRecPass(!showRecPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRecPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {modalErrors.password && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showRecConfirmPass ? "text" : "password"}
                        value={recConfirmPassword}
                        onChange={(e) => setRecConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter password"
                        className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3 pr-9 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRecConfirmPass(!showRecConfirmPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRecConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {modalErrors.confirmPassword && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Account Status
                  </label>
                  <select
                    value={recStatus}
                    onChange={(e) => setRecStatus(e.target.value)}
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-5 h-9 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs outline-none active:scale-98 transition-all duration-200"
                  >
                    {modalSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-white" />}
                    <span>{modalSubmitting ? "Creating..." : "Create Account"}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: EDIT RECEPTIONIST */}
      {/* ========================================================= */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-[#0E2A6D]" />
                  Edit Receptionist
                </h3>
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateReceptionist} className="space-y-4 text-xs">
                
                {/* Receptionist Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Receptionist Name *
                  </label>
                  <input
                    type="text"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    required
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                  {modalErrors.name && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={recEmail}
                    onChange={(e) => setRecEmail(e.target.value)}
                    required
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                  {modalErrors.email && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={recPhone}
                    onChange={(e) => setRecPhone(e.target.value)}
                    required
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                  {modalErrors.phone && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.phone}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={recStatus}
                    onChange={(e) => setRecStatus(e.target.value)}
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Note: Password is not editable here */}
                <p className="text-[10px] text-slate-400 italic">
                  Note: Password cannot be edited here. Use "Reset Password" action from the table to update login password.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    className="px-4 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all duration-200 outline-none active:scale-98"
                  >
                    {modalSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-white" />}
                    <span>{modalSubmitting ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: RESET RECEPTIONIST PASSWORD */}
      {/* ========================================================= */}
      <AnimatePresence>
        {resetTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                    Reset Receptionist Password
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    For <strong className="text-slate-900">{resetTarget.name}</strong> ({resetTarget.email})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                
                {/* New Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showResetPass ? "text" : "password"}
                      value={resetPassVal}
                      onChange={(e) => setResetPassVal(e.target.value)}
                      required
                      placeholder="Minimum 8 characters"
                      className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3 pr-9 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass(!showResetPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showResetPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {modalErrors.password && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showResetConfirmPass ? "text" : "password"}
                      value={resetConfirmPassVal}
                      onChange={(e) => setResetConfirmPassVal(e.target.value)}
                      required
                      placeholder="Re-enter password"
                      className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3 pr-9 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPass(!showResetConfirmPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showResetConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {modalErrors.confirmPassword && <p className="text-[10px] text-red-600 font-bold mt-1">{modalErrors.confirmPassword}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResetTarget(null)}
                    className="px-4 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-5 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {modalSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-white" />}
                    <span>{modalSubmitting ? "Resetting..." : "Reset Password"}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: DELETE RECEPTIONIST CONFIRMATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex-shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Delete Receptionist Account?
                  </h3>
                  <p className="text-xs font-bold text-red-600 mt-1">
                    Are you sure you want to delete this receptionist?
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    This will permanently delete <strong className="text-slate-800">{deleteTarget.name}</strong> ({deleteTarget.email}) from MongoDB. They will no longer be able to log in.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={modalSubmitting}
                  className="px-4 h-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteReceptionist}
                  disabled={modalSubmitting}
                  className="px-5 h-9 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {modalSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Trash2 className="w-4 h-4 text-white" />}
                  <span>{modalSubmitting ? "Deleting..." : "Delete"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
