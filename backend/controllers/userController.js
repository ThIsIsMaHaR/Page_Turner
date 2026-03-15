import User from "../models/User.js";
import Novel from "../models/Novel.js";

// @desc    Get user profile with stats and bookmarks
// @route   GET /api/auth/profile/:id
export const getUserProfile = async (req, res) => {
  try {
    // ✨ Populate bookmarks taaki saved novels ki details mil sakein
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("bookmarks"); 

    if (!user) return res.status(404).json({ message: "User not found" });

    // Is user ki likhi hui novels
    const novels = await Novel.find({ author: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        novels,
        stats: {
          totalNovels: novels.length,
          totalChapters: novels.reduce((acc, n) => acc + (n.totalChapters || 0), 0),
          totalBookmarks: user.bookmarks.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Bookmark (Add/Remove from Library) ✨ NEW
// @route   POST /api/auth/bookmark/:id
export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const novelId = req.params.id;

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check karo novel pehle se bookmarked hai ya nahi
    const isBookmarked = user.bookmarks.includes(novelId);

    if (isBookmarked) {
      // Pehle se hai toh nikalo
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== novelId);
    } else {
      // Nahi hai toh dalo
      user.bookmarks.push(novelId);
    }

    await user.save();
    
    res.json({ 
      success: true, 
      isBookmarked: !isBookmarked,
      message: isBookmarked ? "Removed from Library" : "Added to Library" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};