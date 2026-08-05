// src/components/blogs/ArticleHero.jsx

import React from "react";
import { User } from "lucide-react";

const ArticleHero = ({ article }) => {
  const authorName = typeof article?.author === "object" ? article.author.name : (article?.author || "Dr. Ravindra Babu");
  const authorImage = typeof article?.author === "object" ? article.author.image : "/assets/dr-ravindra-babu.webp";
  const authorRole = typeof article?.author === "object" ? (article.author.role || "Chief Dental Surgeon") : "Chief Dental Surgeon";
  const articleCategory = article?.category || "Dental Care";
  
  let formattedDate = article?.date;
  if (!formattedDate && (article?.blogDate || article?.createdAt)) {
    formattedDate = new Date(article.blogDate || article.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  const readTime = article?.readTime || "5 min read";

  return (
    <header className="bg-white pt-12 lg:pt-16 pb-6">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        {/* Category, Date & Read Time */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {articleCategory}
          </span>

          <span className="text-sm font-medium text-slate-500">{formattedDate}</span>
          <span className="text-slate-300" aria-hidden="true">•</span>
          <span className="text-sm font-medium text-slate-500">{readTime}</span>
        </div>

        {/* Title */}
        <h1 className="mt-6 font-outfit text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl leading-tight">
          {article?.title}
        </h1>

        {/* Author Details with Profile Icon Badge (No Image) */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] border border-[#0E2A6D]/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {authorName}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {authorRole}
            </p>
          </div>
        </div>

        {/* Main Featured Image */}
        <div className="mt-12 overflow-hidden rounded-[24px] border border-slate-200/60 shadow-md">
          <img
            src={article?.image}
            alt={article?.title}
            className="w-full h-auto object-cover max-h-[480px]"
            loading="eager"
          />
        </div>
      </div>
    </header>
  );
};

export default ArticleHero;
