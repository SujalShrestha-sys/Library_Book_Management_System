import express from "express";
import { userLogin, registerUser } from "../controller/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", registerUser);

// @route   POST /api/auth/login
router.post("/login", userLogin);

export default router;