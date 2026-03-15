import express from "express";
import {
  createNovel,
  getAllNovels,
  getNovelById,
} from "../controllers/novelController.js";
import { 
  addComment, 
  getCommentsByNovel 
} from "../controllers/commentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../config/cloudinary.js"; // ✨ Local middleware ki jagah Cloudinary wala

const router = express.Router();

// --- Novel Routes ---
router.get("/", getAllNovels);
router.get("/:id", getNovelById);

// ✨ Cloudinary Upload Integrate ho gaya yahan
router.post(
  "/", 
  protect, 
  authorizeRoles("writer", "admin"), 
  upload.single("coverImage"), // 👈 Frontend ke FormData field name se match karein
  createNovel
);

// --- Comment Routes ---
router.get("/:id/comments", getCommentsByNovel);
router.post("/:id/comments", protect, addComment);

export default router;