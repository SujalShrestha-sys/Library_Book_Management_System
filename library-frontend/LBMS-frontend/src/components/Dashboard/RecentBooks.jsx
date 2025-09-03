import React, { useEffect, useState } from "react";
import { Book, Briefcase, Code, Theater, Cpu, Wallet, Palette, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNewReleases } from "../../services/bookServices";

const RecentBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await getNewReleases();
        setBooks(res.data.data || []);
      } catch (err) {
        console.error("Error fetching recent books:", err);
      }
    };
    fetchRecent();
  }, []);

  const getStatusDisplay = (book) =>
    book.available === 0 ? (
      <span className="text-red-500 text-xs font-medium">Out of stock</span>
    ) : (
      <span className="text-green-600 text-xs font-medium">
        {book.available} available
      </span>
    );

  const categoryIcons = {
    Business: Briefcase,
    Programming: Code,
    Drama: Theater,
    Technology: Cpu,
    Financial: Wallet,
    Design: Palette,
    "Lifestyle & Habits": Heart,
  };

  // Minimal pastel colors for modern look
  const getCategoryStyle = (genre) => {
    const styles = {
      Business: "bg-blue-100 text-blue-800",
      Programming: "bg-purple-100 text-purple-800",
      Fantasy: "bg-pink-100 text-pink-800",
      Technology: "bg-green-100 text-green-800",
      Financial: "bg-amber-100 text-amber-800",
      Design: "bg-indigo-100 text-indigo-800",
      "Lifestyle & Habits": "bg-teal-100 text-teal-800",
    };
    return styles[genre] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="w-full md:w-1/2">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Books</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Explore the latest additions in our collection</p>
          </div>
          <button
            onClick={() => navigate("/manage-books")}
            className="text-gray-600 text-sm font-medium hover:text-gray-800 transition"
          >
            View All
          </button>
        </div>

        {/* Books List */}
        <div className="p-4 space-y-3">
          {books.map((book) => {
            const Icon = categoryIcons[book.genre] || Book;
            const coverImageUrl = book.coverImage
              ? `${import.meta.env.VITE_API_BASE_URL}/${book.coverImage.replace(/^\/?/, "")}`
              : null;

            return (
              <div
                key={book._id}
                onClick={() => navigate("/manage-books")}
                className="px-4 py-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
              >
                {/* Cover & Info */}
                <div className="flex items-center gap-3">
                  {coverImageUrl ? (
                    <img
                      src={coverImageUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded-md border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                      <Book className="w-5 h-5 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">{book.title}</h3>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                </div>

                {/* Status & Genre */}
                <div className="flex flex-col items-end gap-1">
                  {getStatusDisplay(book)}
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md ${getCategoryStyle(book.genre)}`}
                  >
                    <Icon className="w-3 h-3" />
                    {book.genre || "General"}
                  </span>
                </div>
              </div>
            );
          })}

          {books.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Book size={20} className="text-gray-400" />
                </div>
                <p className="text-xl font-medium">No recent books</p>
                <p className="text-md">Books will appear here when added</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentBooks;
