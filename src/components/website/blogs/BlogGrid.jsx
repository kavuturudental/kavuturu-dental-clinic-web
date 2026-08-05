// src/components/blogs/BlogGrid.jsx

import React, { useState, useEffect } from "react";
import BlogCard from "../home/blogs/BlogCard";
import staticBlogData from "../../../data/blogs/blogsData";
import BlogSearch from "./BlogSearch";
import { getBlogs } from "../../../services/website/blogService";
import { Loader2 } from "lucide-react";

const BlogGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await getBlogs();
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setBlogsList(response.data);
        } else {
          setBlogsList(staticBlogData);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setBlogsList(staticBlogData);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  const displayList = blogsList.length > 0 ? blogsList : staticBlogData;

  // Get unique categories
  const categories = [...new Set(displayList.map((blog) => blog.category || "Dental Care"))];

  // Filter logic
  const filteredBlogs = displayList.filter((blog) => {
    const titleText = blog.title || "";
    const summaryText = blog.summary || blog.excerpt || "";
    const categoryText = blog.category || "Dental Care";

    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summaryText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || categoryText === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="articles-section" className="bg-white py-12 pb-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Search and Category Filter */}
        <div className="mb-12">
          <BlogSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        </div>

        {/* Grid of cards */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
            <span className="text-xs font-semibold">Loading articles...</span>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
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
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-bold text-slate-800">
              No articles found
            </h3>
            <p className="mt-2 text-slate-500">
              Try adjusting your search keywords or selecting another category.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default BlogGrid;
