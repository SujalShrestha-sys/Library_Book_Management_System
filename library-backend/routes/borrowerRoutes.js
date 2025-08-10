import express from "express"
import { authenticateToken } from "../middleware/authMiddleware.js"
import { getBorrowerStats, getMyBooks } from "../controller/borrowerController.js"

const router = express.Router();

router.get("/stats", authenticateToken, getBorrowerStats);
router.get("/myBooks", authenticateToken, getMyBooks);

export default router;