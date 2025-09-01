import express from "express";
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js";
import { createBook, deleteBook, getAllBooks, updateBooks, getRecommendedBooks, getNewRelease } from "../controller/bookController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Protected Routes for Librarians 
router.post("/", authenticateToken, authorizedRole("librarian"), upload.single("coverImage"), createBook);
router.put("/:id", authenticateToken, authorizedRole("librarian"), upload.single("coverImage"), updateBooks);
router.delete("/:id", authenticateToken, authorizedRole("librarian"), deleteBook);

router.get("/new", authenticateToken, authorizedRole("borrower", "librarian"), getNewRelease);
router.get("/recommended", authenticateToken, authorizedRole("borrower"), getRecommendedBooks);

// Public for both borrowers and librarians
router.get("/", authenticateToken, getAllBooks);



export default router;