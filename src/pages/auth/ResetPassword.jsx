// src/pages/auth/ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import logo from "../../assets/images/logos/logo.png";
import authService from "../../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    setVerifying(true);
    setTokenError("");
    try {
      const res = await authService.verifyResetToken(token);
      if (res.success) {
        setTokenValid(true);
      }
    } catch (err) {
      console.error("Token verification error:", err);
      const errMsg = err.response?.data?.message || err.message || "This password reset link is invalid or has expired.";
      setTokenError(errMsg);
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newPassword) {
      setFormError("New Password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords must match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await authService.resetPassword(token, newPassword, confirmPassword);
      if (res.success) {
        // Redirect to Login Page with success banner
        navigate("/login", {
          replace: true,
          state: {
            resetSuccess: true,
            message: "Your password has been updated successfully. Please log in using your new password.",
          },
        });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to reset password.";
      setFormError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-500 gap-3 select-none">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
        <span className="text-xs font-semibold">Verifying password reset token...</span>
      </div>
    );
  }

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

        {/* Invalid or Expired Token State */}
        {!tokenValid ? (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-slate-900">
                Invalid or Expired Link
              </h2>
              <p className="text-xs font-semibold text-red-600 leading-relaxed px-4">
                {tokenError || "This password reset link is invalid or has expired."}
              </p>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Password reset links expire automatically after 15 minutes or after being used. Please request a new password reset link.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <Link
                to="/forgot-password"
                className="w-full h-10 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Request New Link</span>
              </Link>

              <Link
                to="/login"
                className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Valid Token Reset Form State */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-extrabold text-[#0E2A6D] tracking-tight">
                Create New Password
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Set a strong password with a minimum of 8 characters for your account.
              </p>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs font-bold leading-snug">{formError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              
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
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (formError) setFormError("");
                    }}
                    required
                    placeholder="Minimum 8 characters"
                    className="h-10.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formError) setFormError("");
                    }}
                    required
                    placeholder="Re-enter new password"
                    className="h-10.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                <span>{submitting ? "Resetting Password..." : "Reset Password"}</span>
              </button>
            </form>

            <div className="text-center border-t border-slate-100 pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E2A6D] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
