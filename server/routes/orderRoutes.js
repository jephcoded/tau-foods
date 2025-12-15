const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/user");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

// ---------------------------------------------------
// CREATE ORDER (ADD TO CART + CHECKOUT)
// ---------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      items,
      totalPrice,
      campus,
      hostel,
      roomNumber,
      paymentMethod,
    } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      campus,
      hostel,
      roomNumber,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
    });

    const saved = await newOrder.save();

    const io = req.app.get("io");
    if (io) io.emit("new_order", saved);

    // Send push notification to the order owner if they have a saved Expo push token
    try {
      const user = await User.findById(userId).select("expoPushToken");
      if (user && user.expoPushToken && Expo.isExpoPushToken(user.expoPushToken)) {
        const messages = [
          {
            to: user.expoPushToken,
            sound: "default",
            title: "Order received",
            body: `We received your order (${saved._id}). We'll notify you when status changes.`,
            data: { orderId: saved._id },
          },
        ];

        const chunks = expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
          await expo.sendPushNotificationsAsync(chunk);
        }
      }
    } catch (e) {
      console.error("Push notification error:", e);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ---------------------------------------------------
// ADMIN – GET ALL ORDERS
// ---------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------------------------------
// USER – GET MY ORDERS
// ---------------------------------------------------
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------------------------------
// ADMIN – UPDATE ORDER STATUS
// ---------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    const io = req.app.get("io");
    if (io) io.emit("order_update", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
