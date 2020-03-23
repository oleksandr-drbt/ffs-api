import multer from 'multer';
import { imageFileFilter } from './filters';

const imageUploader = multer({
  fileFilter: imageFileFilter,
});

export default imageUploader;
