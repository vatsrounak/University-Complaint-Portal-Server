import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/", authController.generateOTP);
router.put("/", authController.login);

export default router;
