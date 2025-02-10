import type { Router } from 'express';
import { Router as router } from 'express';
import fileSizeExtension from '../../middleware/fileSizeExtension';
import { getGallery, uploadImage } from './gallery.controller';
const galleryRouter: Router = router();
galleryRouter.post('/upload', fileSizeExtension(['.jpg', '.jpeg', '.png'], 5 * 1024 * 1024), uploadImage);
galleryRouter.get('/', getGallery);
export default galleryRouter;
