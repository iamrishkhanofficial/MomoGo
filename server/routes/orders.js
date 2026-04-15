import express from "express";
import Order from "../models/Order.js";
import OrderStatusHistory from "../models/OrderStatusHistory.js";
import Notification from "../models/Notification.js";
import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Guest checkout
router.post("/guest", async (req, res) => {
  try {
    const { customerInfo, items } = req.body;

    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address || !customerInfo.city) {
      return res.status(400).json({ error: "Missing required customer information" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const normalizedItems = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: Number(item.quantity),
    }));

    const hasInvalidItem = normalizedItems.some(
      (item) => !item.menuItemId || !Number.isInteger(item.quantity) || item.quantity < 1
    );

    if (hasInvalidItem) {
      return res.status(400).json({ error: "Invalid order items" });
    }

    const menuItemIds = [...new Set(normalizedItems.map((item) => item.menuItemId.toString()))];
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({ error: "Some menu items are unavailable" });
    }

    const menuItemMap = new Map(menuItems.map((item) => [item._id.toString(), item]));
    let totalAmount = 0;

    const orderItems = normalizedItems.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId.toString());
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    const order = new Order({
      items: orderItems,
      customerInfo,
      totalAmount,
      status: "pending",
    });

    await order.save();

    return res.status(201).json(order);
  } catch (error) {
    console.error("Error creating guest order:", error);
    return res.status(500).json({ error: "Failed to create guest order" });
  }
});

// All order routes require authentication
router.use(requireAuth);

// Create new order from cart
router.post("/", async (req, res) => {
  try {
    const { customerInfo } = req.body;

    // Validation
    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address || !customerInfo.city) {
      return res.status(400).json({ error: "Missing required customer information" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.menuItemId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      const itemTotal = item.menuItemId.price * item.quantity;
      totalAmount += itemTotal;
      return {
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
      };
    });

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      customerInfo,
      totalAmount,
      status: 'pending',
    });

    await order.save();

    // Create initial status history
    const statusHistory = new OrderStatusHistory({
      orderId: order._id,
      status: 'pending',
      updatedBy: req.user.id,
      notes: 'Order placed',
    });
    await statusHistory.save();

    // Create notification
    const notification = new Notification({
      userId: req.user.id,
      type: 'order_status',
      title: 'Order Placed Successfully',
      message: `Your order #${order._id.toString().slice(-6)} has been placed and is pending confirmation.`,
      relatedOrderId: order._id,
    });
    await notification.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get user's orders (or all orders for admin)
router.get("/", async (req, res) => {
  try {
    let query = {};

    // If not admin, only show user's own orders
    if (req.user.role !== "admin") {
      query.userId = req.user.id;
    }

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get analytics overview (admin only)
router.get("/analytics/overview", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const [summaryAgg, statusAgg, topItemsAgg] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            averageOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            quantity: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const dailyAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMap = new Map(dailyAgg.map((entry) => [entry._id, entry]));
    const ordersByDay = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const found = dayMap.get(key);

      return {
        date: key,
        orders: found?.orders || 0,
        revenue: found?.revenue || 0,
      };
    });

    const summary = summaryAgg[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    };

    const statusDefaults = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
    };

    const statusBreakdown = statusAgg.reduce((acc, current) => {
      acc[current._id] = current.count;
      return acc;
    }, statusDefaults);

    return res.json({
      summary: {
        totalOrders: summary.totalOrders,
        totalRevenue: Number(summary.totalRevenue.toFixed(2)),
        averageOrderValue: Number(summary.averageOrderValue.toFixed(2)),
      },
      statusBreakdown,
      ordersByDay,
      topItems: topItemsAgg.map((item) => ({
        name: item._id,
        quantity: item.quantity,
        revenue: Number(item.revenue.toFixed(2)),
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return res.status(500).json({ error: "Failed to fetch analytics overview" });
  }
});

// Get single order details
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("items.menuItemId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user has permission to view this order
    const ownerId = order.userId?._id?.toString?.() || order.userId?.toString?.();
    if (req.user.role !== "admin" && ownerId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Cancel pending order (customer can cancel own order, admin can cancel any)
router.post("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const isOwner = order.userId?.toString?.() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    const statusHistory = new OrderStatusHistory({
      orderId: order._id,
      status: "cancelled",
      updatedBy: req.user.id,
      notes: isOwner ? "Order cancelled by customer" : "Order cancelled by admin",
    });
    await statusHistory.save();

    if (order.userId) {
      const notification = new Notification({
        userId: order.userId,
        type: "order_status",
        title: "Order Cancelled",
        message: `Your order #${order._id.toString().slice(-6)} has been cancelled.`,
        relatedOrderId: order._id,
      });
      await notification.save();
    }

    return res.json(order);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "Failed to cancel order" });
  }
});

// Update order status (admin only)
router.put("/:id/status", async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Create status history entry
    const statusHistory = new OrderStatusHistory({
      orderId: order._id,
      status,
      updatedBy: req.user.id,
      notes: notes || `Status updated to ${status}`,
    });
    await statusHistory.save();

    // Create notification for customer
    const statusMessages = {
      confirmed: 'Your order has been confirmed and will be prepared soon.',
      preparing: 'Your order is being prepared.',
      out_for_delivery: 'Your order is out for delivery!',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.',
    };

    if (statusMessages[status] && order.userId) {
      const notification = new Notification({
        userId: order.userId,
        type: 'order_status',
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}`,
        message: statusMessages[status],
        relatedOrderId: order._id,
      });
      await notification.save();
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get order status history
router.get("/:id/history", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user has permission
    if (req.user.role !== "admin" && order.userId?.toString?.() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const history = await OrderStatusHistory.find({ orderId: req.params.id })
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

export default router;
