import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in .env');
}

// Create a JWT for a user id
const createToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// Helper: read token from Cookie or Authorization header
const getTokenFromReq = (req: Request): string | null => {
  const fromCookie = (req as any).cookies?.token as string | undefined;
  if (fromCookie) return fromCookie;

  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring('Bearer '.length);
  }
  return null;
};

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashed });

    const token = createToken(user.id.toString());
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true in production behind HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user.id.toString());
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true in production behind HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ id: user._id, email: user.email });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// POST /api/auth/logout
export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out' });
};

// GET /api/auth/me
export const me = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(payload.id).select('_id email');

    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    return res.json({ id: user._id, email: user.email });
  } catch {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};
