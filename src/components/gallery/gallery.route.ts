import type { Router } from 'express';
import { Router as router } from 'express';
import fileExtension from '../../middleware/fileExtension';
import { getGallery, uploadImage } from './gallery.controller';
const galleryRouter: Router = router();
galleryRouter.post('/upload', fileExtension(['.jpg', '.jpeg', '.png']), uploadImage);
galleryRouter.get('/', getGallery);
export default galleryRouter;
