import jwt from "jsonwebtoken";
import ENV from "../config.js";
import Student from "../models/Student.js";
import { generateOTP, sendOTP } from "../services/otpService.js";

const authController = {
  generateOTP: async (req, res) => {
    try {
      const { email } = req.body;

      // Generate OTP
      const otp = generateOTP();

      // Create a new user or find an existing user
      let user = await Student.findOne({ email });

      if (!user) {
        // Create a new user if not found
        user = new Student({ email });
      }

      // Save the generated OTP to the user's document in the database
      user.otp = otp;
      await user.save();

      // Send OTP to the user's email
      await sendOTP(email, otp);

      res.json({ message: "OTP sent successfully." });
    } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ error: "Failed to generate OTP." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Find the user by email
      const user = await Student.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Student not found." });
      }

      // Check if the provided OTP matches the stored OTP
      if (otp !== user.otp) {
        return res.status(400).json({ error: "Invalid OTP." });
      }

      // Clear the OTP field
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, ENV.JWT_SECRET);

      res.json({ message: "User login successful.", token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Failed to log in user." });
    }
  },
};

export default authController;
