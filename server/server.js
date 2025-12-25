// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const http = require("http");
const fs = require("fs");

const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// --------------------
// MIDDLEWARES
// --------------------
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));


// --------------------
// JWT VERIFY MIDDLEWARE
// --------------------
app.use((req, res, next) => {
  // Skip login and register
  if (
    req.originalUrl.includes("login") ||
    req.originalUrl.includes("register") ||
    req.originalUrl.includes("/api/users/signup")
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(); // allow non-protected routes to continue
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded; // attach user ID to request
  } catch (err) {
    // token invalid → continue but user is not authenticated
  }

  next();
});


// --------------------
// DATABASE
// --------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/taufoods")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));


// --------------------
// SOCKET.IO
// --------------------
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
});


// --------------------
// ROUTES
// --------------------
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("✅ TAUfoods Backend Running Fine");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});


// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || "*"}`);
  console.log(`🌐 MongoDB: ${process.env.MONGO_URI ? 'Connected to cloud DB' : 'Using local DB'}`);
});


