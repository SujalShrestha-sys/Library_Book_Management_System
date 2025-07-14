import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

//Borrow a book

export const borrowBook = async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user?.id;
    console.log("🚀 Book ID from params:", bookId);
    console.log("👤 User ID from token:", userId);

    try {
        const book = await Book.findById(bookId);
        console.log(book);

        if (!book || book.quantity < 0) {
            return res.status(404).json({
                success: false,
                message: "Book not available"
            });
        }

        const borrowBook = new Borrow({
            user: userId,
            book: bookId
        })

        const savedBorrowBook = await borrowBook.save();

        //decrease availabe quantity 
        book.quantity -= 1;
        await book.save();


        res.status(201).json({
            message: "Book borrowed successfully",
            savedBorrowBook
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Error borrowing book",
            error: error.message
        });

    }
}

//Return a book
export const returnBook = async (req, res) => {
    const { borrowId } = req.params;

    try {
        //The populate() method replaces the referenced ObjectId in a document with the actual document from the referenced collection.
        const borrow = await Borrow.findById(borrowId).populate("book");

        if (!borrow || borrow.returnDate) {
            return res.status(404).json({
                success: false,
                message: "Invalid borrow record or already returned"
            });
        }

        borrow.returnDate = new Date();
        await borrow.save();

        // Increase book quantity back
        borrow.book.quantity += 1;
        const updatedBook = await borrow.book.save();

        return res.status(200).json({
            message: "Book returned successfully",
            updatedBook
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Error returning book",
            error: error.message
        });
    }
}

// View borrower's own borrow history
export const getMyBorrowHistory = async (req, res) => {
    try {
        const records = await Borrow.find({ user: req.user.id }).populate("book");
        res.status(200).json({
            success: true,
            records
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching history",
            error: err.message
        });
    }
};

// Librarian views all borrow records
export const getAllBorrowRecords = async (req, res) => {
    try {
        const records = await Borrow.find().populate("book").populate("user");
        res.status(200).json({
            success: true,
            records
        });
    } catch (error) {
        console.log(err)
        res.status(500).json({
            message: "Error fetching records",
            error: error.message
        });
    }
};