import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Comments from "../components/Comments";

const NovelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAuthor = userInfo && novel?.author?._id === userInfo._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [novelRes, chapterRes] = await Promise.all([
          api.get(`/novels/${id}`),
          api.get(`/chapters/novel/${id}`)
        ]);
        
        const fetchedNovel = novelRes.data.data;
        setNovel(fetchedNovel);
        setChapters(chapterRes.data.data);

        if (userInfo) {
          const bookmarked = userInfo.bookmarks?.includes(id);
          setIsBookmarked(bookmarked);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Bhai, bookmark karne ke liye login toh kar lo!");

      const { data } = await api.post(`/auth/bookmark/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsBookmarked(data.isBookmarked);
      
      const updatedUser = { ...userInfo };
      if (data.isBookmarked) {
        updatedUser.bookmarks = [...(updatedUser.bookmarks || []), id];
      } else {
        updatedUser.bookmarks = updatedUser.bookmarks.filter(bId => bId !== id);
      }
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

    } catch (err) {
      console.error(err);
      alert("Bookmark update nahi ho paya.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bhai, kya pakka is story ko mita dena hai?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/novels/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Novel deleted! 🗑️");
        navigate("/");
      } catch (err) {
        alert(err.response?.data?.message || "Error occurred.");
      }
    }
  };

  if (loading) return <div className="mt-20 font-mono text-center text-text animate-pulse tracking-widest opacity-50 uppercase text-xs">Accessing Archives...</div>;
  if (!novel) return <div className="mt-20 text-center text-text">This story has been lost in time.</div>;

  return (
    <div className="flex-1 bg-bg text-left min-h-screen">
      <div className="max-w-[1126px] mx-auto px-6 py-12">
        
        {/* --- Hero Section --- */}
        <div className="flex flex-col md:flex-row gap-16 items-start mb-24">
          
          {/* Cover Image */}
          <div className="w-full md:w-80 aspect-[2/3] flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-border bg-code-bg">
            <img 
              src={novel.coverImage} // ✨ Localhost hata diya, Cloudinary URL direct use hoga
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }}
            />
          </div>

          {/* Details Content */}
          <div className="flex-1 w-full pt-4">
            
            <div className="flex items-center justify-between mb-8 border-b border-border/30 pb-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-accent/5 text-accent text-[10px] font-mono uppercase tracking-[0.3em] border border-accent/20 rounded-full">
                  {novel.category}
                </span>

                {!isAuthor && userInfo && (
                  <button 
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${
                      isBookmarked 
                      ? 'bg-accent text-white border border-accent shadow-lg shadow-accent/20' 
                      : 'bg-code-bg border border-border text-text/60 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {isBookmarked ? "In Library" : "Add to Library"}
                  </button>
                )}
              </div>

              {isAuthor && (
                <button 
                  onClick={handleDelete}
                  className="group flex items-center gap-2 text-text/40 hover:text-red-500 transition-all duration-300"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Delete Entry</span>
                  <div className="p-2 bg-code-bg border border-border rounded-xl group-hover:border-red-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </div>
                </button>
              )}
            </div>

            <h1 className="text-6xl md:text-8xl font-heading text-text-h mb-8 leading-[0.85] tracking-tighter">
              {novel.title}
            </h1>

            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">Written by</span>
              <span className="text-text-h font-bold text-lg tracking-tight border-b-2 border-accent/20 pb-1">{novel.author?.name}</span>
            </div>

            <p className="text-xl md:text-2xl text-text leading-relaxed mb-12 max-w-2xl font-light italic opacity-80">
              "{novel.description}"
            </p>

            <div className="flex flex-wrap gap-5">
              {isAuthor && (
                <Link 
                  to={`/write/${novel._id}`}
                  className="bg-accent text-white px-12 py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300"
                >
                  + Append Chapter
                </Link>
              )}
              
              {chapters.length > 0 ? (
                <Link 
                  to={`/read/${chapters[0]._id}`}
                  className="bg-text-h text-bg px-12 py-5 rounded-[1.5rem] font-bold hover:bg-accent hover:text-white transition-all duration-300"
                >
                  Start Reading
                </Link>
              ) : (
                <div className="px-12 py-5 border border-border rounded-[1.5rem] text-xs font-mono opacity-30 uppercase">
                  Chapters Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-border/30 mb-20" />

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <h2 className="text-4xl font-heading text-text-h mb-12">Index</h2>
            
            {chapters.length > 0 ? (
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <Link 
                    key={chapter._id}
                    to={`/read/${chapter._id}`} // ✨ Sahi Chapter ID pass ho rahi hai
                    className="flex items-center justify-between p-8 bg-code-bg/20 border border-border rounded-[2.5rem] hover:border-accent hover:bg-accent-bg/5 transition-all group"
                  >
                    <div className="flex items-center gap-8">
                      <span className="text-xs font-mono opacity-20 group-hover:text-accent group-hover:opacity-100 tracking-widest">CH. {chapter.chapterNumber || "01"}</span>
                      <span className="text-2xl font-medium text-text-h">{chapter.title}</span>
                    </div>
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-all font-mono text-xs tracking-widest">READ FILE →</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem] bg-code-bg/10 text-text/30 font-mono text-xs uppercase tracking-widest italic">
                No entries found in the archive.
              </div>
            )}

            <Comments novelId={novel._id} />
          </div>

          <aside className="lg:col-span-4 lg:pl-10">
            <div className="sticky top-24 p-10 bg-code-bg/20 border border-border rounded-[3rem] backdrop-blur-sm">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] mb-12 opacity-30 text-center">Story Metadata</h4>
              <div className="space-y-10">
                <div className="flex flex-col gap-2">
                  <span className="opacity-30 text-[10px] uppercase font-mono tracking-widest">First Published</span>
                  <span className="text-text-h font-bold text-lg">{new Date(novel.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="opacity-30 text-[10px] uppercase font-mono tracking-widest">Current Size</span>
                  <span className="text-text-h font-bold text-lg">{chapters.length} Volumes</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NovelDetails;