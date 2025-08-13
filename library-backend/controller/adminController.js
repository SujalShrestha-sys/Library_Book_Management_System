import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";

export const getAdminStatistics = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalLibrarians = await User.countDocuments({ role: "librarian" })
        const totalBorrowers = await User.countDocuments({ role: "borrower" });
        const totalBorrows = await Borrow.countDocuments();

        // Count only currently borrowed (not returned yet)
        const currentlyBorrowed = await Borrow.countDocuments({ returnDate: null })

        const allBooks = await Book.find({}, "available");

        // Total available stock (sum of all books' available field)
        const totalAvailableBooks = allBooks.reduce((accumulator, book) => {
            return acc + book.available
        })

        res.status(200).json({
            totalBooks,
            totalUsers,
            totalLibrarians,
            totalBorrowers,
            totalBorrows,
            currentlyBorrowed,
            totalAvailableBooks
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats"
        });
    }
};
