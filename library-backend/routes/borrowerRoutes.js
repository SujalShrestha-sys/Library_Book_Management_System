import express from "express"
import { authenticateToken, authorizedRole } from "../middleware/authMiddleware.js"
import { getBorrowerProfile, getBorrowerStats, getMyBooks, updateBorrowerProfile} from "../controller/borrowerController.js"
import { getDueSoonBooks } from "../controller/dueSoonController.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizedRole("borrower"), getBorrowerStats);
router.get("/myBooks", authenticateToken, authorizedRole("borrower"), getMyBooks);
router.get("/due-soon", authenticateToken, authorizedRole("borrower"), getDueSoonBooks);
router.put("/updateProfile", authenticateToken, authorizedRole("borrower"), updateBorrowerProfile)
router.get("/me", authenticateToken, authorizedRole("borrower"), getBorrowerProfile);
export default router;