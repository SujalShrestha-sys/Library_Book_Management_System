import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Replied", "Resolved"],
        default: "Pending"
    },
    reply: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    repliedAt: {
        type: Date
    }
},
    { timestamps: true })

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;