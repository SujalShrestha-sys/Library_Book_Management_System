// src/components/BorrowerManageBooks/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search books, authors, categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
