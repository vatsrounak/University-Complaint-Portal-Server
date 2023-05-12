import Student from "../models/Student.js";
import Issue from "../models/Issue.js";

const userController = {
  getProfile: async (req, res) => {
    try {
      // Get user profile based on the authenticated user
      const user = await Student.findById(req.user.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update the profile of the current user
  updateProfile: async (req, res) => {
    try {
      const { name, email, mobile, department, place } = req.body;

      // Find the user by ID
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's profile
      student.name = name;
      student.mobile = mobile;
      student.department = department;
      student.place = place;

      await student.save();

      res.json({message: "Profile Updated!", student});
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get the issues of the current user
  getUserIssues: async (req, res) => {
    try {
      // Get the issues created by the current user
      const issues = await Issue.find({ createdBy: req.user.userId });
      res.json(issues);
    } catch (error) {
      console.error("Error retrieving user issues:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get details of a single issue
  getIssue: async (req, res) => {
    try {
      const { issueId } = req.params;

      // Find the issue by ID
      const issue = await Issue.findById(issueId);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      res.json(issue);
    } catch (error) {
      console.error("Error retrieving issue details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  
  // Update an issue of current user
  updateIssue: async (req, res) => {
    try {
      const { issueId } = req.params;
      const { name, phone, department, place, issueDetails } = req.body;

      // Find the issue by ID
      const issue = await Issue.findById(issueId);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // Update the issue details
      issue.name = name;
      issue.phone = phone;
      issue.department = department;
      issue.place = place;
      issue.issueDetails = issueDetails;

      await issue.save();
      res.json(issue);
    } catch (error) {
      console.error("Error updating issue:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

};

export default userController;
