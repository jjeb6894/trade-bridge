import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { updateUserSchema } from '../validators/auth.validator.js';
import { getUserById, updateUser } from '../services/auth.service.js';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const user = await getUserById(req.user!.userId);
  res.json(user);
}));

router.patch('/me', authMiddleware, asyncHandler(async (req, res) => {
  const input = updateUserSchema.parse(req.body);
  const user = await updateUser(req.user!.userId, input);
  res.json(user);
}));

export default router;
