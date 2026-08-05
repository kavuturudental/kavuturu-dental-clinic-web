// src/pages/website/BookAppointment.jsx

import React from "react";
import { Calendar, Clock, ShieldCheck, PhoneCall, CheckCircle } from "lucide-react";
import AppointmentForm from "../../components/website/bookAppointment/AppointmentForm";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

export default function BookAppointment() {
  return (
    <div className="relative min-h-screen bg-[#FCFCFD] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] text-xs sm:text-sm font-semibold mb-4">
            <Calendar className="w-4 h-4" />
            <span>Online Appointment Booking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Book Your Dental Appointment
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select your preferred date, time slot, and treatment below. Our team will verify your appointment and reach out with confirmation details.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100/80 mb-12">
          <div className="mb-6 pb-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Patient & Booking Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">Please provide accurate contact information for slot reservation.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Instant Verification</span>
            </div>
          </div>

          <AppointmentForm />
        </div>

        {/* Clinic Features / Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0E2A6D]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Working Hours</h3>
              <p className="text-xs text-slate-600 font-medium">Mon - Sat: 9:00 AM - 7:30 PM</p>
              <p className="text-[11px] text-slate-400">Sunday: 10:00 AM - 1:00 PM</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Zero Wait Time</h3>
              <p className="text-xs text-slate-600 font-medium">Prioritized Slots</p>
              <p className="text-[11px] text-slate-400">Direct Doctor Consultation</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-start gap-4 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Need Helpline?</h3>
              <p className="text-xs text-slate-600 font-medium">+91 94901 24744</p>
              <p className="text-[11px] text-slate-400">Tirupati Reception Desk</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
