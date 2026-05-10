const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectMongoDB = require('./config/mongodb');
connectMongoDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const apiRoutes = require('./routes/api');
const searchRoutes = require('./routes/search');
const tutorialRoutes = require('./routes/tutorials');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const quizRoutes = require('./routes/quizRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');
const { sessionTracker } = require('./middleware/session');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));

// CORS configuration
app.use(cors({
  origin: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/api/videos', videoRoutes);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(logger);
app.use(sessionTracker);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quiz', quizRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
