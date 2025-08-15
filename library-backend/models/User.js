import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["borrower", "librarian"],
        default: "borrower",
    },
    phoneNumber: {
        type : String,
        unique: true,
        sparse: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]

    }
},
    { timestamps: true }

)

const User = mongoose.model("User", userSchema);

export default User;