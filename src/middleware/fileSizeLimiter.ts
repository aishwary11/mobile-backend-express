import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../common/utils/asynchandler';

const fileSizeLimiter = (maxSize: number) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const filesArray = Object.values(files).flat();
    const invalidFiles: string[] = [];
    for await (const file of filesArray) {
      if (file && typeof file === 'object' && 'name' in file) {
        if (file.size > maxSize) {
          invalidFiles.push(file.name);
        }
      } else {
        return res.status(400).json({ message: 'Invalid file format or missing file name' });
      }
    }
    if (invalidFiles.length > 0) {
      return res.status(400).json({ message: `Files too large: ${invalidFiles.join(', ')}` });
    }
    next();
  });

export default fileSizeLimiter;
