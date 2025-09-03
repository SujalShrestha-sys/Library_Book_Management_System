import React, { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import { quickBorrowedList } from "../../services/borrowServices";

const ActiveBorrowedBooks = () => {
  const [borrowed, setBorrowed] = useState([]);

  const fetchBorrowed = async () => {
    try {
      const res = await quickBorrowedList();
      const active = res.data.records.filter(
        (r) => !r.isReturned && r.status === "Approved"
      );
      setBorrowed(active);
    } catch (err) {
      console.error("Error fetching borrowed books", err);
    }
  };

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const genreBadgeColor = (genre) => {
    switch (genre) {
      case "fiction":
        return "bg-purple-100 text-purple-800";
      case "science":
        return "bg-blue-100 text-blue-800";
      case "Lifestyle & Habits":
        return "bg-yellow-100 text-yellow-800";
      case "Design":
        return "bg-pink-100 text-pink-800";
      case "fantasy":
        return "bg-indigo-100 text-indigo-800";
      case "Business":
        return "bg-teal-100 text-teal-800";
      case "Financial":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="w-5 h-5 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Active Borrowed Books
              </h2>
              <p className="text-sm text-gray-500">
                Books currently borrowed by users
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  Borrower
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  Email
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  Book
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  Genre
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowed.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center">
                    {b.user?.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 text-center">
                    {b.user?.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                    {b.book?.title}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${genreBadgeColor(
                        b.book?.genre
                      )}`}
                    >
                      {b.book?.genre || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">
                    {new Date(b.borrowDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium text-center ${
                      isOverdue(b.dueDate)
                        ? "text-red-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {new Date(b.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {borrowed.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No active borrowed books
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveBorrowedBooks;
