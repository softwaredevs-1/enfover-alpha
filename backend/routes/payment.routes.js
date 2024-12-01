import express from "express";
import { initiatePayment, verifyPayment } from "../controllers/payment.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/initiate", protect, initiatePayment); // Initiate a payment
router.get("/verify", protect, verifyPayment); // Verify a payment

export default router;
