// payments/initiate       POST method in postman
// {
//     "amount": 5000,
//     "email": "student@example.com",
//     "first_name": "John",
//     "last_name": "Doe",
//     "callback_url": "http://localhost:5000/api/payments/verify"
//   }
  
import { Chapa } from "chapa-nodejs";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";

const chapa = new Chapa({ secretKey: process.env.CHAPA_SECRET_KEY });

// @desc    Initiate a payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  const { amount, email, first_name, last_name, callback_url } = req.body;

  try {
    const tx_ref = await chapa.genTxRef(); // Generate unique transaction reference

    // Initialize payment with Chapa
    const response = await chapa.initialize({
      amount,
      currency: "ETB",
      email,
      first_name,
      last_name,
      tx_ref,
      callback_url,
    });

    if (response.status === "success") {
      // Save payment as pending in the database
      await Payment.create({
        user: req.user.id,
        amount,
        tx_ref,
        status: "Pending",
      });

      res.status(200).json({ checkout_url: response.data.checkout_url });
    } else {
      res.status(400).json({ message: "Payment initialization failed" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error initiating payment: ${error.message}` });
  }
};

// @desc    Verify a payment
// @route   GET /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.query;

  try {
    // Verify payment with Chapa
    const response = await chapa.verify({ tx_ref });

    if (response.status === "success" && response.data.status === "success") {
      // Update payment in the database
      const payment = await Payment.findOneAndUpdate(
        { tx_ref },
        { status: "Completed" },
        { new: true }
      );

      // Mark user as subscribed
      await User.findByIdAndUpdate(req.user.id, { isSubscribed: true });

      res.status(200).json({ message: "Payment successful", payment });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error verifying payment: ${error.message}` });
  }
};

export const chapaWebhook = async (req, res) => {
  const { tx_ref, status } = req.body;

  try {
    if (status === "success") {
      // Find user by tx_ref
      const user = await User.findOne({ tx_ref });

      if (user && user.role === "Student") {
        // Update subscription status to subscribed
        user.subscriptionStatus = "subscribed";
        await user.save();

        res.status(200).json({ message: "Subscription updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error handling Chapa webhook: ${error.message}` });
  }
};
