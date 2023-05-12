import express from "express";
import staffController from "../controllers/staffController.js";
import staffMiddleware from "../middleware/staffMiddleware.js";

const router = express.Router();

router.post("/auth", staffController.login);
router.get("/tasks/assigned", staffMiddleware, staffController.getAssignedTasks);

export default router;
