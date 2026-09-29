import { Router, Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator.js';
import { register, login, refresh } from '../services/auth.service.js';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

router.post('/register', asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const result = await register(input.email, input.password, input.name);
  res.status(201).json(result);
}));

router.post('/login', asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const result = await login(input.email, input.password);
  res.json(result);
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  const input = refreshSchema.parse(req.body);
  const result = await refresh(input.refreshToken);
  res.json(result);
}));

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
