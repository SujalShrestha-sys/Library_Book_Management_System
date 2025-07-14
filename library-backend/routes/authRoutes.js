import express from "express";
import { userLogin, registerUser } from "../controller/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", registerUser);

router.post("/login", userLogin);

export default router;