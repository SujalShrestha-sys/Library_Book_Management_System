import React from "react";
import BookCard from "./BookCard";

const BookGrid = ({ books, onBorrow }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {books && books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book._id}
            book={{
              ...book,
              coverImage: book.coverImage
                ? `${import.meta.env.VITE_API_BASE_URL}${book.coverImage}`
                : "https://via.placeholder.com/200x300",
            }}
            onBorrow={onBorrow}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No books available
        </p>
      )}
    </div>
  );
};

export default BookGrid;
