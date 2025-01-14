import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../common/utils/asynchandler';

const logger = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const latency = Date.now() - start;
    console.log(
      'Method:',
      req.method,
      'Url:',
      req.url,
      'params:',
      JSON.stringify(req.params),
      'body:',
      JSON.stringify(req.body),
      'Time:',
      new Intl.DateTimeFormat().format(new Date()),
      'Latency:',
      latency,
      'ms',
    );
  });
  next();
});

export default logger;
