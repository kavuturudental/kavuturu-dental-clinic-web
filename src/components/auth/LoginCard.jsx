// src/components/auth/LoginCard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import logo from "../../assets/images/logos/logo.png";
import PasswordInput from "./PasswordInput";
import authService from "../../services/authService";

const LoginCard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password modal and toast state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [toast, setToast] = useState(location.state?.message || null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setAuthError("");

    const lowerEmail = email.toLowerCase().trim();

    let hasError = false;

    if (!lowerEmail) {
      setEmailError("Email address is required");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(lowerEmail)) {
        setEmailError("Please enter a valid email address");
        hasError = true;
      }
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    try {
      const user = await authService.login(
        lowerEmail,
        password
      );

      const userRole = (user.role || "").toLowerCase();

      if (userRole === "doctor") {
        navigate("/doctor/appointment-management/appointments");
      } else if (userRole === "receptionist") {
        navigate("/receptionist/appointments");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setAuthError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password."
      );
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!forgotEmail.trim()) {
      setForgotError("Email address is required");
      return;
    }
    if (!emailRegex.test(forgotEmail.trim())) {
      setForgotError("Please enter a valid email address");
      return;
    }

    setForgotError("");
    setForgotSubmitting(true);

    try {
      const res = await authService.forgotPassword(forgotEmail.trim());
      setIsForgotOpen(false);
      setToast(res.message || "Password reset link sent to your email.");
      setForgotEmail("");
      setTimeout(() => {
        setToast(null);
      }, 5000);
    } catch (err) {
      console.error("Forgot password error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to send password reset link.";
      setForgotError(errMsg);
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-white rounded-[28px] p-6 sm:p-10 lg:p-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] select-none animate-fade-in relative">
      
      {/* Toast Notification overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 left-6 sm:left-auto sm:right-8 z-50 flex items-start gap-2.5 px-5 py-3 rounded-2xl border shadow-xl bg-emerald-50 border-emerald-100 text-emerald-700 max-w-sm"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-bold leading-normal">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src={logo}
          alt="Kavuturu Dental Clinic"
          className="w-[260px] h-auto object-contain"
        />
      </div>

      {/* Description */}
      <p className="text-center text-xs sm:text-sm font-medium text-slate-400 tracking-wide mb-6">
        Sign in to securely access the clinic dashboard.
      </p>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email Address */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-500 tracking-wider uppercase">
            Email Address
          </label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            className={`h-14 w-full rounded-xl border bg-slate-50/30 px-5 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-sm font-medium ${
              emailError ? "border-red-400 bg-red-50/10" : "border-slate-200"
            }`}
          />
          {emailError && (
            <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span>{emailError}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-500 tracking-wider uppercase">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
          />
          {passwordError && (
            <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span>{passwordError}</span>
            </p>
          )}
          {authError && (
            <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{authError}</span>
            </p>
          )}
        </div>

        {/* Remember & Forgot Row */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
            Remember Me
          </label>

          <button
            type="button"
            onClick={() => {
              setIsForgotOpen(true);
              setForgotEmail("");
              setForgotError("");
            }}
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-light hover:underline transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            Forgot Password?
          </button>
        </div>

        {/* Primary Button */}
        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-light hover:shadow-lg active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer mt-2"
        >
          Sign In Securely
        </button>
      </form>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[24px] border border-slate-100 shadow-2xl p-6 md:p-8 z-10 text-left"
            >
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-5">
                <h3 className="text-lg font-bold text-primary tracking-tight">Forgot Password</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1 leading-normal">
                  Enter your registered email address below. We will send a secure password reset link valid for 15 minutes.
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. doctor@kavuturudental.com"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotError) setForgotError("");
                      }}
                      className={`h-11 w-full rounded-xl border pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 ${
                        forgotError ? "border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    />
                  </div>
                  {forgotError && (
                    <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span>{forgotError}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-extrabold text-slate-500 transition-all cursor-pointer outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="flex-1 h-10 rounded-xl text-white bg-primary hover:bg-primary-light disabled:opacity-50 text-xs font-extrabold transition-all cursor-pointer shadow-sm outline-none flex items-center justify-center gap-1.5"
                  >
                    {forgotSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : null}
                    <span>{forgotSubmitting ? "Sending..." : "Send Reset Link"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400 leading-relaxed font-light">
        <p>© 2026 Kavuturu Dental Clinic.</p>
        <p>All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginCard;