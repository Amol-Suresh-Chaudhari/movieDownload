import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env or .env.local');
}

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('MongoDB URI found:', MONGODB_URI ? 'Yes' : 'No');
  console.log('MongoDB URI format check:', MONGODB_URI?.startsWith('mongodb://') || MONGODB_URI?.startsWith('mongodb+srv://') ? 'Valid' : 'Invalid');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection failed:', e.message);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
export { dbConnect as connectDB };
