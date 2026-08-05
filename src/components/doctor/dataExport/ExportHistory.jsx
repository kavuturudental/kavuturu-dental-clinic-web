// src/components/dataExport/ExportHistory.jsx

import React from "react";
import { History, CheckCircle2, FileText } from "lucide-react";

export default function ExportHistory({ history = [] }) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Recent Export History
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-normal">Last 5 export sessions</span>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-medium">
          No exports performed in this session yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.filename}</h4>
                  <span className="text-[11px] text-slate-500">
                    Format: <strong className="uppercase">{item.format}</strong> | {item.recordCount} records
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-[11px] text-slate-400 block">{item.time}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-200/60 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
