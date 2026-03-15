import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import WriteChapter from "./pages/WriteChapter";
import CreateNovel from "./pages/CreateNovel";
import NovelDetails from "./pages/NovelDetails";
import ReadChapter from "./pages/ReadChapter";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage"; // ✨ Naya Landing Page
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Router>
      <div id="root" className="min-h-screen flex flex-col">
        {/* Navbar ko hum Home/Profile/Read pages par dikhayenge, Landing par nahi taaki immersive feel aaye */}
        <Routes>
          <Route path="/" element={null} /> {/* Landing page par Navbar hide karne ke liye */}
          <Route path="*" element={<Navbar />} />
        </Routes>

        <main className="flex-1 w-full">
          <Routes>
            {/* ✨ GATEWAY: Sabse pehle user yahan aayega */}
            <Route path="/" element={<LandingPage />} />

            {/* ✨ READER WORLD: Stories explore karne ke liye */}
            <Route path="/reader-home" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Novel & Reading (Public) */}
            <Route path="/novel/:id" element={<NovelDetails />} />
            <Route path="/read/:id" element={<ReadChapter />} />
            
            {/* Profile & Dashboard */}
            <Route path="/profile/:id" element={<Profile />} />
            <Route 
              path="/profile" 
              element={
                user ? <Navigate to={`/profile/${user._id}`} replace /> : <Navigate to="/login" replace />
              } 
            />

            {/* ✨ WRITER WORLD (Protected) */}
            <Route 
              path="/create-novel" 
              element={
                <ProtectedRoute>
                  <CreateNovel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/write/:id" 
              element={
                <ProtectedRoute>
                  <WriteChapter />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/:id" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;