import express from "express";
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js";
import { createBook, deleteBook, getAllBooks, updateBooks } from "../controller/bookController.js";

const router = express.Router();

// Protected Routes for Librarians 
router.post("/", authenticateToken, authorizedRole("librarian"), createBook);
router.put("/:id", authenticateToken, authorizedRole("librarian"), updateBooks);
router.delete("/:id", authenticateToken, authorizedRole("librarian"), deleteBook);

// Public for both borrowers and librarians
router.get("/", authenticateToken, getAllBooks);

export default router;