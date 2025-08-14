// Load environment variables BEFORE anything else that might read process.env
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import suppliesRoutes from './routes/supplyRoutes';

const app = express();

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: 'http://localhost:3000', // your Next.js dev origin
    credentials: true,               // allow cookies/authorization headers
  })
);
app.use(express.json());   // parse JSON bodies
app.use(cookieParser());   // read/write token cookie

/* ---------- Health check ---------- */
app.get('/ping', (_req, res) => res.send('pong'));

/* ---------- API routes ---------- */
app.use('/api/auth', authRoutes);        // /api/auth/register, /login, /logout, /me
app.use('/api/supplies', suppliesRoutes); // /api/supplies CRUD

/* ---------- 404 fallback ---------- */
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ---------- Start server once Mongo connects ---------- */
const PORT = process.env.PORT || 5050;

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB:', err);
  });

/* ---------- Optional: unhandled rejections safety ---------- */
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED PROMISE REJECTION:', reason);
});
