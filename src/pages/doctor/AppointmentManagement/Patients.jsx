// src/pages/doctor/AppointmentManagement/Patients.jsx

import React, { useState } from "react";
import SearchBar from "../../../components/receptionist/common/SearchBar";
import usePatients from "../../../hooks/usePatients";
import StatusBadge from "../../../components/receptionist/appointments/StatusBadge";
import PatientDetailModal from "../../../components/common/PatientDetailModal";
import { Eye, Users, Phone, Mail } from "lucide-react";

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { patients, loading, error } = usePatients();

  // Filter patients by search query
  const filteredPatients = (patients || []).filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p._id && String(p._id).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 w-full min-w-0 font-sans select-none pb-12">
      {/* Table Container */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0E2A6D]" />
              <span>Patients Directory ({filteredPatients.length})</span>
            </h2>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              View patient details including Name, Phone, Patient ID, Email, and full Profile.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="Search name, phone, ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
              Loading patients directory...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-500 text-xs font-semibold">
              {error}
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              {searchQuery ? `No patients match "${searchQuery}".` : "No patient records exist in the database yet."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Patient ID</th>
                  <th className="py-4 px-6">Patient Name</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6 text-center">Visits</th>
                  <th className="py-4 px-6">Current Status</th>
                  <th className="py-4 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredPatients.map((p, idx) => {
                  const patientIdCode = p._id ? `PAT-${String(p._id).slice(-6).toUpperCase()}` : `PAT-100${idx + 1}`;

                  return (
                    <tr key={p._id || p.id || p.phone} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* 1. Patient ID */}
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200/60">
                          {patientIdCode}
                        </span>
                      </td>

                      {/* 2. Patient Name */}
                      <td className="py-5 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {p.name ? p.name.slice(0, 2).toUpperCase() : "PT"}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                          </div>
                        </div>
                      </td>

                      {/* 3. Phone Number */}
                      <td className="py-5 px-6 font-mono text-slate-700 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.phone}</span>
                        </div>
                      </td>

                      {/* 4. Email */}
                      <td className="py-5 px-6 text-slate-600 font-normal whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.email || "N/A"}</span>
                        </div>
                      </td>

                      {/* 5. Visits */}
                      <td className="py-5 px-6 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 font-bold text-slate-900 text-xs">
                          {p.totalVisits || (p.appointmentHistory ? p.appointmentHistory.length : 1)}
                        </span>
                      </td>

                      {/* 6. Current Status */}
                      <td className="py-5 px-6 whitespace-nowrap">
                        <StatusBadge status={p.currentStatus || "Confirmed"} />
                      </td>

                      {/* 7. Profile Action */}
                      <td className="py-5 px-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedPatient(p)}
                          className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Patient Profile Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={Boolean(selectedPatient)}
        onClose={() => setSelectedPatient(null)}
      />

    </div>
  );
}
