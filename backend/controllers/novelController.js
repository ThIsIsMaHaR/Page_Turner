import Novel from "../models/Novel.js";

// @desc    Create a new novel
// @route   POST /api/novels
export const createNovel = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required!" });
    }

    // ✨ Cloudinary logic: req.file.path mein ab pura URL aata hai
    const coverImage = req.file ? req.file.path : "";

    const novel = await Novel.create({
      title,
      description,
      category: category || "Fantasy",
      coverImage: coverImage, // Direct URL save hoga
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: novel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all novels
export const getAllNovels = async (req, res) => {
  try {
    const novels = await Novel.find().populate("author", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: novels.length, data: novels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single novel details
export const getNovelById = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id).populate("author", "name");
    if (!novel) return res.status(404).json({ success: false, message: "Novel not found" });
    res.status(200).json({ success: true, data: novel });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid Novel ID" });
  }
};

// @desc    Update a novel
// @route   PUT /api/novels/:id
export const updateNovel = async (req, res) => {
  try {
    let novel = await Novel.findById(req.params.id);

    if (!novel) return res.status(404).json({ success: false, message: "Novel not found" });

    // Check ownership
    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only edit your own novels!" });
    }

    const updateData = { ...req.body };

    // ✨ Update image with Cloudinary URL if a new file is uploaded
    if (req.file) {
      updateData.coverImage = req.file.path;
    }

    novel = await Novel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: novel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a novel
// @route   DELETE /api/novels/:id
export const deleteNovel = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);

    if (!novel) return res.status(404).json({ success: false, message: "Novel not found" });

    // Check ownership
    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this!" });
    }

    // ✨ Note: Cloudinary se image delete karne ke liye uska 'public_id' lagta hai.
    // Abhi hum database record delete kar rahe hain. 
    await novel.deleteOne();

    res.status(200).json({ success: true, message: "Novel deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};