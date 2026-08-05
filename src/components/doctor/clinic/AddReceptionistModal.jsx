import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, Phone, Check } from "lucide-react";

export default function AddReceptionistModal({ isOpen, onClose, onSubmit, editTarget }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTarget) {
      setFullName(editTarget.fullName || "");
      setEmail(editTarget.email || "");
      setPhone(editTarget.phone || "");
      setPassword(""); // Blank, optional on edit
      setConfirmPassword("");
      setStatus(editTarget.status || "active");
    } else {
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setStatus("active");
    }
    setErrors({});
  }, [editTarget, isOpen]);

  const validate = () => {
    const tempErrors = {};
    if (!fullName.trim()) tempErrors.fullName = "Full name is required";
    
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) tempErrors.email = "Email address is required";
    else if (!emailRegex.test(email)) tempErrors.email = "Invalid email format";

    // Phone checks
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) tempErrors.phone = "Mobile number is required";
    else if (!phoneRegex.test(phone)) tempErrors.phone = "Invalid 10-digit mobile number";

    // Password checks
    if (!editTarget) {
      if (!password) tempErrors.password = "Password is required";
      else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

      if (password !== confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      // For editing: if password is filled, validate it
      if (password) {
        if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword) {
          tempErrors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        fullName,
        email,
        phone,
        password: password || undefined,
        status
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white w-full max-w-md rounded-[24px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-[#0E2A6D] tracking-tight">
                {editTarget ? "Edit Receptionist" : "Add Receptionist"}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {editTarget ? "Update receptionist profile info." : "Create a new frontdesk receptionist account."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`h-10 w-full rounded-xl border pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                      errors.fullName ? "border-red-400 bg-red-50/20" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. priya@kavuturu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-10 w-full rounded-xl border pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                      errors.email ? "border-red-400 bg-red-50/20" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.email}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 9876543220"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`h-10 w-full rounded-xl border pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                      errors.phone ? "border-red-400 bg-red-50/20" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Password {editTarget && <span className="text-[9px] text-slate-400 lowercase">(leave empty to keep unchanged)</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-10 w-full rounded-xl border pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                      errors.password ? "border-red-400 bg-red-50/20" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-10 w-full rounded-xl border pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-colors focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                      errors.confirmPassword ? "border-red-400 bg-red-50/20" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-slate-900 outline-none text-xs font-semibold focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all rounded-xl text-xs font-extrabold text-slate-500 cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#0E2A6D] hover:bg-[#1a3d91] active:scale-98 transition-all rounded-xl text-xs font-extrabold text-white cursor-pointer shadow-md shadow-blue-900/5 hover:shadow-lg outline-none"
                >
                  {editTarget ? "Save Changes" : "Add Receptionist"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
