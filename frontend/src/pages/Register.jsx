import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; // ✨ searchParams add kiya
import api from "../api/axios";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // ✨ Check karo user kis raste se aaya hai
  const intendedRole = searchParams.get("role") || "reader"; 

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: intendedRole // Default role based on URL intent
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Register user
      const { data } = await api.post("/auth/register", formData);
      
      // Step 2: Confirmation
      alert(`Account Created as ${formData.role}! 🚀 Ab login karein.`);
      
      // Step 3: ✨ STRICT REDIRECT ✨
      // Usey automatic uske role-specific login portal par bhej do
      navigate(`/login?role=${formData.role}`);
      
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bg min-h-[85vh]">
      <div className="w-full max-w-md bg-code-bg border border-border p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Dynamic Top Indicator */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${formData.role === 'writer' ? 'bg-accent' : 'bg-text-h'}`} />

        <h1 className="text-4xl font-heading mb-2 text-text-h tracking-tighter">Join PageTurner</h1>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-10">
          Creating {formData.role} credentials
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text/40 ml-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Identity Name"
              className="w-full p-4 bg-bg border border-border rounded-2xl text-text-h outline-none focus:border-accent transition-all font-mono text-sm"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text/40 ml-1">Email</label>
            <input
              type="email"
              required
              placeholder="name@nexus.com"
              className="w-full p-4 bg-bg border border-border rounded-2xl text-text-h outline-none focus:border-accent transition-all font-mono text-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text/40 ml-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-bg border border-border rounded-2xl text-text-h outline-none focus:border-accent transition-all font-mono text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-text/40 ml-1">My Role is...</label>
            <select
              value={formData.role}
              className="w-full p-4 bg-bg border border-border rounded-2xl text-text-h outline-none focus:border-accent transition-all font-mono text-sm appearance-none cursor-pointer"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="reader">Reader (Exploring Stories)</option>
              <option value="writer">Writer (Drafting Worlds)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className={`w-full py-4 ${formData.role === 'writer' ? 'bg-accent' : 'bg-text-h'} text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-6 uppercase text-[10px] tracking-[0.3em]`}
          >
            Initialize {formData.role} Portal
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-mono opacity-40 uppercase tracking-widest">
          Already verified? <Link to="/login" className="text-accent font-bold hover:underline">Access Portal</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;