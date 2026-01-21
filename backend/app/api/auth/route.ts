import express from 'express';
import prisma from '../../../lib/prisma.js';
import { hashPassword, comparePassword, generateToken, verifyTokenSimple } from '../../../lib/auth.js';

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashed = await hashPassword(password);
    const newUser = await prisma.user.create({ data: { name, email, password: hashed } });

    // Auto-login after signup by setting cookie
    const token = generateToken(newUser.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // true in production (https)
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

//to verify
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyTokenSimple(token);
    
    // Fetch user data from database
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
