import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [history, setHistory] = useState([]);

  const categories = ["All", "Fantasy", "Romance", "Action", "Sci-Fi", "Mystery", "Horror"];

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/novels");
        setNovels(data.data);
        
        // Load Reading History from Local Storage
        const savedHistory = JSON.parse(localStorage.getItem("readingHistory") || "[]");
        setHistory(savedHistory);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNovels();
  }, []);

  // ✨ Filtering Logic (Search + Category)
  const filteredNovels = novels.filter((novel) => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || novel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="mt-20 font-mono text-center opacity-40 animate-pulse tracking-widest uppercase text-xs">Loading Saga...</div>;

  return (
    <div className="flex-1 bg-bg text-left max-w-[1126px] mx-auto px-6 py-12">
      
      {/* --- 🔎 Search & Title Section --- */}
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-heading text-text-h mb-10 tracking-tighter leading-none">
          Infinite <br /> <span className="text-accent italic">Stories.</span>
        </h1>
        <div className="relative max-w-2xl group">
          <input 
            type="text"
            placeholder="Search by title, keywords or vibes..."
            className="w-full bg-code-bg border border-border px-14 py-5 rounded-[2.5rem] outline-none focus:border-accent transition-all text-lg shadow-sm group-hover:border-border-h"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-6 top-6 opacity-30 text-xl">🔍</span>
        </div>
      </div>

      {/* --- 📜 Continue Reading (History) --- */}
      {history.length > 0 && !searchTerm && (
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-border"></span> Keep Reading
          </h3>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
            {history.map((item, i) => (
              <Link 
                key={i} 
                to={`/read/${item.chapterId}`}
                className="flex-shrink-0 w-72 p-6 bg-accent/5 border border-accent/10 rounded-[2.5rem] hover:bg-accent/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">📖</div>
                <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest">Chapter {item.chapterNumber}</span>
                <h4 className="text-xl font-bold text-text-h truncate mt-2 group-hover:text-accent transition-colors">{item.novelTitle}</h4>
                <p className="text-xs opacity-50 truncate mt-1">{item.chapterTitle}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* --- 🏷️ Category Filter --- */}
      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${
              selectedCategory === cat 
              ? 'bg-text-h text-bg font-bold' 
              : 'bg-code-bg border border-border text-text hover:border-accent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- 📚 Novels Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredNovels.length > 0 ? (
          filteredNovels.map((novel) => (
            <Link 
              key={novel._id} 
              to={`/novel/${novel._id}`}
              className="group bg-code-bg/10 border border-border rounded-[2.5rem] overflow-hidden hover:border-accent/40 transition-all flex flex-col shadow-sm hover:shadow-xl hover:shadow-accent/5 duration-500"
            >
              <div className="aspect-[16/11] overflow-hidden bg-code-bg relative">
                <img 
                  src={`http://localhost:5000/${novel.coverImage}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=PageTurner'; }}
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] text-white font-mono uppercase tracking-widest">
                  {novel.category}
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-text-h mb-3 group-hover:text-accent transition-colors tracking-tight">{novel.title}</h2>
                <p className="text-sm opacity-40 line-clamp-2 italic font-light leading-relaxed">
                  "{novel.description}"
                </p>
                <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent">Open File →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-3xl opacity-10 font-heading italic mb-4">No stories found in this timeline.</p>
            <button onClick={() => {setSearchTerm(""); setSelectedCategory("All")}} className="text-xs font-mono uppercase text-accent underline underline-offset-8">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;