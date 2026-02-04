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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/grievance", grievanceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

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

// Handle React routing - serve index.html for any non-API, non-asset routes
// This must come AFTER express.static
app.get('*', (req, res) => {
  // Don't serve index.html for API routes or asset requests
  if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
    return res.status(404).send('Not found');
  }
  
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
