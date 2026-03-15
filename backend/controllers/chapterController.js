import Chapter from "../models/Chapter.js";
import Novel from "../models/Novel.js";

// @desc    Create a new chapter
// @route   POST /api/chapters/:novelId
export const createChapter = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { novelId } = req.params;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ success: false, message: "Novel not found" });

    const currentUserId = req.user._id || req.user.id;
    if (novel.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: "Only the author can add chapters" });
    }

    const lastChapter = await Chapter.findOne({ novel: novelId }).sort({ chapterNumber: -1 });
    const nextNumber = lastChapter ? lastChapter.chapterNumber + 1 : 1;

    const chapter = await Chapter.create({
      novel: novelId,
      author: currentUserId,
      title,
      content,
      chapterNumber: nextNumber,
    });

    novel.totalChapters = nextNumber;
    await novel.save();

    res.status(201).json({ success: true, data: chapter });
  } catch (error) {
    console.error("VALIDATION ERROR:", error.message); 
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all chapters of a novel
// @route   GET /api/chapters/novel/:novelId
export const getChaptersByNovel = async (req, res) => {
  try {
    const chapters = await Chapter.find({ novel: req.params.novelId }).sort({ chapterNumber: 1 });
    res.json({ success: true, data: chapters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single chapter details (Reading Mode)
// @route   GET /api/chapters/:id
export const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate("novel", "title author");
    
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    // Views increment logic
    chapter.views = (chapter.views || 0) + 1;
    await chapter.save();

    res.json({ success: true, data: chapter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};