import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../common/utils/asynchandler';

const logger = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const latency = Date.now() - start;
    console.log(
      `Time: ${new Date().toLocaleString()}, Method: ${req.method}, originalUrl: ${req.originalUrl}, params: ${JSON.stringify(req.params)}, body: ${JSON.stringify(req.body)}, Latency: ${latency} ms`,
    );
  });
  next();
});

export default logger;
