// src/components/home/contact/ContactHeader.jsx

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export const ContactHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10 text-left"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
        <MapPin className="w-3.5 h-3.5 text-sky-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
          Get In Touch
        </span>
      </div>

      {/* Title */}
      <h2 className="font-outfit text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl">
        Contact Our Clinic
      </h2>

      {/* Description */}
      <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
        Have any questions or need to visit us? Here is our location, timings, and contact info. You can also chat with us directly or schedule a session.
      </p>
    </motion.div>
  );
};

export default ContactHeader;
