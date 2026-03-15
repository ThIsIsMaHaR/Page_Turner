import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    novel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Chapter title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Chapter content is required"],
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Chapter save hone se pehle word count calculate karna
chapterSchema.pre("save", function (next) {
  if (this.content) {
    this.wordCount = this.content.trim().split(/\s+/).length;
  }
  next();
});

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;