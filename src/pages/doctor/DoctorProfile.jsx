// src/pages/doctor/DoctorProfile.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Lock,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";
import doctorAccountService from "../../services/doctorAccountService";
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
  const [phone, setPhone] = useState("");
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

  const triggerToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  const loadDoctorProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await doctorAccountService.getProfile();

      if (res.success && res.data) {
        const d = res.data;
        setDoctorName(d.name || "Dr. K. Ravindra Babu");
        setQualification(d.qualification || "BDS, MDS – Conservative Dentistry & Endodontics");
        setEmail(d.email || "doctor@kavuturudental.com");
        setPhone(d.phone || "+91 83094 79901");
      }
    } catch (err) {
      console.error("Failed to load doctor profile:", err);
      triggerToast("Failed to load profile details.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!doctorName.trim()) {
      errs.name = "Full Name is required.";
    }

    if (!qualification.trim()) {
      errs.qualification = "Qualification is required.";
    }

    if (!email.trim()) {
      errs.email = "Email Address is required.";
    } else if (!isValidEmail(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (phone && !isValidPhone(phone.trim())) {
      errs.phone = "Please enter a valid phone number.";
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    setProfileErrors({});
    setProfileSaving(true);

    try {
      const res = await doctorAccountService.updateProfile({
        name: doctorName.trim(),
        qualification: qualification.trim(),
        email: email.trim(),
        phone: phone.trim()
      });

      if (res.success) {
        updateUser(res.data);
        triggerToast("Doctor profile updated successfully!", "success");
      } else {
        triggerToast(res.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update profile.";
      triggerToast(errMsg, "error");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!currentPassword) {
      errs.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      errs.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      errs.newPassword = "New password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required.";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "New password and confirm password must match.";
    }

    if (Object.keys(errs).length > 0) {
      setPassErrors(errs);
      return;
    }

    setPassErrors({});
    setPassSaving(true);

    try {
      const res = await doctorAccountService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        triggerToast("Password changed successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        triggerToast(res.message || "Failed to change password", "error");
      }
    } catch (err) {
      console.error("Failed to change password:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to change password.";
      triggerToast(errMsg, "error");
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl mx-auto pb-16">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 sm:right-8 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl border shadow-xl text-xs font-bold ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 flex-shrink-0" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-2xs">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="w-6 h-6 text-[#2563EB]" />
          <span>Doctor Account & Profile Settings</span>
        </h2>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Manage your personal credentials, contact info, and security details for the CMS Portal.
        </p>
      </div>

      {/* Grid Layout for Profile & Password Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 1: Doctor Profile Details Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <User className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Profile Details
              </h3>
            </div>

            {profileLoading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
                <span className="text-xs font-semibold">Loading profile details...</span>
              </div>
            ) : (
              <form id="doctor-profile-form" onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => {
                        setDoctorName(e.target.value);
                        if (profileErrors.name) setProfileErrors({ ...profileErrors, name: null });
                      }}
                      className={`h-11 w-full rounded-xl border pl-10 pr-3.5 font-bold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                        profileErrors.name ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                      }`}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1">{profileErrors.name}</p>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Qualifications & Degrees *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => {
                        setQualification(e.target.value);
                        if (profileErrors.qualification) setProfileErrors({ ...profileErrors, qualification: null });
                      }}
                      className={`h-11 w-full rounded-xl border pl-10 pr-3.5 font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                        profileErrors.qualification ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                      }`}
                    />
                  </div>
                  {profileErrors.qualification && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1">{profileErrors.qualification}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (profileErrors.email) setProfileErrors({ ...profileErrors, email: null });
                      }}
                      className={`h-11 w-full rounded-xl border pl-10 pr-3.5 font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                        profileErrors.email ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                      }`}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1">{profileErrors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (profileErrors.phone) setProfileErrors({ ...profileErrors, phone: null });
                      }}
                      className={`h-11 w-full rounded-xl border pl-10 pr-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                        profileErrors.phone ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                      }`}
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1">{profileErrors.phone}</p>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              form="doctor-profile-form"
              disabled={profileSaving || profileLoading}
              className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer outline-none active:scale-98"
            >
              {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{profileSaving ? "Saving Profile..." : "Save Profile Details"}</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: Change Password Security Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Key className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Change Password
              </h3>
            </div>

            <form id="doctor-password-form" onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              {/* Current Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passErrors.currentPassword) setPassErrors({ ...passErrors, currentPassword: null });
                    }}
                    placeholder="••••••••"
                    className={`h-11 w-full rounded-xl border pl-10 pr-10 font-mono text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                      passErrors.currentPassword ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passErrors.currentPassword && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1">{passErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  New Password (min 8 chars) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passErrors.newPassword) setPassErrors({ ...passErrors, newPassword: null });
                    }}
                    placeholder="••••••••"
                    className={`h-11 w-full rounded-xl border pl-10 pr-10 font-mono text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                      passErrors.newPassword ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passErrors.newPassword && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1">{passErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passErrors.confirmPassword) setPassErrors({ ...passErrors, confirmPassword: null });
                    }}
                    placeholder="••••••••"
                    className={`h-11 w-full rounded-xl border pl-10 pr-10 font-mono text-slate-900 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#EFF6FF] transition-all ${
                      passErrors.confirmPassword ? "border-rose-300 bg-rose-50/20" : "border-slate-200 bg-slate-50/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passErrors.confirmPassword && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1">{passErrors.confirmPassword}</p>
                )}
              </div>
            </form>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              form="doctor-password-form"
              disabled={passSaving}
              className="w-full h-11 rounded-xl bg-[#0E2A6D] hover:bg-[#0A1F52] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer outline-none active:scale-98"
            >
              {passSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{passSaving ? "Updating Password..." : "Update Security Password"}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
