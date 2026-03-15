import Comment from "../models/Comment.js";
import Novel from "../models/Novel.js";

// @desc    Add a comment to a novel
// @route   POST /api/novels/:id/comments
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const novelId = req.params.id;

    if (!content) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({ success: false, message: "Novel not found" });
    }

    const comment = await Comment.create({
      novel: novelId,
      user: req.user._id, // Auth middleware se user ki ID
      content,
    });

    // Hum user ka naam bhi saath mein bhejenge taaki frontend par turant dikhe
    const populatedComment = await Comment.findById(comment._id).populate("user", "name");

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all comments for a novel
// @route   GET /api/novels/:id/comments
export const getCommentsByNovel = async (req, res) => {
  try {
    const comments = await Comment.find({ novel: req.params.id })
      .populate("user", "name") // User ka naam chahiye
      .sort({ createdAt: -1 }); // Naye comments sabse upar

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};