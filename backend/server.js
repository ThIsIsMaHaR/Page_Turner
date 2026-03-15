import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Database Connection Import
import connectDB from "./config/db.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import novelRoutes from "./routes/novelRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js"; // ✨ Chapter routes import kiya

// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Path configuration for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// MIDDLEWARES
// =========================

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static Folder for Covers/Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);       // User Login/Register
app.use("/api/novels", novelRoutes);     // Novel CRUD
app.use("/api/chapters", chapterRoutes); // Chapter CRUD ✨ Yahan connect ho gaya

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PageTurner API is running successfully 🚀",
  });
});

// =========================
// ERROR HANDLING
// =========================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 SERVER_ERROR:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

export default app;