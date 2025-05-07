import type { Router } from 'express';
import { Router as router } from 'express';
import constant from '../../common/constant';
import fileSizeExtension from '../../middleware/fileSizeExtension';
import { getGallery, uploadImage } from './gallery.controller';
const galleryRouter: Router = router();
galleryRouter.post('/upload', fileSizeExtension(['.jpg', '.jpeg', '.png'], constant.imgSize), uploadImage);
galleryRouter.get('/', getGallery);
export default galleryRouter;
