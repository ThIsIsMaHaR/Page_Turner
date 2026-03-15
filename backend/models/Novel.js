import mongoose from "mongoose";

const novelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Novel title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Yeh User model se connect karega
      required: true,
    },
    coverImage: {
      type: String,
      default: "", // Yahan hum image ka path store karenge
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Hiatus"],
      default: "Ongoing",
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Novel = mongoose.model("Novel", novelSchema);
export default Novel;