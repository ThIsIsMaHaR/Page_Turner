import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // ✨ Get the intent from URL (e.g., /login?role=writer)
  const intendedRole = searchParams.get("role"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Pehle login call karo
      const { data } = await api.post("/auth/login", formData);
      
      // 2. ✨ STRICT VALIDATION ✨
      // Agar user ka role wahi nahi hai jo URL mein maanga gaya hai, toh login block kardo
      if (intendedRole && data.role !== intendedRole) {
        alert(`Aapka account ek ${data.role} account hai. Please ${data.role} portal se login karein.`);
        return; // Stop here, don't save token
      }

      // 3. Agar role match kar gaya, tabhi aage badho
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // Redirect to correct world
      if (data.role === "writer") {
        navigate(`/profile/${data._id}`);
      } else {
        navigate("/reader-home");
      }
      
      window.location.reload(); 

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed. Credentials check karein.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bg min-h-[80vh]">
      <div className="w-full max-w-md bg-code-bg border border-border p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Accent Top Bar */}
        <div className={`absolute top-0 left-0 w-full h-1 ${intendedRole === 'writer' ? 'bg-accent' : 'bg-text-h'}`} />

        <h1 className="text-4xl font-heading mb-3 text-text-h tracking-tighter">
          {intendedRole === "writer" ? "Writer Studio" : intendedRole === "reader" ? "Reader Library" : "Portal Login"}
        </h1>
        <p className="text-sm text-text opacity-40 mb-10 font-mono uppercase tracking-widest">
          {intendedRole ? `Verify your ${intendedRole} credentials` : "Access your PageTurner account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-text/40 ml-1">Archive ID (Email)</label>
            <input
              type="email"
              required
              placeholder="name@nexus.com"
              className="w-full p-4 bg-bg border border-border rounded-2xl text-text-h outline-none focus:border-accent transition-all font-mono text-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-text/40 ml-1">Passkey</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-bg border border-border rounded-2xl text-text-h outline-none focus:border-accent transition-all font-mono text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className={`w-full py-4 ${intendedRole === 'writer' ? 'bg-accent' : 'bg-text-h'} text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-6 uppercase text-xs tracking-[0.2em]`}>
            Authorize {intendedRole || "Session"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-border/30 flex justify-between items-center">
          <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
            New Entity?
          </p>
          <Link to="/register" className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;