import express from "express"
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js"
import { getBorrowerStats, getMyBooks } from "../controller/borrowerController.js"
import { getDueSoonBooks } from "../controller/dueSoonController.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizedRole("borrower"), getBorrowerStats);
router.get("/myBooks", authenticateToken, authorizedRole("borrower"), getMyBooks);
router.get("/due-soon", authenticateToken, authorizedRole("borrower"), getDueSoonBooks)
export default router;