
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in .env');
}

const createToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

/** POST /api/auth/register — create account only (no cookie) */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashed });

    // use user.id (string) instead of user._id (unknown)
    return res
      .status(201)
      .json({ id: user.id, email: user.email, message: 'Account created. Please log in.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

/** POST /api/auth/login — set cookie on success */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user.id); // user.id is a string
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set true behind HTTPS/proxy in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out' });
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not signed in' });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('_id email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // again, return user.id instead of _id
    return res.json({ id: user.id, email: user.email });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
