import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/authController.js";

import { body } from "express-validator";
import { authLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone")
    .isLength({ min: 10 })
    .withMessage("Phone number must be at least 10 digits"),
  body("role").isIn(["STUDENT", "FACULTY"]).withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").exists().withMessage("Password is required"),
];

router.post(
  "/register",
  authLimiter,
  validate(registerValidation),
  registerUser,
);
router.post("/login", authLimiter, validate(loginValidation), loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);

export default router;
