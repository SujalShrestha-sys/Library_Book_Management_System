import React, { useEffect, useState } from "react";
import { getMyBooks } from "../services/bookServices";
import { renewBook, returnBook } from "../services/borrower";
import { RotateCcw, CornerUpLeft, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";

const SearchBar = ({ search, setSearch, status, setStatus }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
    {/* Search Input */}
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search books, authors..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      />
    </div>

    {/* Status Filter */}
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="All">All</option>
        <option value="Approved">Approved</option>
        <option value="Returned">Returned</option>
        <option value="Overdue">Overdue</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  </div>
);

const MyBooksTable = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 5;

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getMyBooks();
      setBooks(res.data.borrows || []);
    } catch (error) {
      console.error("Error fetching my books:", error);
      toast.error("Failed to load your books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleReturn = async (borrowId) => {
    try {
      await returnBook(borrowId);
      setBooks((prev) =>
        prev.map((b) => (b._id === borrowId ? { ...b, status: "Returned" } : b))
      );
      toast.success("Book Returned Successfully!");
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return the book.");
    }
  };

  const handleRenew = async (borrowId) => {
    try {
      await renewBook(borrowId);
      setBooks((prev) =>
        prev.map((b) =>
          b._id === borrowId ? { ...b, renewCount: (b.renewCount || 0) + 1 } : b
        )
      );
      toast.success("Book Renewed Successfully!");
    } catch (error) {
      console.error("Error renewing book:", error);
      toast.error("Failed to renew the book.");
    }
  };

  const filteredBooks = books.filter((borrow) => {
    const matchesSearch =
      borrow.book?.title.toLowerCase().includes(search.toLowerCase()) ||
      borrow.book?.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      status === "All" || borrow.status.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return "text-gray-400";
    const today = new Date();
    const due = new Date(dueDate);
    const diff = (due - today) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "text-red-600 font-semibold";
    if (diff <= 3) return "text-orange-500 font-medium";
    return "text-blue-600";
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-4">
      <SearchBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      ) : (
        <table className="table-fixed w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 text-base tracking-wide">
              <th className="px-6 py-4 font-semibold w-[25%]">Book</th>
              <th className="px-6 py-4 font-semibold w-[12%]">Borrowed</th>
              <th className="px-6 py-4 font-semibold w-[12%]">Due Date</th>
              <th className="px-6 py-4 font-semibold w-[10%]">Renewed</th>
              <th className="px-6 py-4 font-semibold w-[12%]">Status</th>
              <th className="px-6 py-4 text-center font-semibold w-[20%]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentBooks.length > 0 ? (
              currentBooks.map((borrow, index) => (
                <tr
                  key={borrow._id}
                  className={`hover:shadow-md transition duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-2 py-3 flex items-center gap-3">
                    <img
                      src={
                        borrow.book?.coverImage
                          ? `${import.meta.env.VITE_API_BASE_URL}${
                              borrow.book.coverImage
                            }`
                          : "/images/default-book.png"
                      }
                      alt={borrow.book?.title}
                      className="w-12 h-16 rounded-md object-cover border border-gray-200 shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-base">
                        {borrow.book?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {borrow.book?.author}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-6 py-3 ${getDueDateStyle(borrow.dueDate)}`}
                  >
                    {borrow.dueDate
                      ? new Date(borrow.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className=" py-3 text-center font-semibold text-indigo-600">
                    {borrow.renewCount ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border ${
                        borrow.status === "Returned"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : borrow.status === "Overdue"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : borrow.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : borrow.status === "Rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {borrow.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      {borrow.status === "Approved" && (
                        <>
                          <button
                            onClick={() => handleRenew(borrow._id)}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105 transition"
                          >
                            <RotateCcw size={16} /> Renew
                          </button>
                          <button
                            onClick={() => handleReturn(borrow._id)}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105 transition"
                          >
                            <CornerUpLeft size={16} /> Return
                          </button>
                        </>
                      )}
                      {borrow.status === "Pending" && (
                        <span className="px-4 py-1.5 text-sm font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg">
                          Book Pending
                        </span>
                      )}
                      {borrow.status === "Returned" && (
                        <span className="px-4 py-1.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg">
                          Book Returned
                        </span>
                      )}
                      {borrow.status === "Rejected" && (
                        <span className="px-4 py-1.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg">
                          Book Rejected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No matching books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {filteredBooks.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-6 py-2 bg-gray-50 rounded-lg">
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

export default MyBooksTable;
