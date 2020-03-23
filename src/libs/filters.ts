import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { IMAGE_NOT_VALID_TYPE } from '../constants/errorMessages';

enum IMAGE_MIME_TYPES {
  PNG = 'image/png',
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  SVG = 'image/svg',
}

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  const mimetype = file.mimetype as IMAGE_MIME_TYPES;

  if (Object.values(IMAGE_MIME_TYPES).includes(mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error(IMAGE_NOT_VALID_TYPE));
  }
};
