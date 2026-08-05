import React from "react";
import { PlusCircle, CalendarRange, XOctagon } from "lucide-react";
import Button from "../common/Button";

const QuickActions = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-2.5">
        <Button variant="primary" className="w-full justify-start h-12 rounded-xl text-xs sm:text-sm">
          <PlusCircle className="w-5 h-5 text-white" />
          <span>New Appointment</span>
        </Button>

        <Button variant="secondary" className="w-full justify-start h-12 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-100 hover:bg-slate-100">
          <CalendarRange className="w-5 h-5 text-slate-500" />
          <span>Reschedule Appointment</span>
        </Button>

        <Button variant="danger" className="w-full justify-start h-12 rounded-xl text-xs sm:text-sm">
          <XOctagon className="w-5 h-5 text-white" />
          <span>Cancel Appointment</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
