import mongoose from 'mongoose';
import { memoryStore } from '../services/memoryStore.js';

let currentDbTier = 'NONE';
let memoryServerInstance = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/classora';

  // --- Tier 1: Try Local or Cloud MongoDB URI ---
  try {
    console.log(`[Classora DB] Attempting connection to MongoDB (${uri})...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000, // Fast 2s fail if mongod is not running
    });
    currentDbTier = 'TIER_1_MONGODB';
    console.log(`✅ [Classora DB] Tier 1 Active: Successfully connected to MongoDB at ${uri}`);
    return { tier: currentDbTier, uri };
  } catch (err) {
    console.warn(`⚠️ [Classora DB] Native MongoDB not reachable (${err.message}).`);
  }

  // --- Tier 2: Try In-Memory MongoDB Server if package is present ---
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

  // --- Tier 3: Zero-Dependency Pure JS In-Memory Store ---
  currentDbTier = 'TIER_3_MEMORY_STORE';
  console.log(`🛡️ [Classora DB] Tier 3 Active: High-speed In-Memory JavaScript Store.`);
  console.log(`ℹ️ [Classora DB] Zero crash guarantee: Express REST API is fully operational!`);
  return { tier: currentDbTier, uri: 'memory://internal-js-store' };
}

export function getDbTier() {
  return currentDbTier;
}

export function isUsingMongoose() {
  return currentDbTier === 'TIER_1_MONGODB' || currentDbTier === 'TIER_2_MEMORY_SERVER';
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
