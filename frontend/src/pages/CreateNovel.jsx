import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateNovel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fantasy");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/novels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        alert("Story Published! 📚");
        navigate(`/novel/${data.data._id}`);
      }
    } catch (err) {
      console.error("Upload Error:", err.response?.data);
      alert(err.response?.data?.message || "Something went wrong. Check terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-2xl bg-code-bg border border-border p-10 rounded-2xl shadow-custom">
        <h1 className="text-3xl font-heading mb-8">Start Your Masterpiece</h1>

        <form onSubmit={handleCreate} className="space-y-6 text-left">
          {/* Cover Upload */}
          <div className="space-y-4">
            <label className="text-sm font-mono uppercase text-text-h">Book Cover</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-44 bg-bg border border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <span className="text-[10px] text-text opacity-50 uppercase text-center px-2">Preview</span>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent file:text-white cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-mono uppercase text-text-h">Title</label>
            <input 
              className="w-full bg-bg border border-border p-3 rounded-lg outline-none focus:border-accent text-text-h"
              placeholder="e.g. The Last Kingdom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-mono uppercase text-text-h">Category</label>
            <select 
              className="w-full bg-bg border border-border p-3 rounded-lg outline-none focus:border-accent text-text-h"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Fantasy">Fantasy</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Mystery">Mystery</option>
              <option value="Horror">Horror</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-mono uppercase text-text-h">Summary</label>
            <textarea 
              className="w-full h-32 bg-bg border border-border p-3 rounded-lg outline-none focus:border-accent text-text"
              placeholder="A short description of your story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-full font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? "Uploading..." : "Publish Novel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNovel;