import React from "react";
import { Phone, PhoneCall, Clock, ShieldCheck, CheckCircle } from "lucide-react";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

export default function BookAppointment() {
  return (
    <div className="relative min-h-screen bg-[#FCFCFD] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] text-xs sm:text-sm font-semibold mb-6">
          <PhoneCall className="w-4 h-4" />
          <span>Direct Phone Consultation</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-outfit">
          Call Now for Appointments
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          Contact Kavuturu Dental Clinic directly to speak with our receptionist and schedule your visit instantly.
        </p>

        {/* Primary Call Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100/80 mb-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
            <Phone size={32} />
          </div>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Clinic Contact Hotline
          </span>

          <a
            href="tel:+918309479901"
            className="text-2xl sm:text-4xl font-extrabold text-[#0E2A6D] hover:text-emerald-600 transition-colors mb-6 tracking-tight"
          >
            +91 83094 79901
          </a>

          <a
            href="tel:+918309479901"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-secondary px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary-dark hover:shadow-xl cursor-pointer"
          >
            <Phone size={20} className="transition-transform duration-300 group-hover:scale-110" />
            <span>Call Now to Schedule</span>
          </a>
        </div>

        {/* Clinic Hours & Direct Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0E2A6D]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Clinic Hours</h3>
              <p className="text-xs text-slate-600 font-medium">Mon - Sat: 9:30 AM - 9:00 PM</p>
              <p className="text-[11px] text-slate-400">Sunday: 10:00 AM - 1:30 PM</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Instant Booking</h3>
              <p className="text-xs text-slate-600 font-medium">Speak directly with receptionist</p>
              <p className="text-[11px] text-slate-400">Zero waiting time</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Expert Care</h3>
              <p className="text-xs text-slate-600 font-medium">Dr. K. Ravindra Babu</p>
              <p className="text-[11px] text-slate-400">Tirupati Specialist</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
