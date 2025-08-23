import express from "express";

import { getAdminStatistics, sendRemainderEmail, updateLibrarianProfile } from "../controller/adminController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizedRole } from "../middleware/authMiddleware.js";
import { getDueSoonBooks } from "../controller/dueSoonController.js";
import { getLibrarianProfile } from "../controller/adminController.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizedRole("librarian"), getAdminStatistics);
router.get("/due-soon/:userId", authenticateToken, authorizedRole("librarian"), getDueSoonBooks)
router.post("/send-reminder/:borrowId", authenticateToken, authorizedRole("librarian"), sendRemainderEmail)
router.get("/me", authenticateToken, authorizedRole("librarian"), getLibrarianProfile);
router.put("/updateProfile", authenticateToken, authorizedRole("librarian"), updateLibrarianProfile)

export default router;