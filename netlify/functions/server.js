const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const optimizationRoutes = require('../../backend/routes/optimization');
const sessionRoutes = require('../../backend/routes/session');
const authRoutes = require('../../backend/routes/auth');

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://type-less.netlify.app',
    'https://*.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/optimization', optimizationRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Netlify serverless function handler
exports.handler = async (event, context) => {
  return new Promise((resolve) => {
    app(event, {}, (err, result) => {
      if (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message })
        });
      } else {
        resolve(result);
      }
    });
  });
};
