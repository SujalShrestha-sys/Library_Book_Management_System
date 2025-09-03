// src/components/BorrowerDashboard/RecommendedBooks.jsx
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getRecommendedBooks } from "../../services/bookServices";
import { toast } from "react-toastify";

const genreColors = {
  Technology: "bg-blue-100 text-blue-700",
  Business: "bg-green-100 text-green-700",
  Programming: "bg-purple-100 text-purple-700",
  Horror: "bg-red-100 text-red-700",
  Design: "bg-pink-100 text-pink-700",
  Financial: "bg-yellow-100 text-yellow-700",
  "Lifestyle & Habits": "bg-orange-100 text-orange-700",
  Default: "bg-gray-100 text-gray-700",
};

const availabilityColors = (available) => {
  if (available === 0) return "bg-red-50 text-red-700";
  if (available <= 2) return "bg-yellow-50 text-yellow-700";
  return "bg-green-50 text-green-700";
};

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await getRecommendedBooks();
        setBooks(res.data.data || []);
      } catch (error) {
        console.error("Error fetching recommended books:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch recommended books. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const displayedBooks = showAll ? books : books.slice(0, 4);

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-md p-6 w-full max-w-full">
        <p className="text-gray-500">Loading recommendations...</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-6 w-full max-w-full">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-1">
        <Star className="text-yellow-500 w-6 h-6" />
        <h2 className="text-xl font-semibold text-gray-800">
          Recommended for You
        </h2>
      </div>

      {/* Subheading */}
      <p className="text-gray-500 text-sm mb-6">
        Books tailored to your interests and reading history.
      </p>

      {/* Grid Layout */}
      {books.length === 0 ? (
        <p className="text-gray-500 text-sm">No recommendations available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-transform hover:scale-105 flex flex-col"
            >
              <img
                src={
                  book.coverImage
                    ? `${import.meta.env.VITE_API_BASE_URL}${book.coverImage}`
                    : "https://via.placeholder.com/200x300"
                }
                alt={book.title}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h3 className="font-semibold text-gray-800 truncate mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{book.author}</p>
              {book.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {book.description}
                </p>
              )}

              <div className="flex justify-between items-center text-sm mt-auto">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    genreColors[book.genre] || genreColors.Default
                  }`}
                >
                  {book.genre || "N/A"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${availabilityColors(
                    book.available
                  )}`}
                >
                  {book.available}/{book.quantity} available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View More Button */}
      {books.length > 4 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-full transition"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default RecommendedBooks;
