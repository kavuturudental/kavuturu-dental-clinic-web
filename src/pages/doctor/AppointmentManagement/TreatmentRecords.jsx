// src/pages/doctor/AppointmentManagement/TreatmentRecords.jsx

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import Modal from "../../../components/receptionist/common/Modal";

export default function TreatmentRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const records = [];

  const filteredRecords = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none font-sans w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Treatment Records
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Clinical treatment histories, clinical notes, and procedure records.
          </p>
        </div>
      </div>

      {/* Directory Table Container */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records by patient name or procedure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full pl-9 pr-4 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              No clinical treatment records found in database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Record ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Treatment</th>
                  <th className="p-4">Procedure Date</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900">{item.id}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      <div>{item.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{item.phone}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{item.treatment}</td>
                    <td className="p-4 text-slate-500 font-normal">{item.date}</td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => setSelectedRecord(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-emerald-600 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Notes</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Record Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Clinical Record: ${selectedRecord.id}`}
        >
          <div className="space-y-4 font-sans text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-semibold text-slate-900 text-sm">{selectedRecord.patientName}</h4>
              <p className="text-slate-400 text-xs">{selectedRecord.phone}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500 text-[11px] uppercase block">Procedure</span>
              <p className="font-semibold text-slate-900 mt-0.5">{selectedRecord.treatment}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500 text-[11px] uppercase block">Doctor Notes</span>
              <p className="text-slate-700 mt-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-normal">
                {selectedRecord.doctorNotes}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-500">
              <span>Date: {selectedRecord.date}</span>
              <span className="font-semibold text-slate-900">Next: {selectedRecord.nextVisit}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
