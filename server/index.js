require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint (before other routes)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Server is running' }));
app.get('/', (req, res) => res.json({ message: 'Team Task Manager API is running 🚀' }));

// Connect to DB (non-blocking)
connectDB();

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
});

// Attach io to requests
app.use((req, res, next) => { req.io = io; next(); });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  socket.on('join:project', (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  socket.on('leave:project', (projectId) => {
    socket.leave(projectId);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI configured: ${process.env.MONGO_URI ? 'Yes' : 'No'}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'Not set'}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
