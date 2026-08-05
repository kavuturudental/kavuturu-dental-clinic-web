// src/components/doctor/dataExport/ExportFilters.jsx

import React from "react";
import { Filter, RotateCcw, Calendar, Search } from "lucide-react";

export default function ExportFilters({
  exportType,
  onExportTypeChange,
  datePreset,
  onDatePresetChange,
  filters,
  onFilterChange,
  onResetFilters
}) {
  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-2xs space-y-5 select-none">
      
      {/* 1. Export Type Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <span>Select Export Category</span>
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Choose which dataset to filter and export into CSV, Excel, or PDF.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] p-1 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => onExportTypeChange("appointments")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
              exportType === "appointments" ? "bg-[#2563EB] text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Appointments
          </button>
          <button
            type="button"
            onClick={() => onExportTypeChange("patients")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
              exportType === "patients" ? "bg-[#2563EB] text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Patients
          </button>
          <button
            type="button"
            onClick={() => onExportTypeChange("requests")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
              exportType === "requests" ? "bg-[#2563EB] text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Appointment Requests
          </button>
        </div>
      </div>

      {/* 2. Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Date Preset */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Date Range</span>
          </label>
          <select
            value={datePreset}
            onChange={(e) => onDatePresetChange(e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-sans cursor-pointer font-medium"
          >
            <option value="all">All Records</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-sans cursor-pointer font-medium"
          >
            <option value="All">All Statuses</option>
            {exportType === "appointments" && (
              <>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </>
            )}
            {exportType === "requests" && (
              <>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </>
            )}
            {exportType === "patients" && (
              <option value="Active">Active Patients</option>
            )}
          </select>
        </div>

        {/* Search Query */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Filter</span>
          </label>
          <input
            type="text"
            placeholder={
              exportType === "patients"
                ? "Search patient name, phone, or email..."
                : "Search patient name, phone, or treatment..."
            }
            value={filters.query}
            onChange={(e) => onFilterChange("query", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-sans font-medium"
          />
        </div>
      </div>

      {/* 3. Custom Date Range Pickers (If Custom is selected) */}
      {datePreset === "custom" && (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-mono"
            />
          </div>
        </div>
      )}

      {/* Reset Filter Footer */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer outline-none transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

    </div>
  );
}
