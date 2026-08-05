// src/components/common/Drawer.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const Drawer = ({ isOpen, onClose, title, subtitle, children, footer, width = "w-full sm:w-[440px] md:w-[42%]" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`absolute right-0 top-0 bottom-0 ${width} bg-white shadow-2xl z-10 flex flex-col justify-between select-none border-l border-slate-200`}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-[#0E2A6D] tracking-tight">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {children}
            </div>

            {footer && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
