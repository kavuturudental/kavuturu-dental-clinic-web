import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 select-none">
      <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-[#0E2A6D] animate-spin mb-3"></div>
      <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Loading...</p>
    </div>
  );
};

export default Loading;
