// src/hooks/useSearch.js

import { useState, useMemo } from "react";

export function useSearch(data = [], searchKeys = ["name"]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = item[key];
        return val && String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData
  };
}

export default useSearch;
