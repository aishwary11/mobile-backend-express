import type { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

interface ResponseData {
  msg: string | null;
  data?: any;
  status: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface ErrorHandler extends Error {
  statusCode?: number;
}
