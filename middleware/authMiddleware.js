import jwt from "jsonwebtoken";
import ENV from "../config.js";

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

    // Attach the decoded token data to the request object
    req.user = { userId: decodedToken.userId };

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default authMiddleware;
