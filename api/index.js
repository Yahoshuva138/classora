import express from 'express';
import cors from 'cors';
import { connectDB } from '../server/config/db.js';
import { checkAndAutoSeed } from '../server/services/seedService.js';
import apiRouter from '../server/routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());

let isInitialized = false;
async function ensureDbInitialized() {
  if (!isInitialized) {
    await connectDB();
    await checkAndAutoSeed();
    isInitialized = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (err) {
    console.error('[Vercel Serverless Init Error]:', err);
    res.status(500).json({ success: false, error: 'Database initialization failed', details: err.message });
  }
});

// Root API status endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'vercel-serverless',
    version: '2.0.0',
    message: 'Classora SST Academic OS Serverless API'
  });
});

// Support both /api/... and direct rewrites on Vercel
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
