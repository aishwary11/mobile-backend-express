import { NextFunction, Request, Response } from 'express';
import { Schema, z } from 'zod';
import { STATUS_CODES } from '../constant';
import asyncHandler from './asynchandler';
import responseHandler from './responsehelpers';

export const validateFormZod = (formValidate: Schema) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await formValidate.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        return responseHandler(res, STATUS_CODES.BAD_REQUEST, errorMessage);
      }
      next(error);
    }
  });
