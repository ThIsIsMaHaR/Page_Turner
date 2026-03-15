import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
         return res.status(401).json({ success: false, message: "User not found" });
      }

      return next(); // ✨ Return lagao taaki code yahi ruk jaye aur aage badhe
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    // ✨ Return lagana zaroori hai, warna next error aa sakta hai
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

// Roles Check
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user?.role || 'Guest'}) is not allowed to access this resource` 
      });
    }
    next();
  };
};