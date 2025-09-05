import { createMessage, getMessages, getMessageById, replyToMessage, getMyStats, resolveMessage } from "../controller/ContactController.js";
import express from "express"
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Borrower routes
router.post("/create", authenticateToken, authorizedRole("borrower"), createMessage)
router.get("/stats", authenticateToken, authorizedRole("borrower"), getMyStats);

// Librarian routes
router.get("/getMessage", authenticateToken, authorizedRole("librarian", "borrower"), getMessages)
router.get("/:id", authenticateToken, authorizedRole("librarian"), getMessageById);
router.put("/reply/:id", authenticateToken, authorizedRole("librarian"), replyToMessage)
router.put("/resolve/:id", authenticateToken, authorizedRole("librarian"), resolveMessage);

export default router;

