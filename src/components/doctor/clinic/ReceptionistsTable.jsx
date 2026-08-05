import React from "react";
import { UserPlus, Pencil, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { useDialog } from "../../../context/DialogContext";

export default function ReceptionistsTable({ list, onAddClick, onEditClick, onToggleStatus, onRemoveClick }) {
  const { showConfirm } = useDialog();
  // Get initials for profile picture fallback
  const getInitials = (name) => {
    if (!name) return "RC";
    const parts = name.split(" ");
    return parts.map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#0E2A6D] tracking-tight">
            Receptionists
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Manage receptionist accounts and access.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="flex h-10 items-center justify-center gap-2 px-4 rounded-xl text-xs font-extrabold text-white bg-[#0E2A6D] hover:bg-[#1a3d91] active:scale-98 transition-all cursor-pointer shadow-md shadow-blue-900/5 hover:shadow-lg outline-none"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Receptionist</span>
        </button>
      </div>

      {/* Table Wrapper for Horizontal Scrolling */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
              <th className="py-3.5 px-4 w-16">Photo</th>
              <th className="py-3.5 px-4">Full Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Mobile Number</th>
              <th className="py-3.5 px-4 w-28 text-center">Status</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 px-4 w-28 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
            {list.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-bold bg-white">
                  No receptionist accounts found. Click "Add Receptionist" to create one.
                </td>
              </tr>
            ) : (
              list.map((rec) => (
                <tr key={rec.id} className="odd:bg-white even:bg-slate-50/30 hover:bg-slate-100/40 transition-colors">
                  {/* Profile Photo */}
                  <td className="py-3 px-4">
                    {rec.photoUrl ? (
                      <img 
                        src={rec.photoUrl} 
                        alt={rec.fullName} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-100" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] font-extrabold flex items-center justify-center text-[10px]">
                        {getInitials(rec.fullName)}
                      </div>
                    )}
                  </td>

                  {/* Full Name */}
                  <td className="py-3 px-4 text-slate-900 font-bold">{rec.fullName}</td>

                  {/* Email */}
                  <td className="py-3 px-4 text-slate-500 font-semibold">{rec.email}</td>

                  {/* Phone */}
                  <td className="py-3 px-4 text-slate-500 font-semibold">{rec.phone}</td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    <span 
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        rec.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="py-3 px-4 text-slate-400 font-semibold">{rec.lastLogin}</td>

                  {/* Actions Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEditClick(rec)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer outline-none"
                        title="Edit Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Status Button */}
                      <button
                        type="button"
                        onClick={() => onToggleStatus(rec.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer outline-none ${
                          rec.status === "active"
                            ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                            : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={rec.status === "active" ? "Deactivate Account" : "Activate Account"}
                      >
                        {rec.status === "active" ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          const confirmed = await showConfirm(
                            `Are you sure you want to delete receptionist "${rec.fullName}"? This action cannot be undone.`,
                            "Delete Receptionist Account",
                            "Delete",
                            "Cancel"
                          );
                          if (confirmed) {
                            onRemoveClick(rec.id);
                          }
                        }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer outline-none"
                        title="Remove Receptionist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
