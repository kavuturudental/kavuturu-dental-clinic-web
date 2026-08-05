// src/pages/auth/ForgotPassword.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import logo from "../../assets/images/logos/logo.png";
import authService from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await authService.forgotPassword(trimmedEmail);
      setSuccessMsg(res.message || "Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to send password reset link.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 select-none font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 space-y-6 text-slate-900"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Kavuturu Dental Clinic" className="w-[220px] h-auto object-contain" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-[#0E2A6D] tracking-tight">
            Forgot Password
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Enter your registered email address. We will send a secure password reset link valid for 15 minutes.
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3 text-emerald-900">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-emerald-900">Reset Link Sent</h4>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Registered Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
                placeholder="e.g. doctor@kavuturudental.com"
                className={`h-11 w-full rounded-xl border pl-10 pr-4 font-bold text-slate-900 outline-none transition-all focus:border-[#0E2A6D] focus:bg-white ${
                  error ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-slate-50/60"
                }`}
              />
            </div>
            {error && (
              <p className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
            <span>{submitting ? "Sending Reset Link..." : "Send Reset Link"}</span>
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center border-t border-slate-100 pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E2A6D] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
