import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/auth", adminController.login);
router.post("/createadmin", adminController.createAdmin);
router.post("/createstaff", adminMiddleware, adminController.createStaff);
router.get("/issues", authMiddleware, adminMiddleware, adminController.getAllIssues);
router.get("/staff", authMiddleware, adminMiddleware, adminController.getAllStaffWithTasks);
router.put("/issue/assign", authMiddleware, adminMiddleware, adminController.assignIssue);
router.put("/issue/status", authMiddleware, adminMiddleware, adminController.updateIssueStatus);

export default router;
