// src/components/common/LogoutModal.jsx

import React from "react";
import { LogOut, AlertTriangle, X } from "lucide-react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    onClose();
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <LogOut className="w-7 h-7" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-extrabold text-slate-900 font-outfit">
          Confirm Logout
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to end your current session and logout from Doctor CMS?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
