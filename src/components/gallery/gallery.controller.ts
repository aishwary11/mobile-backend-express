import type { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { STATUS_CODES } from '../../common/constant';
import asyncHandler from '../../common/utils/asynchandler';
import responseHelper from '../../common/utils/responsehelpers';
import GalleryModel from './gallery.model';

export const getGallery = asyncHandler(async (req: Request, res: Response) => {
  const galleryRecords = await GalleryModel.find({ userEmail: req.body.email }, { 'images.filePath': 1 }).lean();
  return responseHelper(res, STATUS_CODES.OK, 'Gallery records fetched successfully', galleryRecords);
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const files = req.files;
    if (!files) {
      return responseHelper(res, STATUS_CODES.BAD_REQUEST, 'No file uploaded');
    }
    const filesArray = Object.values(files).flat();
    const uploadFolderPath = path.resolve(__dirname, '../../../uploads/');
    await fs.mkdir(uploadFolderPath, { recursive: true });
    const savedImages = await Promise.all(
      filesArray.map(async file => {
        const fileData = file.data;
        if (!fileData) {
          throw new Error(`File data is missing for file: ${file.name}`);
        }
        const uniqueFileName = `${Date.now()}-${file.name || 'file'}`;
        const filePath = path.join(uploadFolderPath, uniqueFileName);
        await fs.writeFile(filePath, fileData);
        return {
          name: uniqueFileName,
          filePath,
        };
      }),
    );
    const galleryRecord = await GalleryModel.create({
      userEmail: email,
      images: savedImages,
    });
    return responseHelper(res, STATUS_CODES.OK, 'Files uploaded successfully', {
      galleryRecord,
    });
  } catch (error) {}
});
