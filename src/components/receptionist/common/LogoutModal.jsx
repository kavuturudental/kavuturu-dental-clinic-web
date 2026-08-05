// src/receptionist/components/common/LogoutModal.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import authService from "../../../services/authService";

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    authService.logout();
    if (onConfirm) onConfirm();
    navigate("/login", { replace: true });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white w-full max-w-sm rounded-[24px] border border-slate-100 shadow-2xl p-6 sm:p-7 z-10 text-left space-y-5"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon Emblem */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center flex-shrink-0 shadow-xs">
              <LogOut className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-850 tracking-tight">
                Logout?
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Staff Account Session
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Are you sure you want to logout from your account?
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Cancel (Secondary) */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-600 transition-all cursor-pointer outline-none active:scale-98"
            >
              Cancel
            </button>

            {/* Logout (Primary Red) */}
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-900/10 transition-all cursor-pointer outline-none active:scale-98"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutModal;
