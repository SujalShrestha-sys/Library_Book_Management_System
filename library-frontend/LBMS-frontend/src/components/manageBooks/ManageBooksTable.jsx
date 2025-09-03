import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ManageBooksTable = ({
  books,
  searchQuery,
  filter,
  onEditBook,
  onDeleteBook,
}) => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Apply search + filter
  useEffect(() => {
    let results = books ? books.filter((book) => book != null) : [];

    if (filter !== "All") {
      results = results.filter(
        (book) => book.genre?.toLowerCase() === filter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      results = results.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.genre || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          book.publisher?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(results);
    setCurrentPage(1); // reset to first page when filters change
  }, [searchQuery, filter, books]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 text-sm tracking-wider">
            <th className="px-6 py-4 font-semibold">Title</th>
            <th className="px-6 py-4 font-semibold">ISBN</th>
            <th className="px-6 py-4 font-semibold">Author</th>
            <th className="px-6 py-4 font-semibold">Publisher</th>
            <th className="px-6 py-4 font-semibold">Genre</th>
            <th className="px-6 py-4 text-center font-semibold">Available</th>
            <th className="px-6 py-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paginatedBooks
            .filter((book) => book)
            .map((book, idx) => (
              <tr
                key={book._id}
                className={`hover:shadow-md transition duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {book.title}
                </td>
                <td className="px-6 py-4">{book.isbn}</td>
                <td className="px-6 py-4">{book.author}</td>
                <td className="px-6 py-4">{book.publisher}</td>
                <td className="px-6 py-4">{book.genre}</td>
                <td className="px-6 py-4 text-center font-semibold text-blue-600">
                  {book.available} / {book.quantity}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-3">
                  <button
                    aria-label={`View ${book.title}`}
                    className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEditBook(book)}
                    aria-label={`Edit ${book.title}`}
                    className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteBook(book)}
                    aria-label={`Delete ${book.title}`}
                    className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

          {filteredBooks.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No matching books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {filteredBooks.length > 0 && (
        <div className="flex justify-between items-center px-6 py-2 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooksTable;
