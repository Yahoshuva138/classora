import mongoose from 'mongoose';
import { memoryStore } from '../services/memoryStore.js';

let currentDbTier = 'NONE';
let memoryServerInstance = null;

// Global cache for Vercel Serverless Function instances
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

// Attach connection event listeners to safeguard against runtime network drops
mongoose.connection.on('error', (err) => {
  console.warn(`⚠️ [Classora DB] MongoDB runtime error (${err.message}). Seamlessly serving from MemoryStore.`);
  currentDbTier = 'TIER_3_MEMORY_STORE';
});

mongoose.connection.on('disconnected', () => {
  console.warn(`⚠️ [Classora DB] MongoDB disconnected. Seamlessly serving from MemoryStore.`);
  currentDbTier = 'TIER_3_MEMORY_STORE';
});

export async function connectDB() {
  // Return cached Mongoose connection if already connected (Serverless optimization)
  if (cached.conn && mongoose.connection.readyState === 1) {
    currentDbTier = 'TIER_1_MONGODB';
    return { tier: currentDbTier, uri: 'cached://mongodb' };
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/classora';
  const isCloudUri = uri.startsWith('mongodb+srv://') || uri.includes('@');

  // --- Tier 1: Try Cloud or Local MongoDB URI ---
  try {
    console.log(`[Classora DB] Connecting to MongoDB (${isCloudUri ? 'Cloud Atlas' : 'Local'})...`);
    
    if (!cached.promise) {
      const timeoutMs = isCloudUri ? 5000 : 2000;
      cached.promise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: timeoutMs,
        maxPoolSize: 10,
      }).then(async (m) => {
        // Authenticate and verify real end-to-end socket responsiveness
        await m.connection.db.admin().ping();
        return m;
      });
    }

    cached.conn = await cached.promise;
    currentDbTier = 'TIER_1_MONGODB';
    console.log(`✅ [Classora DB] Tier 1 Active: Successfully connected to MongoDB`);
    return { tier: currentDbTier, uri: isCloudUri ? 'mongodb+srv://[cloud-cluster]' : uri };
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch {}
    console.warn(`⚠️ [Classora DB] Native MongoDB not reachable (${err.message}). Falling back to in-memory resilience.`);
  }

  // --- Tier 2: Try In-Memory MongoDB Server if explicitly enabled via USE_MEMORY_SERVER ---
  if (process.env.USE_MEMORY_SERVER === 'true') {
    try {
      console.log(`[Classora DB] Attempting Tier 2: mongodb-memory-server...`);
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri();
      await mongoose.connect(memUri);
      currentDbTier = 'TIER_2_MEMORY_SERVER';
      console.log(`🚀 [Classora DB] Tier 2 Active: In-memory MongoDB running at ${memUri}`);
      return { tier: currentDbTier, uri: memUri };
    } catch (err) {
      console.warn(`⚠️ [Classora DB] In-memory Mongo server unavailable (${err.message}).`);
    }
  }

  // --- Tier 3: Zero-Dependency Pure JS In-Memory Store ---
  currentDbTier = 'TIER_3_MEMORY_STORE';
  console.log(`🛡️ [Classora DB] Tier 3 Active: High-speed In-Memory JavaScript Store.`);
  console.log(`ℹ️ [Classora DB] Zero crash guarantee: Express REST API is fully operational!`);
  return { tier: currentDbTier, uri: 'memory://internal-js-store' };
}

export function getDbTier() {
  return currentDbTier;
}

export function fallbackToMemoryStore() {
  currentDbTier = 'TIER_3_MEMORY_STORE';
}

export function isUsingMongoose() {
  return (
    (currentDbTier === 'TIER_1_MONGODB' || currentDbTier === 'TIER_2_MEMORY_SERVER') &&
    mongoose.connection.readyState === 1
  );
}

export function getCollection(name, MongooseModel) {
  if (isUsingMongoose() && MongooseModel) {
    return MongooseModel;
  }
  return memoryStore.collection(name);
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
}
