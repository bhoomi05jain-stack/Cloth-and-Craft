import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { registerSchema, loginSchema } from '../schemas/zod.schemas';
import { generateToken, authMiddleware, AuthRequest, cookieOpts } from '../middleware/auth';
import { store } from '../lib/store';
import { seedDemoUser } from '../lib/seedDemo';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    if (store.usersByEmail.has(data.email.toLowerCase())) {
      return res.status(409).json({ error: true, message: 'Email already registered' });
    }
    const user = store.newUser({
      email: data.email,
      passwordHash: await bcrypt.hash(data.password, 12),
      name: data.name,
      avatarEmoji: data.avatarEmoji || '🧚‍♀️'
    });
    const verify = randomBytes(24).toString('hex');
    store.verifyTokens.push({ userId: user.id, token: verify, expiresAt: Date.now() + 86400000 });
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOpts());
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, avatarEmoji: user.avatarEmoji, isVerified: user.isVerified },
      token,
      verifyToken: verify
    });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: true, message: 'Validation failed', details: err.errors });
    res.status(500).json({ error: true, message: err.message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    if (req.body.email === 'demo@closetcraft.app') await seedDemoUser();
    const data = loginSchema.parse(req.body);
    const uid = store.usersByEmail.get(data.email.toLowerCase());
    const user = uid ? store.users.get(uid) : undefined;
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    }
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOpts());
    res.json({
      user: { id: user.id, email: user.email, name: user.name, avatarEmoji: user.avatarEmoji, isVerified: user.isVerified },
      token
    });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: true, message: 'Validation failed', details: err.errors });
    res.status(500).json({ error: true, message: err.message });
  }
});

authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

authRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const user = store.users.get(req.userId!);
  if (!user) return res.status(404).json({ error: true, message: 'User not found' });
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarEmoji: user.avatarEmoji,
    isVerified: user.isVerified,
    preferences: store.preferences.get(user.id)
  });
});

authRouter.post('/forgot-password', (req: Request, res: Response) => {
  const email = String(req.body.email || '').toLowerCase();
  const uid = store.usersByEmail.get(email);
  let resetToken: string | undefined;
  if (uid) {
    resetToken = randomBytes(24).toString('hex');
    store.resetTokens.push({ userId: uid, token: resetToken, expiresAt: Date.now() + 3600000 });
  }
  res.json({ message: `If ${email} is registered, a password reset link will be sent.`, resetToken });
});

authRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const rec = store.resetTokens.find((t) => t.token === token && t.expiresAt > Date.now());
  if (!rec) return res.status(400).json({ error: true, message: 'Invalid or expired token' });
  const user = store.users.get(rec.userId);
  if (!user) return res.status(404).json({ error: true, message: 'User not found' });
  user.passwordHash = await bcrypt.hash(password, 12);
  res.json({ message: 'Password reset successfully. Please log in.' });
});

authRouter.post('/verify-email', (req: Request, res: Response) => {
  const rec = store.verifyTokens.find((t) => t.token === req.body.token && t.expiresAt > Date.now());
  if (!rec) return res.status(400).json({ error: true, message: 'Invalid or expired token' });
  const user = store.users.get(rec.userId);
  if (user) user.isVerified = true;
  res.json({ message: 'Email verified successfully.' });
});
