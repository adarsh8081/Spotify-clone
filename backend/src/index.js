require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const songRoutes = require('./routes/music');
const playlistRoutes = require('./routes/playlists');
const searchRoutes = require('./routes/search');
const socialRoutes = require('./routes/social');
const { router: notificationRoutes } = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spotify-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('Database URL:', process.env.MONGODB_URI || 'mongodb://localhost:27017/spotify-clone');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Add MongoDB connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join user's room for notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle real-time notifications
  socket.on('notification', (data) => {
    io.to(data.userId).emit('new-notification', data);
  });

  // Handle live chat messages
  socket.on('chat-message', (data) => {
    io.to(data.roomId).emit('new-message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 