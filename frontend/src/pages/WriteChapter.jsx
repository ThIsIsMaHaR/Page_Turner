import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const WriteChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return alert("Title and content cannot be empty");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        return navigate("/login");
      }

      const res = await api.post(
        `/chapters/${id}`,
        { title: title.trim(), content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Chapter publish response:", res.data);

      if (res.status === 201 && res.data.success) {
        alert(`Chapter "${res.data.data.title}" published successfully! 🚀`);
        navigate(`/novel/${id}`);
      }
    } catch (err) {
      console.error("CHAPTER_PUBLISH_ERROR:", err.response || err);
      const errorMsg = err.response?.data?.message || "Publishing failed.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-10 px-6 max-w-5xl mx-auto w-full min-h-screen bg-[#0f0f0f] text-[#e5e5e5]">
      
      {/* Header */}
      <div className="w-full mb-8">
        <span className="text-xs md:text-sm font-mono uppercase tracking-wide text-[#8b5cf6]">
          Drafting Mode
        </span>
        <div className="h-px w-16 bg-[#6b5cf6] mt-1" />
      </div>

      {/* Chapter Title */}
      <input
        className="w-full text-4xl md:text-6xl font-serif font-semibold border-b border-gray-700 py-4 bg-[#0f0f0f] placeholder-[#6b6b6b] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all duration-300"
        placeholder="Chapter Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Chapter Content */}
      <div className="w-full mt-8 relative">
        <textarea
          ref={textareaRef}
          className="w-full min-h-[400px] md:min-h-[600px] bg-[#1a1a1a] border border-gray-800 p-8 rounded-xl shadow-lg font-serif text-lg md:text-xl leading-8 placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] resize-none transition-all duration-300"
          placeholder="Start writing your chapter here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Publish Button */}
      <div className="w-full flex justify-end mt-8">
        <button
          onClick={handlePublish}
          disabled={loading}
          className="bg-[#19181a] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-[#7c3aed] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
        >
          <span className="uppercase text-xs tracking-wide">
            {loading ? "Publishing..." : "Seal & Publish"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default WriteChapter;