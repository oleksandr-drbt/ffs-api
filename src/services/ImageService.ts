import * as fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import config from '../config';
import { IImage } from '../models/Image';

class ImageService {
  public static STORAGE_NAME = 'storage';
  public static AVATARS_DIRECTORY = 'user/avatars';
  public static WORKS_DIRECTORY = 'user/works';

  public static async save(
    image: Express.Multer.File,
    directory: string,
    width: number | null = null,
    height: number | null = null,
  ): Promise<IImage> {
    const imageName = `${Date.now()}${path.extname(image.originalname)}`;
    const imagePath = `${this.STORAGE_NAME}/${directory}/${imageName}`;

    await sharp(image.buffer)
      .resize(width, height, {
        fit: 'cover',
      })
      .toFile(imagePath);

    return {
      name: imageName,
      path: imagePath,
    };
  }

  public static generateImageUrl(imageName: string, directory: string) {
    const serverUrl = `${config.server.url}${process.env.NODE_ENV === 'development' ? `:${config.server.port}` : ''}`;

    return `${serverUrl}/${directory}/${imageName}`;
  }

  public static async remove(imagePath: string) {
    fs.unlinkSync(path.join(__dirname, '..', '..', imagePath));
  }
}

export default ImageService;
