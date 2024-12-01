import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Link payment to the student
    },
    amount: { type: Number, required: true }, // Amount paid in smallest currency unit
    status: { type: String, required: true, enum: ["Pending", "Completed", "Failed"] },
    tx_ref: { type: String, required: true }, // Transaction reference
    method: { type: String }, // Payment method (e.g., card, wallet)
  },
  { timestamps: true } // Automatically include createdAt and updatedAt
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
