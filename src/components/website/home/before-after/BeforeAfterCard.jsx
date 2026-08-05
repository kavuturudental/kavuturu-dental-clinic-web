// src/components/home/before-after/BeforeAfterCard.jsx

import React from "react";

const BeforeAfterCard = ({ caseItem }) => {
  const treatmentName = caseItem?.treatmentName || caseItem?.treatment || "Dental Transformation";

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(14,42,109,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(14,42,109,0.1)]">
      {/* Images Side by Side */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Before */}
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Before
            </span>
            <div className="flex h-36 sm:h-40 w-full items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50/80 p-2">
              <img
                src={caseItem.beforeImage}
                alt={`${treatmentName} Before`}
                loading="lazy"
                className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* After */}
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              After
            </span>
            <div className="flex h-36 sm:h-40 w-full items-center justify-center rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-2">
              <img
                src={caseItem.afterImage}
                alt={`${treatmentName} After`}
                loading="lazy"
                className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Title */}
      <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/60 text-center">
        <h3 className="text-base font-bold text-[#0E2A6D] font-outfit line-clamp-1">
          {treatmentName}
        </h3>
      </div>
    </div>
  );
};

export default BeforeAfterCard;