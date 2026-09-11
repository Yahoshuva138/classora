import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, getDbTier } from './config/db.js';
import { checkAndAutoSeed } from './services/seedService.js';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors());

app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Mount main REST API router
app.use('/api', apiRouter);

// Serve static frontend in production if dist exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback for Express 5
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
} else {
  // Root healthcheck fallback when dist not present
  app.get('/', (req, res) => {
    res.json({
      message: 'Classora Academic OS Backend API Running',
      version: '2.0.0',
      tier: getDbTier(),
      docs: '/api/health'
    });
  });
}

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Classora Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Bootstrapping Server
async function startServer() {
  try {
    console.log('==================================================');
    console.log('       CLASSORA ACADEMIC OS — BACKEND SERVER      ');
    console.log('==================================================');
    
    // 1. Connect to DB (3-Tier Resilient Architecture)
    const dbStatus = await connectDB();

    // 2. Auto-Seed data if empty
    await checkAndAutoSeed();

    // 3. Start HTTP Server
    app.listen(PORT, () => {
      console.log(`🚀 [Classora Server] Listening on http://localhost:${PORT}`);
      console.log(`📊 [Classora Server] REST API Base URL: http://localhost:${PORT}/api`);
      console.log(`🛡️ [Classora Server] Active Persistence Tier: ${dbStatus.tier}`);
      console.log('==================================================');
    });
  } catch (error) {
    console.error('❌ Failed to start Classora server:', error);
    process.exit(1);
  }
}

startServer();
