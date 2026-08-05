// src/components/dataExport/ExportButtons.jsx

import React from "react";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";

export default function ExportButtons({
  onExportCSV,
  onExportExcel,
  onExportPDF,
  isExporting
}) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Download & Export Actions
          </h3>
        </div>
        <span className="text-xs text-slate-400">Select export format</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CSV Export */}
        <button
          type="button"
          onClick={onExportCSV}
          disabled={isExporting}
          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer outline-none flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">Export CSV</h4>
            <span className="text-[10px] text-slate-500 font-normal">Raw tabular comma values</span>
          </div>
        </button>

        {/* Excel Export */}
        <button
          type="button"
          onClick={onExportExcel}
          disabled={isExporting}
          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer outline-none flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">Export Excel</h4>
            <span className="text-[10px] text-slate-500 font-normal">Formatted .xlsx spreadsheet</span>
          </div>
        </button>

        {/* PDF Export */}
        <button
          type="button"
          onClick={onExportPDF}
          disabled={isExporting}
          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all cursor-pointer outline-none flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">Export PDF Report</h4>
            <span className="text-[10px] text-slate-500 font-normal">Printable medical document</span>
          </div>
        </button>
      </div>
    </div>
  );
}
