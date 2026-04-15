import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET approved reviews (public)
router.get("/", async (req, res) => {
  try {
    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 20) : 10;

    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// POST create review (public)
router.post("/", async (req, res) => {
  try {
    const { name, role, quote, rating } = req.body;

    if (!name || !quote || !rating) {
      return res.status(400).json({ message: "Name, rating, and review text are required" });
    }

    const normalizedRating = Number(rating);
    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const review = new Review({
      name: String(name).trim(),
      role: role ? String(role).trim() : "Customer",
      quote: String(quote).trim(),
      rating: normalizedRating,
      isApproved: true,
    });

    await review.save();
    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Failed to submit review" });
  }
});

// GET reviewed order ids for current user
router.get("/my-order-ids", requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id, orderId: { $ne: null } }).select("orderId");
    const reviewedOrderIds = reviews
      .map((item) => item.orderId?.toString?.())
      .filter(Boolean);

    return res.json({ reviewedOrderIds });
  } catch (error) {
    console.error("Error fetching reviewed order ids:", error);
    return res.status(500).json({ message: "Failed to fetch review metadata" });
  }
});

// POST create review for a delivered order (authenticated customer)
router.post("/order/:orderId", requireAuth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Customers only" });
    }

    const { orderId } = req.params;
    const { quote, rating } = req.body;

    if (!quote || !rating) {
      return res.status(400).json({ message: "Rating and review text are required" });
    }

    const normalizedRating = Number(rating);
    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const ownerId = order.userId?._id?.toString?.() || order.userId?.toString?.();
    if (ownerId !== req.user.id) {
      return res.status(403).json({ message: "You can review only your own delivered orders" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Only delivered orders can be reviewed" });
    }

    const existingReview = await Review.findOne({ userId: req.user.id, orderId });
    if (existingReview) {
      return res.status(409).json({ message: "You have already reviewed this order" });
    }

    const review = new Review({
      userId: req.user.id,
      orderId,
      name: req.user.name,
      role: "Verified Customer",
      quote: String(quote).trim(),
      rating: normalizedRating,
      isApproved: true,
    });

    await review.save();
    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating delivered-order review:", error);
    return res.status(500).json({ message: "Failed to submit review" });
  }
});

export default router;
