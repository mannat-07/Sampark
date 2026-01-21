import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import authRoutes from './app/api/auth/route.js';
import grievanceRoutes from './app/api/grievance/route.js';
import uploadRoutes from './app/api/upload/route.js';

dotenv.config();

const app = express(); // works correctly now
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

app.use(cors({
  origin: FRONTEND_URL, // from environment variable
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  abortOnLimit: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/grievance", grievanceRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
