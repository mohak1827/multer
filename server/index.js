require("dotenv").config({ path: "../.env" });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/upload");

const app = express();
const server = http.createServer(app);

// Client URL for CORS
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Socket.IO — attached to same HTTP server
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
  },
});

// Make io accessible in routes via req.app.get('io')
app.set("io", io);

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HealixRefer API is running 🚀" });
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`🔌 Buyer connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Buyer disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready for connections`);
    console.log(`🌐 CORS origin: ${CLIENT_URL}`);
  });
};

startServer();
