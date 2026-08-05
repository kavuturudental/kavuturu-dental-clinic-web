// src/components/blogs/BlogSearch.jsx

import { Search } from "lucide-react";

const BlogSearch = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={20} />
        </span>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title or keyword..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {/* Categories filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
            selectedCategory === "All"
              ? "bg-[#0E2A6D] text-white shadow-md cursor-pointer"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
          }`}
        >
          All Articles
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              selectedCategory === category
                ? "bg-[#0E2A6D] text-white shadow-md cursor-pointer"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogSearch;
