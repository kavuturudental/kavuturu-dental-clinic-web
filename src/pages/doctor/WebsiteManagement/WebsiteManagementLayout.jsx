// src/pages/doctor/WebsiteManagement/WebsiteManagementLayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import HomepagePreview from "../../../components/doctor/website/HomepagePreview";
import websiteService from "../../../services/websiteService";

export default function WebsiteManagementLayout() {
  const [toast, setToast] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePreviewWebsite = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 min-w-0 overflow-x-hidden select-none font-sans text-slate-900">
      
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
            <span className="text-xs font-bold leading-snug">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CMS Page Content Outlet */}
      <main className="flex-1 w-full h-full">
        <Outlet context={{ triggerToast, handlePreviewWebsite }} />
      </main>

      {/* Website Responsive Live Preview Modal */}
      <HomepagePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        previewMode={previewMode}
      />
    </div>
  );
}
