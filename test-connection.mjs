import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';

// Load .env file manually
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key.trim()) {
        process.env[key.trim()] = value;
      }
    }
  });
}

console.log('=== MongoDB Connection Test ===');
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);

if (process.env.MONGODB_URI) {
  console.log('Connecting to MongoDB...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
} else {
  console.error('❌ MONGODB_URI not found');
}
