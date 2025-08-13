import Borrow from "../models/Borrow.js";

export const getDueSoonBooks = async (req, res) => {
    try {
        const userId = req.user.role === "borrower" ? req.user.id : req.params.userId;
        console.log(userId);

        //get today's date
        const todayDate = new Date();

        // 3 days from today 
        const threeDaysLater = new Date();
        threeDaysLater.setDate(todayDate.getDate() + 3);

        //find all borrow records for this user where dueDate is within the next 3 days and book not yet returned
        const dueSoonBooks = await Borrow.find({
            user: userId,
            status: "Approved",
            isReturned: false,
            dueDate: { $gte: todayDate, $lte: threeDaysLater },
        }).populate("book");

        res.status(200).json({
            success: true,
            count: dueSoonBooks.length,
            dueSoonBooks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching due soon books",
            error: error.message
        })
    }
} 
