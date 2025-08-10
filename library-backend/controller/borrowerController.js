import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";

export const getBorrowerStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const borrowedCount = await Borrow.countDocuments({
            user: userId,
            returnDate: null,
        })

        const returnedCount = await Borrow.countDocuments({
            user: userId,
            returnDate: { $ne: null },
        })

        const dueSoonCount = await Borrow.countDocuments({
            user: userId,
            returnDate: null,
            dueDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } //3 days from now
        })

        res.status(200).json({
            success: true,
            borrowed: borrowedCount,
            returned: returnedCount,
            dueSoon: dueSoonCount

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching borrower stats"
        })

    }
}


export const getMyBooks = async (req, res) => {
    try {
        const userId = req.user.id;

        const borrows = await Borrow.find({ user: userId }).populate("book", "title, author, isbn").sort({ borrowDate: -1 });

        res.json(borrows)
    } catch (error) {
        res.status(500).json({
            message: "error fetching my books"
        })
    }
}