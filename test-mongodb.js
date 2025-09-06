// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('=== MongoDB Connection Test ===');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI value:', process.env.MONGODB_URI || 'NOT FOUND');
console.log('MONGODB_URI format valid:', 
  process.env.MONGODB_URI?.startsWith('mongodb://') || 
  process.env.MONGODB_URI?.startsWith('mongodb+srv://') ? 'YES' : 'NO'
);

if (process.env.MONGODB_URI) {
  console.log('\nTesting connection...');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connection successful!');
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
    });
} else {
  console.error('❌ No MONGODB_URI found in environment variables');
}
