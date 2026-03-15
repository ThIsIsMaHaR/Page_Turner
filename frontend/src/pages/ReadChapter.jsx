import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ReadChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [fontSize, setFontSize] = useState(20);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);
        // 1. Fetch current chapter
        const { data } = await api.get(`/chapters/${id}`);
        const currentChapter = data.data;
        setChapter(currentChapter);

        // 2. Fetch all chapters for navigation (Only if we don't have them or novel changed)
        const res = await api.get(`/chapters/novel/${currentChapter.novel}`);
        const sorted = res.data.data.sort((a, b) => a.chapterNumber - b.chapterNumber);
        setAllChapters(sorted);

        // 3. Fetch Novel Title for History
        const novelRes = await api.get(`/novels/${currentChapter.novel}`);
        const novelData = novelRes.data.data;

        // ✨ Optimized History Logic ✨
        const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
        const newEntry = {
          novelId: currentChapter.novel,
          novelTitle: novelData.title,
          chapterId: currentChapter._id,
          chapterTitle: currentChapter.title,
          chapterNumber: currentChapter.chapterNumber,
          time: new Date().toISOString()
        };

        // Filter and unshift to keep it clean (Max 5 entries)
        const updatedHistory = [
          newEntry, 
          ...history.filter(item => item.novelId !== currentChapter.novel)
        ].slice(0, 5);
        
        localStorage.setItem("readingHistory", JSON.stringify(updatedHistory));

      } catch (err) {
        console.error("Reader Error:", err);
      } finally {
        setLoading(false);
        // ✨ Scroll to top when chapter changes
        window.scrollTo(0, 0);
      }
    };

    fetchChapterData();
  }, [id]); // Triggers every time the chapter ID in URL changes

  // Navigation Logic
  const currentIndex = allChapters.findIndex(c => c._id === id);
  const prevChapter = allChapters[currentIndex - 1];
  const nextChapter = allChapters[currentIndex + 1];

  const themeClasses = {
    dark: "bg-[#121217] text-gray-300 border-gray-800/50",
    light: "bg-white text-gray-900 border-gray-200",
    sepia: "bg-[#f4ecd8] text-[#5b4636] border-[#e1d3b6]"
  };

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.4em] opacity-40">
      Revealing the manuscript...
    </div>
  );

  if (!chapter) return <div className="mt-20 text-center opacity-50">Record missing in archives.</div>;

  return (
    <div className={`flex-1 min-h-screen transition-all duration-700 ${
      theme === 'dark' ? 'bg-[#0a0a0c]' : theme === 'sepia' ? 'bg-[#ebe2cd]' : 'bg-gray-50'
    }`}>
      
      {/* --- Floating Control Hub --- */}
      <div className="sticky top-6 z-50 flex justify-center px-6 pointer-events-none">
        <div className="bg-code-bg/90 backdrop-blur-md border border-border p-2 rounded-2xl flex items-center gap-6 shadow-2xl pointer-events-auto">
          <Link to={`/novel/${chapter.novel}`} className="p-2 hover:bg-accent/10 rounded-xl transition-all text-text/60 hover:text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>

          <div className="h-4 w-px bg-border/50"></div>

          {/* Size Controls */}
          <div className="flex items-center gap-4 px-2">
            <button onClick={() => setFontSize(f => Math.max(14, f - 2))} className="text-[10px] font-bold opacity-40 hover:opacity-100">A-</button>
            <span className="text-[9px] font-mono opacity-20 w-8 text-center uppercase tracking-tighter">{fontSize}px</span>
            <button onClick={() => setFontSize(f => Math.min(36, f + 2))} className="text-xs font-bold opacity-40 hover:opacity-100">A+</button>
          </div>

          <div className="h-4 w-px bg-border/50"></div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-3 px-2">
            <button onClick={() => setTheme('light')} className={`w-5 h-5 rounded-full bg-white border-2 ${theme === 'light' ? 'border-accent' : 'border-transparent'}`}></button>
            <button onClick={() => setTheme('dark')} className={`w-5 h-5 rounded-full bg-[#121217] border-2 ${theme === 'dark' ? 'border-accent' : 'border-transparent'}`}></button>
            <button onClick={() => setTheme('sepia')} className={`w-5 h-5 rounded-full bg-[#f4ecd8] border-2 ${theme === 'sepia' ? 'border-accent' : 'border-transparent'}`}></button>
          </div>
        </div>
      </div>

      {/* --- Reading Canvas --- */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="mb-24 text-center">
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.6em] block mb-6">Chapter {chapter.chapterNumber}</span>
          <h1 className="text-5xl md:text-7xl font-heading text-text-h tracking-tighter leading-[0.9] italic">
            {chapter.title}
          </h1>
          <div className="h-px w-20 bg-accent/20 mx-auto mt-12" />
        </header>

        {/* The Actual Text Body */}
        <div 
          className={`relative p-10 md:p-20 rounded-[3rem] border transition-all duration-500 leading-[1.8] ${themeClasses[theme]}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="max-w-2xl mx-auto space-y-10 font-light">
            {chapter.content.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="first-letter:text-3xl first-letter:font-heading first-letter:mr-1">{para}</p>
            ))}
          </div>
        </div>

        {/* --- Dynamic Pagination --- */}
        <div className="mt-24 flex justify-between items-center border-t border-border/20 pt-12 px-4">
          {prevChapter ? (
            <Link to={`/read/${prevChapter._id}`} className="group flex flex-col items-start gap-2">
              <span className="text-[9px] font-mono uppercase tracking-widest opacity-30 group-hover:text-accent group-hover:opacity-100 transition-all">← Previous</span>
              <span className="text-sm font-bold text-text-h truncate max-w-[150px]">{prevChapter.title}</span>
            </Link>
          ) : (
            <div className="opacity-10 font-mono text-[9px] uppercase tracking-[0.3em]">First Record</div>
          )}

          <Link to={`/novel/${chapter.novel}`} className="p-4 bg-code-bg border border-border rounded-full hover:border-accent transition-all group">
             <div className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100">Index</div>
          </Link>

          {nextChapter ? (
            <Link to={`/read/${nextChapter._id}`} className="group flex flex-col items-end gap-2 text-right">
              <span className="text-[9px] font-mono uppercase tracking-widest opacity-30 group-hover:text-accent group-hover:opacity-100 transition-all">Next →</span>
              <span className="text-sm font-bold text-text-h truncate max-w-[150px]">{nextChapter.title}</span>
            </Link>
          ) : (
            <div className="opacity-10 font-mono text-[9px] uppercase tracking-[0.3em]">End of Archive</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadChapter;