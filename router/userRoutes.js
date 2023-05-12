import express from "express";
import userController from "../controllers/userController.js";
import issueController from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.post("/issue", authMiddleware, issueController.createIssue);
router.get("/issues", authMiddleware, userController.getUserIssues);
router.get("/issue/:issueId", authMiddleware, userController.getIssue);
router.put("/issue/:issueId", authMiddleware, userController.updateIssue);
// Other user routes (update profile, etc.)

export default router;
