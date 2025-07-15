import express from "express";

import { getAdminStatistics } from "../controller/adminController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizedRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizedRole("librarian"), getAdminStatistics);

export default router;