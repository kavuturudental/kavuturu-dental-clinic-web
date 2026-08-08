// src/components/website/contact/ContactHero.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Sparkles } from "lucide-react";
import { contactData as defaultData } from "../../../data/website/contactData";
import { getContact } from "../../../services/website/contactService";

const ContactHero = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await getContact();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load contact in ContactHero:", err);
      }
    };
    fetchContact();
  }, []);

  const primaryPhone = data?.primaryPhone || defaultData.phone;
  const email = data?.email || defaultData.email;
  const address = data?.address || defaultData.info.address.value;
  const monSatHours = data?.timings?.monSat || data?.timings?.monFri || "9:30 AM – 9:00 PM";

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-[#FCFCFD] py-16 sm:py-20 lg:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Get In Touch With Us
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0E2A6D] leading-[1.15]">
              Contact Kavuturu Dental Clinic
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              We are here to assist you with compassionate, world-class laser dental care in Tirupati. 
              Call us directly, message via WhatsApp, or visit our state-of-the-art clinic.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all shadow-2xs"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{primaryPhone}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-all shadow-2xs"
              >
                <Mail className="w-4 h-4 text-rose-600" />
                <span>{email}</span>
              </a>

              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold shadow-2xs">
                <Clock className="w-4 h-4 text-violet-600" />
                <span>Mon–Sat: {monSatHours}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Card Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border border-sky-100 bg-white p-7 shadow-[0_20px_50px_rgba(14,42,109,0.08)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0E2A6D] flex items-center justify-center font-bold shadow-xs shrink-0">
                  <MapPin className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                    Clinic Location
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Tirupati, Andhra Pradesh</p>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                {address}
              </p>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href="https://maps.google.com/?q=Lakshmi+Towers+22-7-54/1A+Karakambadi+Road+Tirupati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] text-white text-xs font-bold text-center transition-all shadow-md shadow-[#0E2A6D]/20"
                >
                  Get Directions on Google Maps
                </a>

                <a
                  href="/book-appointment"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-all shadow-md shadow-emerald-600/20"
                >
                  Book Appointment Online
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactHero;
