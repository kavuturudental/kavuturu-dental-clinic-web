// src/components/blogs/BlogsHero.jsx

import React from "react";
import { BookOpen } from "lucide-react";
import BlogsHeroIllustration from "./BlogsHeroIllustration";

const BlogsHero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-16">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-sky-50/50 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-emerald-50/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Left Column (Content) */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Dental Blog
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
              Dental Health <br />
              <span className="text-[#0E2A6D]">Blog & Articles</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Read our latest articles, expert tips, and clinical insights written by our dental specialists to keep your family's smiles healthy and bright.
            </p>
          </div>

          {/* Right Column (Illustration) */}
          <div>
            <BlogsHeroIllustration />
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlogsHero;
