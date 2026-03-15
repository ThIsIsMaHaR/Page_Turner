import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  toggleBookmark // ✨ Naya controller function import kiya
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // 🔐 Protect zaroori hai

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);

// ✨ Protected Route: Sirf logged-in user hi bookmark kar sakta hai
router.post("/bookmark/:id", protect, toggleBookmark);

export default router;