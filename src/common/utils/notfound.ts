import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../constant';
import asyncHandler from './asynchandler';
import responseHandler from './responsehelpers';

export const notFound = asyncHandler(async (req: Request, res: Response, next: NextFunction) => responseHandler(res, STATUS_CODES.NOT_FOUND, 'Not Found'));

export default notFound;
