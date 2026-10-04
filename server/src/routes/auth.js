import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role || 'Student / Fresh Graduate'
    });

    const token = generateToken(user);
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Special check for demo seed account fallback
    const isMatch = await bcrypt.compare(password, user.passwordHash) || (email === 'demo@student.edu' && password === 'password123');
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Demo login (Instant one-click access)
router.post('/demo-login', async (req, res) => {
  try {
    const demoUser = db.getUserByEmail('demo@student.edu');
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo account not found' });
    }
    const token = generateToken(demoUser);
    return res.json({
      message: 'Logged in as Demo User',
      token,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Demo login failed' });
  }
});

// Get Current User Profile
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
