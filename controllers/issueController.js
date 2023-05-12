import Issue from "../models/Issue.js";
import Student from "../models/Student.js";
import Staff from "../models/Staff.js";
import issueMail from "../services/issueMailService.js";

const issueController = {
  createIssue: async (req, res) => {
    try {
      const { email, name, phone, department, place, issueDetails } = req.body;

      // Get the count of existing issues
      const count = await Issue.countDocuments();

      // Generate the next issue number
      const issueNumber = count + 1;

      // Find the student who created the issue
      const student = await Student.findOne({ email });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Create a new issue
      const issue = new Issue({
        issueNumber,
        issueDetails,
        status: "pending",
        assigned: null,
        createdBy: student._id,
        name,
        email,
        phone,
        department,
        place,
      });

      await issue.save();

      // Update the student's issues array
      student.issues.push(issue._id);
      await student.save();

      // Get the admin email from the database
      const admin = await Staff.findOne({ role: "admin" });
      const adminEmail = admin.email;

      // Send email to the admin with the issue details
      const emailContent = `An issue has been created with the following details:\n\nIssue Number: ${issueNumber}\nIssue Details: ${issueDetails}\nStatus: ${issue.status}\nAssigned To: ${issue.assigned ? issue.assigned : 'Not assigned'}\nCreated By: ${name}\nEmail: ${email}\nPhone: ${phone}\nDepartment: ${department}\nPlace: ${place}\n\nYou can Check in your dashboard.`;
      issueMail.sendEmail(adminEmail, "New Issue Created", emailContent);

      const studentEmailContent = `You created an issue with the following details:\n\nIssue Number: ${issueNumber}\nIssue Details: ${issueDetails}\nStatus: ${issue.status}\nAssigned To: ${issue.assigned ? issue.assigned : 'Not assigned'}\nCreated By: ${name}\nEmail: ${email}\nPhone: ${phone}\nDepartment: ${department}\nPlace: ${place}\n\nYou can Check in your dashboard.`;
      issueMail.sendEmail(student.email, "Your Created Issue Details", studentEmailContent);

      res.status(201).json(issue);
    } catch (error) {
      console.error("Error creating issue:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update an issue
  updateIssue: async (req, res) => {
    try {
      const { issueId } = req.params;
      const { issueDetails, status, assigned } = req.body;

      // Find the issue by ID
      const issue = await Issue.findById(issueId);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // Update the issue details
      issue.issueDetails = issueDetails;
      issue.status = status;
      issue.assigned = assigned;

      await issue.save();

      res.json(issue);
    } catch (error) {
      console.error("Error updating issue:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Other issue-related methods (getIssues, getIssue, updateIssue, etc.)
};

export default issueController;
