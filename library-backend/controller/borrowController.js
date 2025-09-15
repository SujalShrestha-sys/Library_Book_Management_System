import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";

export const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user?.id;

        const book = await Book.findById(bookId);
        const user = await User.findById(userId);

        if (!user || !user.email) {
            return res.status(400).json({ success: false, message: "User email not available" });
        }

        if (!book || book.available <= 0) {
            return res.status(404).json({ success: false, message: "Book not available" });
        }

        const borrowBook = new Borrow({ user: userId, book: bookId });
        const savedBorrowBook = await borrowBook.save();

        // decrease available quantity
        book.available -= 1;
        await book.save();

        // Send email safely
        try {
            await sendEmail({
                to: user.email,
                subject: "📚 Book Borrowed Successfully",
                html: `<h2>Hi ${user.name},</h2>
               <p>You have successfully borrowed <strong>${book.title}</strong> by ${book.author}.</p>
               <p>Please return it on time to avoid penalties.</p>
               <br/><small>-- Automated message from LBMS</small>`
            });
        } catch (emailError) {
            console.error("Failed to send borrow email:", emailError);
        }

        res.status(201).json({ message: "Book borrowed successfully", savedBorrowBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error borrowing book", error: error.message });
    }
};


export const returnBook = async (req, res) => {
    try {
        const { borrowId } = req.params;
        const borrow = await Borrow.findById(borrowId).populate("book user");

        if (!borrow) return res.status(404).json({ success: false, message: "Borrow record not found" });
        if (borrow.isReturned) return res.status(400).json({ message: "Book already returned" });

        borrow.isReturned = true;
        borrow.status = "Returned";
        borrow.returnDate = new Date();
        await borrow.save();

        // increase available quantity
        borrow.book.available += 1;
        await borrow.book.save();

        // Send email safely
        try {
            await sendEmail({
                to: borrow.user.email,
                subject: "✅ Book Returned Successfully",
                html: `<h2>Hi ${borrow.user.name},</h2>
               <p>You have successfully returned <strong>${borrow.book.title}</strong> by ${borrow.book.author}.</p>
               <br/><small>-- Automated message from LBMS</small>`
            });
        } catch (emailError) {
            console.error("Failed to send return email:", emailError);
        }

        res.status(200).json({ message: "Book returned successfully", borrow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error returning book", error: error.message });
    }
};


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
        const records = await Borrow.find({
            isReturned: false,
            status: "Approved",
        }).populate("book").populate("user");
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


export const getBorrowerDetails = async (req, res) => {
    try {
        const history = await Borrow
            .find()
            .populate("book", "title author available").populate("user", "name email")
            .sort({ borrowDate: -1 });
        console.log(history)

        const pending = history.filter((book) => book.status === "Pending");
        const active = history.filter((book) => book.status === "Approved");
        const returned = history.filter((book) => book.status === "Returned");
        const overdue = history.filter((book) => {
            book.status === "Approved" && book.dueDate && new Date(book.dueDate) < new Date();
        });

        res.status(200).json({
            success: true,
            stats: {
                totalMembers: new Set(history.map((h) => h.user?._id.toString())).size,
                activeBorrowers: active.length,
                pendingRequests: pending.length,
                overdueBooks: overdue.length,
            },
            pending,
            history
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const approveBorrowerRequest = async (req, res) => {
    try {
        const { borrowId } = req.params;
        const borrow = await Borrow.findById(borrowId).populate("book");

        if (!borrow) {
            return res.status(404).json({
                success: false,
                message: "Borrow record not found"
            })
        }

        if (borrow.status !== "Pending") {
            return res.status(400).json({
                success: "false",
                message: "only pending request can be approved"
            })
        }

        //check for book availability
        if (borrow.book.available <= 0) {
            return res.status(400).json({
                success: false,
                message: " no copies available"
            })
        }

        //update the borrow status
        borrow.status = "Approved";
        const BORROW_PERIOD_DAYS = 14
        borrow.dueDate = new Date(Date.now() + BORROW_PERIOD_DAYS * 24 * 60 * 60 * 1000)

        await borrow.save();

        //decrease available copies only
        await Book.findByIdAndUpdate(borrow.book._id, {
            $inc: { available: -1 }
        })

        res.status(200).json({
            success: true,
            message: "Borrow request approved",
            borrow
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const rejectBorrowRequest = async (req, res) => {
    try {
        const { borrowId } = req.params;

        const borrowRecord = await Borrow.findById(borrowId);

        if (!borrowRecord) {
            return res.status(404).json({
                success: false,
                message: "Borrow request not found"
            });
        }

        if (borrowRecord.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Request already processed"
            });
        }

        borrowRecord.status = "Rejected";
        await borrowRecord.save();

        res.status(200).json({
            success: true,
            message: "Borrow request rejected",
            borrowRecord
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const renewBorrow = async (req, res) => {
    try {
        const borrowId = req.params.id;
        const borrow = await Borrow.findById(borrowId);

        if (!borrow) return res.status(404).json({ success: false, message: "Borrow record not found" });
        if (borrow.isReturned) return res.status(400).json({ success: false, message: "Cannot renew returned books" });
        if (borrow.status !== "Approved") return res.status(400).json({ success: false, message: "Only approved borrows can be renewed" });

        const MAX_RENEWALS = 3;
        borrow.renewCount = borrow.renewCount || 0;

        if (borrow.renewCount >= MAX_RENEWALS) {
            return res.status(400).json({ success: false, message: "Renewal limit reached" });
        }

        const RENEW_DAYS = 7;
        borrow.dueDate = new Date(borrow.dueDate.getTime() + RENEW_DAYS * 24 * 60 * 60 * 1000);
        borrow.renewCount += 1;

        await borrow.save();
        res.status(200).json({ success: true, message: "Borrow renewed successfully", borrow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
