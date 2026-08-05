// src/components/receptionist/requests/RequestTable.jsx

import React, { useState } from "react";
import RequestRow from "./RequestRow";
import SearchBar from "../common/SearchBar";
import EmptyState from "../common/EmptyState";

const PAGE_SIZE = 8;

export default function RequestTable({
  requests = [],
  searchTerm: externalSearchTerm,
  onSearchChange,
  onAccept,
  onReschedule,
  onReject,
  onView,
  onViewDetails,
  onNew
}) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleView = onViewDetails || onView;

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;

  const handleSearchChange = (val) => {
    const term = typeof val === "string" ? val : (val?.target?.value || "");
    if (onSearchChange) {
      onSearchChange(term);
    } else {
      setInternalSearchTerm(term);
    }
    setCurrentPage(1);
  };

  const getFilteredRequests = () => {
    // Display strictly Pending requests
    let list = requests.filter((req) => req.status === "Pending");

    if (searchTerm && searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (req) =>
          (req.patientName && req.patientName.toLowerCase().includes(q)) ||
          (req.phoneNumber && req.phoneNumber.toLowerCase().includes(q)) ||
          (req.phone && req.phone.toLowerCase().includes(q)) ||
          (req.treatment && req.treatment.toLowerCase().includes(q)) ||
          (req.reqNumber && req.reqNumber.toLowerCase().includes(q)) ||
          (req.id && String(req.id).toLowerCase().includes(q))
      );
    }

    return list;
  };

  const filteredRequests = getFilteredRequests();
  const totalPages = Math.ceil(filteredRequests.length / PAGE_SIZE) || 1;
  const pagedRequests = filteredRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const headers = ["Patient", "Requested Treatment", "Preferred Date & Time", "Phone Number", "Submitted", "Status", "Actions"];

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xs overflow-hidden select-none">
      
      {/* Workspace Queue Header Bar */}
      <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            Appointment Requests Workspace
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Pending patient booking requests requiring approval or rescheduling.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <SearchBar
            placeholder="Search by patient name, phone or treatment..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Review Queue Table View */}
      <div className="overflow-x-auto">
        {pagedRequests.length === 0 ? (
          <div className="p-10 text-center">
            <EmptyState
              title={searchTerm ? "No matching appointment requests." : "No pending appointment requests."}
              description={searchTerm ? "No pending requests match your search criteria." : "New patient booking requests will appear here automatically."}
              onNew={onNew}
              actionLabel="Schedule Manually"
            />
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 whitespace-nowrap ${i === headers.length - 1 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pagedRequests.map((req) => (
                <RequestRow
                  key={req.id}
                  request={req}
                  onAccept={onAccept}
                  onReschedule={onReschedule}
                  onReject={onReject}
                  onView={handleView}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-500 font-normal">
          <span>
            Page <strong className="text-slate-900 font-semibold">{currentPage}</strong> of {totalPages} ({filteredRequests.length} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] text-slate-600 hover:bg-[#F8FAFC] disabled:opacity-40 disabled:hover:bg-transparent font-medium cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] text-slate-600 hover:bg-[#F8FAFC] disabled:opacity-40 disabled:hover:bg-transparent font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
