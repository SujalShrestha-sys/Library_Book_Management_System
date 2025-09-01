import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"

export const getBorrowerStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const borrowedCount = await Borrow.countDocuments({
            user: userId,
            status: { $in: ["Approved", "borrowed"] },
            returnDate: null,
        })

        const returnedCount = await Borrow.countDocuments({
            user: userId,
            status: "Returned"
        })

        const dueSoonCount = await Borrow.countDocuments({
            user: userId,
            status: { $in: ["Approved", "Borrowed"] },
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

        const borrows = await Borrow.find({ user: userId }).populate("book", "title author isbn coverImage").sort({ borrowDate: -1 });

        res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            borrows,
        }
        )

    } catch (error) {
        res.status(500).json({
            message: "error fetching my books"
        })
    }
}

//update borrower profile
export const updateBorrowerProfile = async (req, res) => {

    try {

        const userId = req.user.id;
        const { name, email, newPassword } = req.body;

        const updateFields = {};

        if (name) {
            updateFields.name = name;
        }

        if (email) {
            updateFields.email = email;
        }

        if (newPassword) {
            const salt = await bcrypt.genSalt(10); //genSalt(10) → Creates a unique cryptographic salt.
            updateFields.password = await bcrypt.hash(newPassword, salt) //hash → Converts the plain password into a secure hash.
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password")

        console.log(updatedUser)


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
}

export const getBorrowerProfile = async (req, res) => {
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
