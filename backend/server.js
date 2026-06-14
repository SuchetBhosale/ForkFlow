const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require("./routes/aiRoutes");
const http = require('http');
const { Server } = require('socket.io');
const socket = require('./socket');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://forkflow-frontend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://forkflow-frontend.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (clientSocket) => {
  console.log('User connected:', clientSocket.id);
  clientSocket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

socket.setIO(io);

app.use('/api/users', userRoutes);
app.use('/api/menuItem', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => res.send("ForkFlow API is running"));

if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment variables!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });