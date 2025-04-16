require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Added for keep-alive
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://task-management-nine-taupe.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Improved MongoDB connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err.message);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};
connectWithRetry();

// Enhanced keep-alive function
const startKeepAlive = () => {
  const pingInterval = 14 * 60 * 1000; // 14 minutes
  const pingUrl = `http://localhost:${process.env.PORT || 5000}/api/tasks/health`;
  
  // Create a dedicated health check endpoint
  app.get('/api/tasks/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  const pingServer = () => {
    console.log(`[${new Date().toISOString()}] Sending keep-alive ping`);
    axios.get(pingUrl, { timeout: 5000 })
      .then(() => console.log('Keep-alive successful'))
      .catch(err => console.log('Keep-alive failed:', err.message));
  };

  // Initial ping after 1 minute
  setTimeout(pingServer, 60000);
  // Regular pings
  setInterval(pingServer, pingInterval);
};

// Start keep-alive only in production
if (process.env.NODE_ENV === 'production') {
  startKeepAlive();
}

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});