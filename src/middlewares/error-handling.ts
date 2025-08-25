import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

const ErrorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // zod error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation error',
      errors: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
  });
};

export default ErrorHandler;
