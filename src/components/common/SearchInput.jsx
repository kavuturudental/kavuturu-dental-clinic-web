// src/components/common/SearchInput.jsx

import React from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

export const SearchInput = ({ value, onChange, placeholder = "Search...", className }) => {
  return (
    <div className={clsx("relative w-full sm:w-72", className)}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white transition-all"
      />
    </div>
  );
};

export default SearchInput;
