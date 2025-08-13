import express from "express";
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js";
import { borrowBook, getAllBorrowRecords, getMyBorrowHistory, returnBook, getBorrowerDetails, approveBorrowerRequest, rejectBorrowRequest, renewBorrow } from "../controller/borrowController.js";
import { getDueSoonBooks } from "../controller/dueSoonController.js";

const router = express.Router();

//Borrower actions
router.post("/borrow/:bookId", authenticateToken, authorizedRole("borrower"), borrowBook)
router.get("/borrow/me", authenticateToken, authorizedRole("borrower"), getMyBorrowHistory)
router.patch("/renew/:id", authenticateToken, authorizedRole("borrower"), renewBorrow)
router.patch("/return/:borrowId", authenticateToken, authorizedRole("borrower"), returnBook)
router.get("/due-soon", authenticateToken, authorizedRole("borrower"), getDueSoonBooks)

//librarian actions
router.get("/borrowed", authenticateToken, authorizedRole("librarian"), getAllBorrowRecords)
router.get("/details/:userId", authenticateToken, authorizedRole("librarian"), getBorrowerDetails)
router.patch("/borrow/approve/:borrowId", authenticateToken, authorizedRole("librarian"), approveBorrowerRequest);
router.patch("/borrow/reject/:borrowId", authenticateToken, authorizedRole("librarian"), rejectBorrowRequest);


export default router

