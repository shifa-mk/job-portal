import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Ensure token is extracted from cookies
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Find user and attach to request (excluding password)
    req.user = await User.findById(decoded.userId).select("-password");
    req.id = decoded.userId; // Add this line to attach userId
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default isAuthenticated;
