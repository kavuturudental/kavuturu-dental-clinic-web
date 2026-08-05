// src/components/blogs/BlogCard.jsx

import { CalendarDays, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({
  slug,
  image,
  category,
  title,
  excerpt,
  date,
  readTime,
  author,
  authorImage,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blogs/${slug}`);
  };

  return (
    <article
      onClick={handleClick}
      className="group flex h-full max-w-md mx-auto w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(14,42,109,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(14,42,109,0.1)] focus:outline-none focus:ring-2 focus:ring-sky-500"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {/* Blog Image - Full 16:9 size image aspect ratio */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4.5 sm:p-5">
        {/* Category + Date */}
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            {category}
          </span>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <CalendarDays size={14} />
            <span>{date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-[#0E2A6D]">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-600">
          {excerpt}
        </p>

        {/* Author Details with Profile Icon Badge (No Image) */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] border border-[#0E2A6D]/20 flex items-center justify-center shrink-0">
              <User size={13} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                {author}
              </p>
              <p className="text-[10px] text-slate-500">
                {readTime}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#0E2A6D]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 group-hover:bg-[#0E2A6D] group-hover:text-white group-hover:border-[#0E2A6D] group-hover:shadow-md">
            <span>Read More</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;