import express from "express";
import issueController from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/issue", authMiddleware, issueController.createIssue);
router.put("/issue/:issueId", authMiddleware, issueController.updateIssue);
// Other issue routes (get issues, get issue, update issue, etc.)

export default router;
