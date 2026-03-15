import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
  const profileId = id || loggedInUser?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const { data } = await api.get(`/auth/profile/${profileId}`);
        setProfileData(data.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId, navigate]);

  if (loading) return <div className="mt-20 font-mono text-center opacity-40 uppercase text-xs tracking-[0.5em] animate-pulse text-text-h">Syncing Studio Data...</div>;
  if (!profileData) return <div className="mt-20 text-center text-text">Profile not found in archives.</div>;

  const { user, novels, stats } = profileData;
  const isOwnProfile = loggedInUser && loggedInUser._id === user._id;

  return (
    <div className="flex-1 bg-bg text-left min-h-screen">
      <div className="max-w-[1126px] mx-auto px-6 py-12">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16 border-b border-border/30 pb-16">
          <div className="w-40 h-40 rounded-[3rem] bg-accent flex items-center justify-center text-white text-6xl font-heading shadow-2xl shadow-accent/20 flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-6xl md:text-7xl font-heading text-text-h mb-4 tracking-tighter">
              {user.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 font-mono text-[10px] uppercase tracking-widest opacity-40">
              <span className="text-accent">{user.role}</span>
              <span>&bull;</span>
              <span>Joined {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>
          {isOwnProfile && user.role === "writer" && (
            <Link to="/create-novel" className="bg-text-h text-bg px-10 py-4 rounded-2xl font-bold hover:bg-accent hover:text-white transition-all shadow-xl">
              + New Saga
            </Link>
          )}
        </div>

        {/* --- ✨ WRITER COMMAND CENTER ✨ --- */}
        {isOwnProfile && user.role === "writer" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="bg-code-bg/40 border border-border p-8 rounded-[2.5rem]">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 block mb-2">Bibliography</span>
              <h3 className="text-4xl font-heading text-text-h">{novels?.length || 0} <span className="text-xs font-mono opacity-20 uppercase tracking-widest">Works</span></h3>
            </div>
            <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:bg-accent/10 transition-all">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent">Studio Status</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xl font-bold text-text-h">System Live</span>
              </div>
              <p className="text-[9px] font-mono opacity-20 mt-4 uppercase">Cloudinary Storage Connected</p>
            </div>
            <div className="bg-code-bg/40 border border-border p-8 rounded-[2.5rem]">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 block mb-2">Total Outreach</span>
              <h3 className="text-4xl font-heading text-text-h">{stats?.totalChapters || 0} <span className="text-xs font-mono opacity-20 uppercase tracking-widest">Chapters</span></h3>
            </div>
          </div>
        )}

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-24">
            
            {/* Section 1: Bibliography (Written by user) */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-4xl font-heading text-text-h tracking-tight">Bibliography</h2>
                <div className="flex-1 h-px bg-border/30"></div>
              </div>
              <div className="grid gap-6">
                {novels && novels.length > 0 ? novels.map(novel => (
                  <Link key={novel._id} to={`/novel/${novel._id}`} className="group flex gap-8 p-8 bg-code-bg/10 border border-border rounded-[2.5rem] hover:border-accent/40 transition-all">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-bg border border-border flex-shrink-0 shadow-lg">
                      {/* ✨ Direct Cloudinary URL */}
                      <img src={novel.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => e.target.src='https://via.placeholder.com/150?text=PageTurner'} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[9px] font-mono text-accent uppercase tracking-[0.3em] mb-2">{novel.category}</span>
                      <h3 className="text-2xl font-bold text-text-h group-hover:text-accent transition-colors leading-tight">{novel.title}</h3>
                      <p className="text-sm opacity-40 mt-3 line-clamp-2 italic font-light leading-relaxed">"{novel.description}"</p>
                    </div>
                  </Link>
                )) : <p className="opacity-30 italic font-mono text-xs p-10 border border-dashed border-border rounded-3xl text-center">The ink hasn't touched the paper yet.</p>}
              </div>
            </section>

            {/* Section 2: Reading Library (Bookmarks) */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-4xl font-heading text-text-h tracking-tight">Personal Archive</h2>
                <div className="flex-1 h-px bg-border/30"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {user.bookmarks?.length > 0 ? user.bookmarks.map(novel => (
                  <Link key={novel._id} to={`/novel/${novel._id}`} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
                    <img src={novel.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent p-8 flex flex-col justify-end">
                      <span className="text-[9px] font-mono text-accent uppercase tracking-[0.4em] mb-2">{novel.category}</span>
                      <h4 className="text-text-h font-heading text-2xl leading-tight">{novel.title}</h4>
                      <p className="text-[10px] font-mono opacity-40 mt-2 uppercase tracking-widest">Open Archive →</p>
                    </div>
                  </Link>
                )) : <p className="opacity-30 italic font-mono text-xs col-span-full p-10 border border-dashed border-border rounded-3xl text-center">No stories archived in this library.</p>}
              </div>
            </section>

          </div>

          {/* Stats Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 p-10 bg-code-bg/20 border border-border rounded-[3rem] backdrop-blur-sm">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] mb-12 opacity-30 text-center">Core Data</h4>
              <div className="space-y-10">
                <div className="flex flex-col gap-2">
                  <span className="opacity-30 text-[10px] uppercase font-mono tracking-widest">Public Identity</span>
                  <span className="text-text-h font-bold text-lg">{user.name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="opacity-30 text-[10px] uppercase font-mono tracking-widest">Assigned Role</span>
                  <span className="text-accent font-bold uppercase text-xs tracking-widest">{user.role}</span>
                </div>
                <div className="flex flex-col gap-2 pt-6 border-t border-border/30">
                  <span className="opacity-30 text-[10px] uppercase font-mono tracking-widest">Account Genesis</span>
                  <span className="text-text-h font-medium">{new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;