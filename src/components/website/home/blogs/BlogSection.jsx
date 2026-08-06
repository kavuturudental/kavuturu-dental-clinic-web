// src/components/blogs/BlogSection.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import BlogCard from "./BlogCard";
import staticBlogData from "../../../../data/blogs/blogsData";
import { getBlogs } from "../../../../services/website/blogService";

const BlogSection = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageBlogs = async () => {
      try {
        const response = await getBlogs({ homepage: "true" });
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setBlogsList(response.data);
        } else {
          setBlogsList(staticBlogData.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load homepage blogs:", err);
        setBlogsList(staticBlogData.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageBlogs();
  }, []);

  const displayBlogs = blogsList.length > 0 ? blogsList : staticBlogData.slice(0, 3);

  // If DB returns 0 blogs and not loading, render null
  if (!loading && displayBlogs.length === 0) {
    return null;
  }

  // Dynamic alignment layout based on count of published blogs
  const getLayoutClass = (count) => {
    if (count === 1) {
      return "mt-8 mx-auto max-w-md grid grid-cols-1 justify-center items-stretch gap-8";
    }
    if (count === 2) {
      return "mt-8 mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 justify-center items-stretch gap-8";
    }
    return "mt-8 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch gap-8";
  };

  return (
    <section id="blogs" className="relative overflow-hidden bg-[#FCFCFD] py-12 sm:py-16 lg:py-20">
      {/* Background Blur */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Clinic Showcase design */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Latest Articles
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit">
            Expert Tips for a <span className="text-[#0E2A6D]">Healthier Smile</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Stay informed with expert advice, treatment guides, oral hygiene tips, and updates from Kavuturu Dental Clinic.
          </p>
        </div>

        {/* Dynamic Grid Alignment based on 1, 2, or 3 blogs */}
        <div className={getLayoutClass(displayBlogs.length)}>
          {displayBlogs.map((blog) => (
            <BlogCard
              key={blog._id || blog.id || blog.slug}
              slug={blog.slug}
              image={blog.image}
              category={blog.category || "Dental Care"}
              title={blog.title}
              excerpt={blog.summary || blog.excerpt}
              date={new Date(blog.blogDate || blog.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              readTime={blog.readTime || "5 min read"}
              author={blog.author?.name || "Dr. Ravindra Babu"}
              authorImage={blog.author?.image || "/assets/dr-ravindra-babu.webp"}
            />
          ))}
        </div>

        {/* Section Bottom CTA (View All Blogs) */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer"
          >
            <span>View All Blogs</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;