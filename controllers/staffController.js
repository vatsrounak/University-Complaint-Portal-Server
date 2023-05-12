import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from '../config.js'
import Staff from "../models/Staff.js";
import Issue from "../models/Issue.js";

const staffController = {

  // Login staff
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the staff by email
      const staff = await Staff.findOne({ email });
      if (!staff) {
        return res.status(404).json({ error: "Staff not found." });
      }
      // Compare passwords
      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
      // Generate JWT token
      const token = jwt.sign({ staffId: staff._id }, ENV.JWT_SECRET);
  
      // Attach the user object to req.user
      req.user = staff;
  
      res.json({ message: "Staff login successful.", token });
    } catch (error) {
      console.error("Error logging in staff:", error);
      res.status(500).json({ error: "Failed to log in staff." });
    }
  },

  // Get assigned tasks
  getAssignedTasks: async (req, res) => {
    try {
      const staff = await Staff.findById(req.user._id).populate("assignedIssues");
      res.json(staff.assignedIssues);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Other staff-related methods (getCompletedTasks, etc.)
};

export default staffController;
