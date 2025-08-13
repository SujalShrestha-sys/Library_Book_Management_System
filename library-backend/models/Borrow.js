// models/borrow.js
import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Borrowed", "Returned", "Overdue"],
        default: "Pending"
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    dueDate:{
        type: Date,
        required:false
    },
    renewCount : {
        type : Number,
        default : 0,
    }
},
    { timestamps: true });

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
