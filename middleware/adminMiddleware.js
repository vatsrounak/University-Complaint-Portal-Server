import jwt from "jsonwebtoken";
import ENV from "../config.js";
import Staff from "../models/Staff.js";

const adminMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
    
    // Retrieve the user from the database based on the userId
    const user = await Staff.findById(decodedToken.adminId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the retrieved user object to the req.user
    req.user = user;
    
    // Check if the authenticated user is an admin and is verified
    if (req.user.role !== "admin" || !req.user.isVerified) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(500).json({ message: "Internal server error on Auth", error });
  }
};

export default adminMiddleware;
