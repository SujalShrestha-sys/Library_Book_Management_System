import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

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

export const getLibrarianProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)

        const user = await User.findById(userId).select("-password").select("-role");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        console.log("User: ", user)

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message,
        });
    }
};




export const updateLibrarianProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        //If user wants to change password, validate old password
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ success: false, message: "Old password required" });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Old password is incorrect" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message,
        });
    }
};
