import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  const errorMap: Record<string, number> = {
    EMAIL_EXISTS: 409,
    INVALID_CREDENTIALS: 401,
    INVALID_REFRESH_TOKEN: 401,
    USER_NOT_FOUND: 404,
  };

  const status = errorMap[err.message] ?? 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({ error: message });
}
