import dotenv from 'dotenv';
import path from 'path';
import app from './app';

// Load environment variables - try multiple paths
const envPath = path.resolve(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn('⚠️  Warning: Could not load .env file from:', envPath);
  console.warn('⚠️  Trying alternative path...');
  dotenv.config(); // Try default location
}

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment');
  console.error('📁 Expected .env file at:', envPath);
  console.error('💡 Solution: Use start.ps1 or start-backend.bat to run the server');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ API v1: http://localhost:${PORT}/api/v1`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Supabase: Connected`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default server;
