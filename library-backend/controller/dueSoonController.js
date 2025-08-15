import Borrow from "../models/Borrow.js";

/* export const getDueSoonBooks = async (req, res) => {
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
}  */

    export const getDueSoonBooks = async (req, res) => {
    try {
        const userId = req.user.role === "borrower" ? req.user.id : req.params.userId;
        
        // Get today's date at midnight (start of day)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        // Get today's date at 23:59:59 (end of day)
        const todayEnd = new Date();
        todayEnd.setDate(todayEnd.getDate())

        // Find borrow records due today
        const dueTodayBooks = await Borrow.find({
            user: userId,
            status: "Approved",
            isReturned: false,
            dueDate: { $gte: todayStart, $lte: todayEnd }
        }).populate("book");

        res.status(200).json({
            success: true,
            count: dueTodayBooks.length,
            dueTodayBooks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching due today books",
            error: error.message
        });
    }
}
