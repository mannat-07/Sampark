import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './app/api/auth/route.js';
import grievanceRoutes from './app/api/grievance/route.js';
import uploadRoutes from './app/api/upload/route.js';
import adminRoutes from './app/api/admin/route.js';
import chatbotRoutes from './app/api/chatbot/route.js';

// Load environment variables
dotenv.config();

console.log('🚀 Initializing server...');

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

console.log('✅ Express app created');

// Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5173',
  FRONTEND_URL
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  abortOnLimit: true,
}));

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('✅ Health check endpoint registered');

// API routes
console.log('📡 Registering API routes...');
app.use("/api/auth", authRoutes);
app.use("/api/grievance", grievanceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
console.log('✅ API routes registered');

// Serve static files from the React app build
// When running with tsx, __dirname is backend/, so we need to go up one level to reach project root
const distPath = path.join(__dirname, '..', 'dist');
console.log('Serving static files from:', distPath);

// Serve static files with proper configuration
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, filePath) => {
    // Set proper MIME types for assets
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

console.log('✅ Static file serving configured');

// Handle React routing - serve index.html for client-side routes
// Use middleware instead of app.get('*') to avoid Express 5 issues
app.use((req, res, next) => {
  // Skip if response already sent
  if (res.headersSent) {
    return next();
  }
  
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // If it looks like a static file request, skip
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }
  
  // Serve index.html for client-side routing
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal server error');
    }
  });
});

console.log('✅ SPA routing configured');

// Cloud Run requires binding to 0.0.0.0 (all interfaces), not localhost
const HOST = '0.0.0.0';

console.log('========================================');
console.log('Starting server...');
console.log('PORT:', PORT);
console.log('HOST:', HOST);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('========================================');

app.listen(PORT, HOST, () => {
  console.log(`✅ Server successfully started on http://${HOST}:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Ready to accept connections');
});
