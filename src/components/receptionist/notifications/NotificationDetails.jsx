import React from "react";
import { Mail, Calendar, EyeOff } from "lucide-react";
import Card from "../common/Card";

const NotificationDetails = ({ selectedNotification }) => {
  if (!selectedNotification) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 select-none border border-slate-100 bg-slate-50/20 h-full min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase mb-1">
          No Selection
        </h4>
        <p className="text-[11px] text-slate-400 font-medium max-w-xs leading-relaxed">
          Click on any notification in the list to view its full details here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-slate-100 bg-white shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-5 select-none h-full">
      <div className="space-y-1.5 pb-4 border-b border-slate-100">
        <span className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Notification Details
        </span>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 pt-2 tracking-wide leading-tight">
          {selectedNotification.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{selectedNotification.date}</span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          {selectedNotification.message}
        </p>

        <div className="text-[11px] text-slate-400 font-medium leading-relaxed p-3 bg-slate-100/40 rounded-xl flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Verified security message</span>
        </div>
      </div>
    </Card>
  );
};

export default NotificationDetails;
