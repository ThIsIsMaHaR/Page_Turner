import express from "express";
import { 
  createChapter, 
  getChaptersByNovel, 
  getChapterById 
} from "../controllers/chapterController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Public Routes ---
// Novel ki saari chapters list karne ke liye
router.get("/novel/:novelId", getChaptersByNovel);

// Ek single chapter padhne ke liye
router.get("/:id", getChapterById); 

// --- Protected Routes ---
// Naya chapter likhne ke liye (Auth required)
router.post("/:novelId", protect, createChapter);

export default router;