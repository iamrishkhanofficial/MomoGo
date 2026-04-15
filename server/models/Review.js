import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    role: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Customer",
    },
    quote: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, orderId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Review", reviewSchema);
