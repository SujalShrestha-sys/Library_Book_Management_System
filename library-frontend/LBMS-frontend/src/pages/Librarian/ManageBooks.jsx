import React, { useEffect, useState } from "react";
import StatsCard from "../../components/Dashboard/StatsCard";
import ManageBooksTable from "../../components/manageBooks/ManageBooksTable";
import EditBook from "../../components/manageBooks/EditBook";
import DeleteBook from "../../components/manageBooks/DeleteBook";
import { BookOpen, Copy, Layers, Search, BookOpenText } from "lucide-react";
import {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
} from "../../services/bookServices";
import { toast } from "react-toastify";

const ManageBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getAllBooks();
      setBooks(res?.data?.allBooks || []);
    } catch (error) {
      console.error("Failed to fetch books", error);
      toast.error("Failed to fetch books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Book actions
  const handleAddBookClick = () => {
    setCurrentBook(null);
    setEditing(false);
    setShowAddModal(true);
  };

  const handleEditBookClick = (book) => {
    setCurrentBook(book);
    setEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteBookClick = (book) => {
    setCurrentBook(book);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (currentBook?._id) {
        await deleteBook(currentBook._id);
        setBooks((prev) => prev.filter((b) => b._id !== currentBook._id));
        toast.success("Book deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete book", err);
      toast.error("Failed to delete book.");
    } finally {
      setShowDeleteModal(false);
      setCurrentBook(null);
    }
  };

  const handleSaveBook = async (bookData, editing) => {
    try {
      if (editing && currentBook?._id) {
        await updateBook(currentBook._id, bookData);
        toast.success("Book updated successfully!");
      } else {
        await createBook(bookData);
        toast.success("Book added successfully!");
      }

      await fetchBooks();
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to save book", error);
      toast.error("Failed to save book.");
    }
  };

  // Calculate stats
  const totalBooks = books.length;
  const availableCopies = books.reduce(
    (sum, book) => sum + (book?.available || 0),
    0
  );
  const categoriesCount = new Set(
    books.map((book) => book?.genre).filter(Boolean)
  ).size;

  // Get unique genres for filter dropdown
  const uniqueGenres = [
    ...new Set(books.map((book) => book?.genre).filter(Boolean)),
  ];

  if (loading) {
    return <p className="text-center py-10">Loading books...</p>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="bg-gray-50 flex-1 overflow-y-auto">
        {/* Header */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Books</h2>
            <p className="text-gray-600">
              Add, edit, and organize your library's book collection
            </p>
          </div>
          <button
            onClick={handleAddBookClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            Add New Book
          </button>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Books"
            value={totalBooks}
            subtitle="All books count"
            icon={BookOpen}
            color="bg-blue-100"
          />
          <StatsCard
            title="Available Copies"
            value={availableCopies}
            subtitle="Currently in stock"
            icon={Copy}
            color="bg-green-100"
          />
          <StatsCard
            title="Categories"
            value={categoriesCount}
            subtitle="Book genres"
            icon={Layers}
            color="bg-purple-100"
          />
        </div>

        {/* Books List Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BookOpenText size={22} className="text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Books List
                </h3>
                <p className="text-sm text-gray-600">
                  Browse and manage all books in your library
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="All">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ManageBooksTable
            books={books}
            searchQuery={searchQuery}
            filter={filter}
            onEditBook={handleEditBookClick}
            onDeleteBook={handleDeleteBookClick}
          />
        </section>
      </main>

      {/* Modals */}
      <EditBook
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        book={currentBook}
        isEditing={isEditing}
        onSave={handleSaveBook}
      />

      <DeleteBook
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        book={currentBook}
      />
    </div>
  );
};

export default ManageBooks;
