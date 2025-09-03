// controllers/contactController.js
import ContactMessage from "../models/ContactMessage.js";

export const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newMessage = new ContactMessage({ name, email, subject, status: "Pending", message });
        const savedMessage = await newMessage.save();

        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            data: savedMessage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Message fetched successfully.",
            data: messages
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMessageById = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        console.log(message)

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
                data: message
            })
        };
        res.json(message);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const replyToMessage = async (req, res) => {
    try {
        const { reply } = req.body;
        const message = await ContactMessage.findById(req.params.id);
        if (!message) return res.status(404).json({
            message: "Message not found"
        });

        message.reply = reply;
        message.status = "Replied";
        message.repliedAt = Date.now();

        await message.save();
        res.json({
            success: true,
            message: "Reply sent successfully",
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyStats = async (req, res) => {
    try {

        const total = await ContactMessage.countDocuments({});
        const pending = await ContactMessage.countDocuments({ status: "Pending" });
        const replied = await ContactMessage.countDocuments({ status: "Replied" });
        const resolved = await ContactMessage.countDocuments({ status: "Resolved" });

        res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            total,
            pending,
            replied,
            resolved
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const resolveMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (!message) return res.status(404).json({
            success: false,
            message: "Message not found"
        });

        message.status = "Resolved";
        message.resolvedAt = Date.now();
        await message.save();

        res.json({
            success: true,
            message: "Message marked as resolved",
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};