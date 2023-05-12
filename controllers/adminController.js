import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from '../config.js'
import Staff from "../models/Staff.js";
import Issue from "../models/Issue.js";
import Mailer from "../services/mailService.js";

const adminController = {

  // create admin
  createAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new admin with the hashed password
      const admin = new Staff({ name, email, password: hashedPassword, role: "admin" });
      await admin.save();

      res.status(201).json(admin);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Login admin
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the admin by email
      const admin = await Staff.findOne({ email });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found." });
      }
      // Compare passwords
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
      // Generate JWT token
      const token = jwt.sign({ adminId: admin._id }, ENV.JWT_SECRET);
  
      // Attach the user object to req.user
      req.user = admin;
  
      res.json({ message: "Admin login successful.", token });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ error: "Failed to log in admin." });
    }
  },

  // Create a new staff
  createStaff: async (req, res) => {
    try {
      const { name, email, password, isVerified } = req.body;
  
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new staff with the hashed password
      const staff = new Staff({ name, email, password: hashedPassword, isVerified });
      await staff.save();
  
      res.status(201).json(staff);
    } catch (error) {
      console.error("Error creating staff:", error);
      res.status(500).json({ message: "Internal server error on Creating", error });
    }
  },
  

  // Get all issues
  getAllIssues: async (req, res) => {
    try {
      const issues = await Issue.find();
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all employees with the total number of tasks they have done or are doing
  getAllEmployeesWithTasks: async (req, res) => {
    try {
      const employees = await Staff.aggregate([
        {
          $lookup: {
            from: "issues",
            localField: "assignedIssues",
            foreignField: "_id",
            as: "tasks",
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            tasks: 1,
            totalTasks: { $size: "$tasks" },
          },
        },
      ]);

      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
 

  // Get all staff members with the total number of tasks they have done or are doing
getAllStaffWithTasks: async (req, res) => {
  try {
    const staffMembers = await Staff.aggregate([
      {
        $match: { role: "staff" }, // Filter staff members only
      },
      {
        $lookup: {
          from: "issues",
          localField: "assignedIssues",
          foreignField: "_id",
          as: "tasks",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          tasks: 1,
          totalTasks: { $size: "$tasks" },
          completedTasks: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.status", "completed"] },
              },
            },
          },
        },
      },
    ]);

    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
},


  //assign issue to staff
  assignIssue: async (req, res) => {
    try {
      const { issueId, staffId } = req.body;
  
      // Find the staff and issue
      const staff = await Staff.findById(staffId);
      const issue = await Issue.findById(issueId);
  
      if (!staff || !issue) {
        return res.status(404).json({ message: "Staff or issue not found." });
      }
  
      // Check if the issue is already assigned to the staff member
      if (staff.assignedIssues.includes(issueId)) {
        return res.status(400).json({ message: "Issue is already assigned to the staff." });
      }
  
      // Assign the issue to the specified staff
      staff.assignedIssues.push(issueId);
      issue.assigned = staffId;
  
      await staff.save();
      await issue.save();

      const staffemail = staff.email;
      console.log(staffemail);
      
      console.log(issue);
      // Get the issue details
      const { issueNumber, issueDetails, status, name, email, phone, department, place } = issue;

      // Send email to the admin with the issue details
      const emailContent = `An issue has been assigned to you with the following details:\n\nIssue Number: ${issueNumber}\nIssue Details: ${issueDetails}\nStatus: ${status}\nCreated By: ${name}\nEmail: ${email}\nPhone: ${phone}\nDepartment: ${department}\nPlace: ${place}\n\nYou can Check in your dashboard.`;
      Mailer.sendEmail(staffemail, "New Issue Assigned", emailContent);
  
      res.json({ message: "Issue assigned to staff" });
    } catch (error) {
      console.error("Error assigning issue:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },  

  // Update issue status
  updateIssueStatus: async (req, res) => {
    try {
      const { issueId, status } = req.body;

      // Find the issue by ID
      const issue = await Issue.findById(issueId);
      if (!issue) {
        return res.status(404).json({ error: "Issue not found." });
      }

      // Update the issue status
      issue.status = status;
      await issue.save();

      const staffemail = Staff.email;
      console.log(staffemail);
      
      console.log(issue);
      // Get the issue details
      const { issueNumber, issueDetails, name, email, phone, department, place } = issue;

      // Send email to the admin with the issue details
      const emailContent = `Your Issue status has been updated with the following details:\n\nIssue Number: ${issueNumber}\nIssue Details: ${issueDetails}\nStatus: ${status}\nCreated By: ${name}\nEmail: ${email}\nPhone: ${phone}\nDepartment: ${department}\nPlace: ${place}\n\nYou can Check in your dashboard.`;
      Mailer.sendEmail(email, "Issue Status Updated", emailContent);

      res.json({ message: "Issue status updated successfully.", issue });
    } catch (error) {
      console.error("Error updating issue status:", error);
      res.status(500).json({ error: "Failed to update issue status." });
    }
  },

  // Other admin-related methods (getStaffTasks, etc.)
};

export default adminController;
