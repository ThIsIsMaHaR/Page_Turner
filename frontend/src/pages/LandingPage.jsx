import { useEffect } from "react"; // ✨ useEffect add kiya
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  // ✨ User status check karo
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    // 🛡️ SECURITY GUARD: Agar user pehle se login hai, toh usey Landing Page mat dikhao
    if (userInfo) {
      if (userInfo.role === "writer") {
        navigate(`/profile/${userInfo._id}`);
      } else {
        navigate("/reader-home");
      }
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-bg">
      
      {/* --- Writer's Side --- */}
      <div 
        onClick={() => navigate("/login?role=writer")}
        className="group relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:flex-[1.5] border-r border-border/20"
      >
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 bg-code-bg opacity-40 group-hover:opacity-60 transition-opacity" />
        
        <div className="relative z-10 text-center p-10">
          <span className="text-accent font-mono text-xs uppercase tracking-[0.5em] mb-4 block opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
            Create Worlds
          </span>
          <h2 className="text-6xl md:text-8xl font-heading text-text-h tracking-tighter mb-6">Writer.</h2>
          <p className="max-w-xs mx-auto text-text opacity-40 group-hover:opacity-100 transition-opacity italic font-light">
            "Every secret of a writer's soul, every experience of his life, is written large in his works."
          </p>
          <div className="mt-10 h-1 w-0 bg-accent group-hover:w-full transition-all duration-700 mx-auto" />
        </div>
      </div>

      {/* --- Reader's Side --- */}
      <div 
        onClick={() => navigate("/login?role=reader")}
        className="group relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:flex-[1.5] bg-bg"
      >
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 text-center p-10">
          <span className="text-accent font-mono text-xs uppercase tracking-[0.5em] mb-4 block opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
            Explore Archives
          </span>
          <h2 className="text-6xl md:text-8xl font-heading text-text-h tracking-tighter mb-6">Reader.</h2>
          <p className="max-w-xs mx-auto text-text opacity-40 group-hover:opacity-100 transition-opacity italic font-light">
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          </p>
          <div className="mt-10 h-1 w-0 bg-text-h group-hover:w-full transition-all duration-700 mx-auto" />
        </div>
      </div>

      {/* Center Branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-bg border border-border px-8 py-4 rounded-full shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-heading font-bold tracking-tighter">
            Page<span className="text-accent">.</span>turner
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;