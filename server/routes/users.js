import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  phone: user.phone || "",
  role: user.role,
});

// All user routes require authentication
router.use(requireAuth);

// Get current user profile
router.get("/me", (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

// Update current user profile
router.patch("/me", async (req, res) => {
  try {
    const { name, phone } = req.body ?? {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          name: name.trim(),
          phone: typeof phone === "string" ? phone.trim() : "",
        },
      }
    );

    const updatedUser = await User.findById(req.user._id);
    return res.json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

// Change current user password
router.patch("/me/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body ?? {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: req.user._id }, { $set: { passwordHash } });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
});

// Get all users (admin only)
router.get("/", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });

    // Get order counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          orderCount,
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get single user details (admin only)
router.get("/:id", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const user = await User.findById(req.params.id, '-passwordHash');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's orders
    const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      ...user.toObject(),
      orders,
      orderCount: orders.length,
      totalSpent,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
