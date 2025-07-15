import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";

//Borrow a book
export const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user?.id;
        console.log("Book ID from params:", bookId);
        console.log("User ID from token:", userId);

        const book = await Book.findById(bookId);
        console.log(book);
        const user = await User.findById(userId);

        if (!user || !user.email) {
            console.log(" User not found or email missing:", user);
            return res.status(400).json({
                success: false,
                message: "User email not available for sending confirmation."
            });
        }

        if (!book || book.quantity <= 0) {
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

        await sendEmail({
            to: user.email,
            subject: "📚 Book Borrowed Successfully",
            html: `
            <h2>Hi ${user.name},</h2>
            <p>You have successfully borrowed <strong>${book.title}</strong> by ${book.author}.</p>
            <p>Please return it on time to avoid penalties.</p>
            <br/>
            <small>-- This is an automated message from LBMS.</small>`,
        })



        res.status(201).json({
            message: "Book borrowed successfully",
            savedBorrowBook,
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
        const borrow = await Borrow.findById(borrowId).populate("book").populate("user"); //Populate user to get name + email

        if (!borrow || borrow.returnDate) {
            return res.status(404).json({
                success: false,
                message: "Invalid borrow record or already returned"
            });
        }

        if (!borrow.user?.email) {
            console.log(" Email missing on borrow.user:", borrow.user);
            return res.status(400).json({
                success: false,
                message: "Cannot send return email — user email not found."
            });
        }

        borrow.returnDate = new Date();
        await borrow.save();

        // Increase book quantity back
        borrow.book.quantity += 1;
        const updatedBook = await borrow.book.save();

        await sendEmail({
            to: borrow.user.email,
            subject: "✅ Book Returned Successfully",
            html: `
            <h2>Hi ${borrow.user.name},</h2>
            <p>You have successfully returned <strong>${borrow.book.title}</strong> by ${borrow.book.author}.</p>
            <p>Thank you for using the Library Book Management System!</p>
            <br/>
            <small>-- This is an automated message from LBMS.</small>
      `
        });

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
    } catch (error) {
        res.status(500).json({
            message: "Error fetching history",
            error: error.message,
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
        console.log(error)
        res.status(500).json({
            message: "Error fetching records",
            error: error.message
        });
    }
};