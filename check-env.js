// Check .env file directly
const fs = require('fs');
const path = require('path');

console.log('=== Environment Check ===');

// Try to read .env file
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('.env file found');
    
    // Look for MONGODB_URI
    const lines = envContent.split('\n');
    const mongoLine = lines.find(line => line.startsWith('MONGODB_URI='));
    
    if (mongoLine) {
      const uri = mongoLine.split('=')[1];
      console.log('MONGODB_URI found in .env:', uri);
      console.log('URI format valid:', uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'));
      
      if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        console.log('❌ Invalid URI format. Must start with "mongodb://" or "mongodb+srv://"');
      } else {
        console.log('✅ URI format is valid');
      }
    } else {
      console.log('❌ MONGODB_URI not found in .env file');
    }
  } else {
    console.log('❌ .env file not found');
  }
} catch (error) {
  console.log('Error reading .env file:', error.message);
}

// Also check process.env
console.log('\nProcess environment:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI value:', process.env.MONGODB_URI || 'NOT FOUND');
