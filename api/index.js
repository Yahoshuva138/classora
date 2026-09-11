import express from 'express';
import cors from 'cors';

import { connectDB } from '../server/config/db.js';
import { checkAndAutoSeed } from '../server/services/seedService.js';
import apiRouter from '../server/routes/api.js';

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Database initialization
// -------------------------
let isInitialized = false;

async function ensureDbInitialized() {
  if (!isInitialized) {
    await connectDB();
    await checkAndAutoSeed();
    isInitialized = true;
  }
}

// Initialize database before handling API requests
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (err) {
    console.error('[Vercel Serverless Init Error]:', err);

    res.status(500).json({
      success: false,
      error: 'Database initialization failed',
      details: err.message
    });
  }
});

// -------------------------
// Root API status endpoint
// -------------------------
app.get('/api', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'vercel-serverless',
    version: '2.0.0',
    message: 'Classora SST Academic OS Serverless API'
  });
});

// -------------------------
// API Routes
// -------------------------
// Mount the router only once.
app.use('/api', apiRouter);

// -------------------------
// Export for Vercel
// -------------------------
export default app;
