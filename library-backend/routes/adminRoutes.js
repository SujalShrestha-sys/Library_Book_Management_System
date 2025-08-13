import express from "express";

import { getAdminStatistics } from "../controller/adminController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizedRole } from "../middleware/authMiddleware.js";
import { getDueSoonBooks } from "../controller/dueSoonController.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizedRole("librarian"), getAdminStatistics);
router.get("/due-soon/:userId", authenticateToken, authorizedRole("librarian"), getDueSoonBooks)

export default router;