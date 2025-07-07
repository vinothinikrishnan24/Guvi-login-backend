import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPasswords,
  verifyResetCodes,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswords);
router.post('/verify-reset-code', verifyResetCodes);

export default router;
