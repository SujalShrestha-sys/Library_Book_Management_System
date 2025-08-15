import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getAdminStatistics = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments()
        const totalLibrarians = await User.countDocuments({ role: "librarian" })
        const totalBorrowers = await User.countDocuments({ role: "borrower" });
        const totalBorrows = await Borrow.countDocuments();

        // Count only currently borrowed (not returned yet)
        const currentlyBorrowed = await Borrow.countDocuments({
            isReturned: false,
            status: "Approved"
        })

        const allBooks = await Book.find({}, "available");
        const totalAvailableBooks = allBooks.reduce((acc, book) => acc + (book.available || 0), 0);

        const overdueBooks = await Borrow.countDocuments({
            isReturned: false,
            dueDate: { $lt: new Date() }
        });

        res.status(200).json({
            totalBooks,
            totalLibrarians,
            totalBorrowers,
            totalBorrows,
            currentlyBorrowed,
            totalAvailableBooks,
            overdueBooks
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats"
        });
    }
};

export const sendRemainderEmail = async (req, res) => {
    try {
        const borrowId = req.params.borrowId;

        const borrowRecord = await Borrow.findById(borrowId).populate("user book");

        if (!borrowRecord) {
            return res.status(404).json({
                success: false,
                message: "Borrow record not found"
            })
        }

        await sendEmail({
            to: borrowRecord.user.email,
            subject: "✅ Book Returned Successfully",
            html: ` 
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>📚 Overdue Book Reminder</h2>
        <p>Hello <strong>${borrowRecord.user.name}</strong>,</p>
        <p>This is a reminder that your borrowed book <em>"${borrowRecord.book.title}"</em> was due on 
        <strong>${borrowRecord.dueDate.toDateString()}</strong>.</p>
        <p>Please return it as soon as possible to avoid penalties.</p>
        <p>Thank you,<br/>Library Management</p>
      </div>
      `
        });

        res.json({
            success: true,
            message: "Reminder email sent successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });

    }
}
