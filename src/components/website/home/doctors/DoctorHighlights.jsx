// src/components/home/doctors/DoctorHighlights.jsx

import React from "react";
import { motion } from "framer-motion";
import { getStatIcon } from "../../../../utils/statIconHelper";

const DoctorHighlights = ({ highlights = [] }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
      {highlights.map((item, index) => {
        const IconComponent = getStatIcon(item.subtitle || item.label || "");

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -4,
              scale: 1.02,
            }}
            className="group flex items-start gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-xs transition-all duration-300 hover:bg-white hover:border-sky-300 hover:shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0E2A6D] group-hover:text-white">
              <IconComponent className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#0E2A6D] font-outfit">
                {item.title || item.value}
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-slate-600 font-medium">
                {item.subtitle || item.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DoctorHighlights;