// src/receptionist/components/dashboard/SearchPatientModal.jsx

import React, { useState } from "react";
import Modal from "../common/Modal";
import SearchBar from "../common/SearchBar";
import { appointmentsData } from "../../../data/receptionist/appointmentsData";
import StatusBadge from "../appointments/StatusBadge";
import { formatShortDate } from "../../../utils/receptionist/helpers";
import { User, Phone, Stethoscope, Clock, Calendar } from "lucide-react";

export const SearchPatientModal = ({ isOpen, onClose, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = searchTerm.trim() === ""
    ? appointmentsData.slice(0, 4)
    : appointmentsData.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.phoneNumber.includes(searchTerm) ||
          apt.treatment.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Patient Directory">
      <div className="space-y-4">
        <SearchBar
          placeholder="Search by patient name, phone number, or treatment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredPatients.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              No matching patient records found.
            </div>
          ) : (
            filteredPatients.map((apt) => (
              <div
                key={apt.id}
                onClick={() => {
                  if (onViewDetails) onViewDetails(apt);
                  onClose();
                }}
                className="p-3 sm:p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-sky-50/60 hover:border-sky-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0E2A6D] group-hover:bg-[#0E2A6D] group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 group-hover:text-[#0E2A6D] transition-colors">
                      {apt.patientName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {apt.phoneNumber}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <Stethoscope className="w-3 h-3 text-sky-600" />
                        {apt.treatment}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="font-bold text-[#0E2A6D] block">{apt.time}</span>
                  <span className="text-slate-400 text-[10px] block">{formatShortDate(apt.date)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchPatientModal;
