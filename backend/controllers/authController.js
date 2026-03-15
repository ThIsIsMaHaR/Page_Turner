import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Novel from "../models/Novel.js";

// Token generate karne ka function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("bookmarks");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const novels = await Novel.find({ author: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        novels,
        stats: {
          totalNovels: novels.length,
          totalChapters: novels.reduce((acc, n) => acc + (n.totalChapters || 0), 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const novelId = req.params.id;

    if (!user) return res.status(404).json({ message: "User not found" });

    const isBookmarked = user.bookmarks.includes(novelId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== novelId);
    } else {
      user.bookmarks.push(novelId);
    }

    await user.save();
    res.json({ success: true, isBookmarked: !isBookmarked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};