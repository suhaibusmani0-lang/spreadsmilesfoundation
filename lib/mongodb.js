import mongoose from 'mongoose';

const DEFAULT_REAL_URI =
  'mongodb+srv://Suhaib:Suhaib123@cluster0.u8zjidw.mongodb.net/spreadsmiles?retryWrites=true&w=majority';

// Use env variable, or if env variable contains placeholder without cluster ID or invalid creds, use the real verified URI
let activeUri = process.env.MONGODB_URI;
if (
  !activeUri ||
  (activeUri.includes('cluster0.mongodb.net') && !activeUri.includes('u8zjidw')) ||
  activeUri.includes('<db_password>') ||
  activeUri.includes('<password>')
) {
  activeUri = DEFAULT_REAL_URI;
}

const MONGODB_URI = activeUri;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4 to eliminate slow IPv6 DNS resolution on Atlas
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('✅ Connected to MongoDB Atlas successfully');
        return m;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
