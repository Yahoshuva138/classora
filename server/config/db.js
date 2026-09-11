import mongoose from 'mongoose';

let currentDbTier = 'NONE';

// Reuse the connection between Vercel invocations
// when the same serverless instance stays warm.
const cached =
  global._classoraMongooseCache ||
  (global._classoraMongooseCache = {
    conn: null,
    promise: null
  });

export async function connectDB() {
  // Already connected
  if (
    cached.conn &&
    mongoose.connection.readyState === 1
  ) {
    currentDbTier = 'TIER_1_MONGODB';

    return {
      tier: currentDbTier,
      uri: 'cached://mongodb'
    };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    currentDbTier = 'NONE';

    throw new Error(
      'MONGODB_URI is not configured. Add MONGODB_URI to the Vercel Environment Variables.'
    );
  }

  try {
    const isCloudUri =
      uri.startsWith('mongodb+srv://') ||
      uri.includes('@');

    console.log(
      `[Classora DB] Connecting to MongoDB ${
        isCloudUri ? 'Cloud Atlas' : 'MongoDB'
      }...`
    );

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(uri, {
          serverSelectionTimeoutMS: 10000,
          maxPoolSize: 10,
          minPoolSize: 0,
          maxIdleTimeMS: 30000,
          serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
          }
        })
        .then((mongooseInstance) => {
          return mongooseInstance;
        })
        .catch((error) => {
          cached.promise = null;
          throw error;
        });
    }

    cached.conn = await cached.promise;

    currentDbTier = 'TIER_1_MONGODB';

    console.log(
      '✅ [Classora DB] MongoDB connection established.'
    );

    return {
      tier: currentDbTier,
      uri: isCloudUri
        ? 'mongodb+srv://[cloud-cluster]'
        : 'mongodb://[configured]'
    };
  } catch (err) {
    cached.conn = null;
    cached.promise = null;
    currentDbTier = 'NONE';

    console.error(
      '❌ [Classora DB] MongoDB connection failed:',
      err.message
    );

    throw new Error(
      `MongoDB connection failed: ${err.message}`
    );
  }
}

export function getDbTier() {
  return currentDbTier;
}

export function isUsingMongoose() {
  return (
    currentDbTier === 'TIER_1_MONGODB'
  );
}

export function getCollection(
  name,
  MongooseModel
) {
  if (isUsingMongoose() && MongooseModel) {
    return MongooseModel;
  }

  throw new Error(
    `MongoDB is not available. Cannot access collection "${name}".`
  );
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  cached.conn = null;
  cached.promise = null;
  currentDbTier = 'NONE';
}
