import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import { STATUS_CODES } from '../common/constant';
import asyncHandler from '../common/utils/asynchandler';
import responseHelper from '../common/utils/responsehelpers';

const fileSizeExtension = (allowedExtensions: string[], maxSize: number) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;
    const extSet = new Set(allowedExtensions.map(ext => ext.toLowerCase()));
    if (!files || Object.keys(files).length === 0) {
      return responseHelper(res, STATUS_CODES.BAD_REQUEST, 'No files uploaded');
    }
    const filesArray = Object.values(files).flat();
    const invalidExtensions: string[] = [];
    const oversizedFiles: string[] = [];
    for await (const file of filesArray) {
      if (file && typeof file === 'object' && 'name' in file) {
        const ext = path.extname(file.name).toLowerCase();
        if (!extSet.has(ext)) {
          invalidExtensions.push(ext);
        }
        if (typeof file.size !== 'number') {
          return responseHelper(res, STATUS_CODES.BAD_REQUEST, `Missing file size information for file: ${file.name}`);
        }
        if (file.size > maxSize) {
          oversizedFiles.push(file.name);
        }
      } else {
        return responseHelper(res, STATUS_CODES.BAD_REQUEST, 'Invalid file format or missing file name');
      }
    }

    if (invalidExtensions.length > 0) {
      return responseHelper(res, STATUS_CODES.BAD_REQUEST, `Invalid file extensions: ${[...new Set(invalidExtensions)].join(', ')}`);
    }

    if (oversizedFiles.length > 0) {
      return responseHelper(res, STATUS_CODES.BAD_REQUEST, `Files exceeding maximum size limit: ${oversizedFiles.join(', ')}`);
    }

    next();
  });

export default fileSizeExtension;
