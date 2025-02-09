import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import { STATUS_CODES } from '../common/constant';
import asyncHandler from '../common/utils/asynchandler';
import responseHelper from '../common/utils/responsehelpers';

const fileExtension = (allowedExtensions: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;
    const extSet = new Set(allowedExtensions.map(ext => ext.toLowerCase()));
    if (!files || Object.keys(files).length === 0) {
      return responseHelper(res, STATUS_CODES.BAD_REQUEST, 'No files uploaded');
    }
    const filesArray = Object.values(files).flat();
    const invalidFiles: string[] = [];
    for await (const file of filesArray) {
      if (file && typeof file === 'object' && 'name' in file) {
        const ext = path.extname(file.name).toLowerCase();
        if (!extSet.has(ext)) {
          invalidFiles.push(ext);
        }
      } else {
        return responseHelper(res, STATUS_CODES.BAD_REQUEST, 'Invalid file format or missing file name');
      }
    }
    if (invalidFiles.length > 0) {
      return responseHelper(res, STATUS_CODES.BAD_REQUEST, `Invalid file extensions: ${[...new Set(invalidFiles)].join(', ')}`);
    }
    next();
  });

export default fileExtension;
