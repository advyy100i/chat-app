const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { createClient } = require('redis'); // ✨ NEW: Redis Client ✨

const { runConsumer } = require('./kafka/consumer');
const { sendMessageToKafka } = require('./kafka/producer');
const authRoutes = require('./auth/authRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 1e8
});

// ✨ NEW: Redis Client Setup ✨
const redisClient = createClient({
  url: 'redis://localhost:6379' // Or 'redis://redis:6379' if using Docker Compose network
});

redisClient.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('❌ Redis connection error:', err);
  }
}
connectRedis();


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auth routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error", err));

// Server-side redirection for the root URL
app.get('/', (req, res) => {
  res.redirect('/auth.html');
});

// Serve client static files
app.use(express.static(path.join(__dirname, '../client')));


// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, 'supersecretkey');
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Store typing users
const typingUsers = new Set(); // To keep track of who is currently typing

// Socket.IO connections
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id} (Username: ${socket.user.username})`);

  socket.on('chat message', async (clientMsg) => {
    // Also remove typing status when message is sent
    if (typingUsers.has(socket.user.username)) {
      typingUsers.delete(socket.user.username);
      await redisClient.del(`typing:${socket.user.username}`);
      io.emit('stop typing', socket.user.username); // Broadcast stop typing
    }

    const enrichedMsg = {
      sender: socket.user.username,
      timestamp: new Date(),
    };

    if (clientMsg.type === 'text') {
        enrichedMsg.type = 'text';
        enrichedMsg.content = clientMsg.content;
    } else if (clientMsg.type === 'image') {
        enrichedMsg.type = 'image';
        enrichedMsg.data = clientMsg.data;
    } else {
        enrichedMsg.type = 'text';
        enrichedMsg.content = "Unknown message type";
    }

    io.emit('chat message', enrichedMsg);
    await sendMessageToKafka(enrichedMsg);
  });

  // ✨ NEW: Typing Status Events ✨
  socket.on('typing', async () => {
    const username = socket.user.username;
    if (!typingUsers.has(username)) {
      typingUsers.add(username);
      // Set a key in Redis with a short expiry
      await redisClient.set(`typing:${username}`, 'true', { EX: 5 }); // Expires in 5 seconds
      socket.broadcast.emit('user typing', username); // Broadcast to others
    }
  });

  socket.on('stop typing', async () => {
    const username = socket.user.username;
    if (typingUsers.has(username)) {
      typingUsers.delete(username);
      await redisClient.del(`typing:${username}`);
      socket.broadcast.emit('stop typing', username); // Broadcast to others
    }
  });

  socket.on('disconnect', async () => {
    console.log(`❌ User disconnected: ${socket.id} (Username: ${socket.user.username})`);
    // Remove user from typing status if they disconnect
    if (socket.user && typingUsers.has(socket.user.username)) {
      typingUsers.delete(socket.user.username);
      await redisClient.del(`typing:${socket.user.username}`);
      socket.broadcast.emit('stop typing', socket.user.username);
    }
  });
});

// Start Kafka consumer
runConsumer().catch(console.error);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});