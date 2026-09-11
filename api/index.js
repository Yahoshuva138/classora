import express from 'express';
import cors from 'cors';
import { connectDB, getDbTier } from '../server/config/db.js';
import { checkAndAutoSeed } from '../server/services/seedService.js';
import apiRouter from '../server/routes/api.js';

const app = express();

const allowedOrigins = [
  'https://classora-sigma.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173'
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('CORS: Origin not allowed')
      );
    },
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));

let initializationPromise = null;

async function ensureDbInitialized() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectDB();
      await checkAndAutoSeed();

      console.log(
        `[Classora] Database initialized: ${getDbTier()}`
      );

      return true;
    })().catch((err) => {
      initializationPromise = null;
      throw err;
    });
  }

  return initializationPromise;
}

// Initialize DB before API requests.
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (err) {
    console.error(
      '[Vercel Serverless DB Initialization Error]:',
      err
    );

    res.status(500).json({
      success: false,
      error: 'Database initialization failed.'
    });
  }
});

// API status
app.get('/api', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'vercel-serverless',
    version: '2.1.0',
    database: getDbTier(),
    message: 'Classora SST Academic OS Serverless API'
  });
});

// IMPORTANT:
// Vercel already rewrites /api/* -> /api/index.js.
// Therefore mount the router only once.
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API route not found.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Classora API Error]:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error.'
  });
});

export default app;
