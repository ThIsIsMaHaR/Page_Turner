import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom"; // ✨ useSearchParams add kiya

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams(); // ✨ URL ke query params (?role=) ke liye
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ✨ Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  // ✨ Switch logic
  const handleSwitch = (targetRole) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate(`/login?role=${targetRole}`);
    window.location.reload();
  };

  // ✨ Logo Link Logic
  const getLogoLink = () => {
    if (!userInfo) return "/";
    return userInfo.role === "writer" ? `/profile/${userInfo._id}` : "/reader-home";
  };

  // --- 🎯 SMART WORLD DETECTION 🎯 ---
  // 1. Check karo URL path (e.g., /profile)
  const isWriterPath = location.pathname.includes("profile") || location.pathname.includes("create-novel") || location.pathname.includes("write");
  
  // 2. Check karo URL Query (e.g., ?role=writer) - Yeh aapka issue fix karega
  const isWriterQuery = searchParams.get("role") === "writer";

  // Final Decision: Agar dono mein se koi bhi true hai, toh hum Writer World mein hain
  const isWriterWorld = isWriterPath || isWriterQuery;

  const isReaderWorld = location.pathname.includes("reader-home") || location.pathname.includes("novel") || location.pathname.includes("read") || searchParams.get("role") === "reader";

  // Dynamic Auth Role for Login/Register links
  const authRole = isWriterWorld ? "writer" : "reader";

  return (
    <nav className="bg-bg border-b border-border/50 px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-[1126px] mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to={getLogoLink()} className="text-xl font-heading font-bold tracking-tighter">
          Page<span className="text-accent">_</span>turner
        </Link>

        <div className="flex items-center gap-8">
          {userInfo ? (
            <>
              {/* Switch Buttons */}
              {isWriterWorld ? (
                <button 
                  onClick={() => handleSwitch('reader')}
                  className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/10"
                >
                  Logout & Switch to Reader
                </button>
              ) : (
                <button 
                  onClick={() => handleSwitch('writer')}
                  className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 border border-text-h text-text-h rounded-full hover:bg-text-h hover:text-bg transition-all shadow-lg"
                >
                  Logout & Switch to Writer
                </button>
              )}

              {/* Conditional Links */}
              <div className="hidden md:flex items-center gap-6 border-l border-border/50 pl-6 ml-2">
                {isReaderWorld && (
                  <Link to="/reader-home" className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">Archives</Link>
                )}
                
                {isWriterWorld && userInfo.role === "writer" && (
                  <Link to="/create-novel" className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em]">+ New Saga</Link>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="text-[10px] font-mono uppercase tracking-widest opacity-30 hover:text-red-500 hover:opacity-100 transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-8">
              {/* ✨ Dynamic Auth Links based on URL Role ✨ */}
              <Link 
                to={`/login?role=${authRole}`} 
                className={`text-[10px] font-mono uppercase tracking-widest transition-all ${isWriterWorld ? 'text-accent opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                Login {isWriterWorld && "(Writer)"}
              </Link>
              <Link 
                to={`/register?role=${authRole}`} 
                className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;