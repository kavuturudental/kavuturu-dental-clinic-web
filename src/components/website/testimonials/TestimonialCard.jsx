// src/components/website/testimonials/TestimonialCard.jsx

import React, { useState } from "react";
import { Star, Quote, Calendar, ChevronRight, ChevronUp, CheckCircle2 } from "lucide-react";

const MAX_CHAR_LIMIT = 220;

const TestimonialCard = ({
  name,
  patientName,
  rating = 5,
  text,
  comment,
  reviewDate,
  avatar,
  photo,
  className = ""
}) => {
  const reviewerName = patientName || name || "Valued Patient";
  const reviewComment = comment || text || "";
  const numRating = Number(rating) || 5;

  const [isExpanded, setIsExpanded] = useState(false);
  const isLongComment = reviewComment.length > MAX_CHAR_LIMIT;

  return (
    <article
      className={`
        relative
        flex
        h-[290px]
        flex-col
        justify-between
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200/80
        bg-white
        p-6
        shadow-[0_8px_30px_rgba(14,42,109,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-sky-300
        hover:shadow-[0_20px_45px_rgba(14,42,109,0.11)]
        ${className ? className : "w-[280px] sm:w-[320px] md:w-[350px] shrink-0"}
      `}
    >
      {/* Subtle Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0E2A6D] via-[#1E40AF] to-emerald-500 rounded-t-[26px]" />

      {/* Standard Truncated Card View */}
      <div className="pt-1">
        {/* Header Row: Avatar/Initial -> Name & Stars -> Quote Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {photo || avatar ? (
              <img
                src={photo || avatar}
                alt={reviewerName}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0E2A6D] to-[#16398b] text-white flex items-center justify-center font-black text-base shadow-xs shrink-0 tracking-tight">
                {reviewerName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 truncate tracking-tight">
                {reviewerName}
              </h3>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[...Array(numRating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.3)]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 shrink-0">
            <Quote className="h-4.5 w-4.5 text-[#0E2A6D]/40 rotate-180" />
          </div>
        </div>

        {/* Truncated Review Text */}
        <div className="mt-4">
          <p className={`text-xs sm:text-[13px] font-medium leading-relaxed text-slate-600 ${isLongComment ? "line-clamp-3" : ""}`}>
            "{reviewComment}"
          </p>

          {/* Read More Trigger Link */}
          {isLongComment && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="mt-2 text-[12px] font-bold text-sky-600 hover:text-[#0E2A6D] cursor-pointer inline-flex items-center gap-1 transition-all select-none group"
            >
              <span className="group-hover:underline">Read More</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card Footer: Verified Badge & Review Date */}
      <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/60">
          <svg
            className="h-3.5 w-3.5 flex-shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
            Verified Patient
          </span>
        </div>

        {reviewDate && (
          <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {reviewDate}
          </span>
        )}
      </div>

      {/* In-Card Absolute Full Review Overlay */}
      {isExpanded && (
        <div className="absolute inset-0 z-20 bg-white rounded-[26px] border-2 border-sky-400 p-5 shadow-2xl flex flex-col justify-between animate-fade-in">
          {/* Subtle Top Accent Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0E2A6D] via-[#1E40AF] to-emerald-500 rounded-t-[24px]" />

          {/* Overlay Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              {photo || avatar ? (
                <img
                  src={photo || avatar}
                  alt={reviewerName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0E2A6D] to-[#16398b] text-white flex items-center justify-center font-black text-xs shrink-0">
                  {reviewerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1">
                  <span>{reviewerName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </h4>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(numRating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-sky-200 shrink-0"
            >
              <span>Read Less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable Full Text Body */}
          <div className="my-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <p className="text-xs font-medium leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              "{reviewComment}"
            </p>
          </div>

          {/* Overlay Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <span>🟢</span> Verified Review
            </span>

            {reviewDate && (
              <span className="text-[10px] font-medium text-slate-400">
                {reviewDate}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default TestimonialCard;
