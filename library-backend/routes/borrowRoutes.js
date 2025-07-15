import express from "express";
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js";
import { borrowBook, getAllBorrowRecords, getMyBorrowHistory, returnBook } from "../controller/borrowController.js";

const router = express.Router();

router.post("/borrow/:bookId", authenticateToken, authorizedRole("borrower"), borrowBook)
router.post("/return/:borrowId", authenticateToken, authorizedRole("borrower"), returnBook)
router.get("/borrow/me", authenticateToken, authorizedRole("borrower"), getMyBorrowHistory)
router.get("/borrowed", authenticateToken, authorizedRole("librarian"), getAllBorrowRecords)

export default router

