import sharp from 'sharp';
import path from 'path';
import config from '../config';

class AvatarService {
  public static async save(image: Express.Multer.File, directory: string) {
    const imageName = `${Date.now()}${path.extname(image.originalname)}`;
    const imagePath = `storage/${directory}/${imageName}`;

    await sharp(image.buffer)
      .resize(600, 600, {
        fit: 'cover',
      })
      .toFile(imagePath);

    return this.generateAvatarUrl(imageName);
  }

  public static generateAvatarUrl(imageName: string) {
    const serverUrl = `${config.server.url}${process.env.NODE_ENV === 'development' ? `:${config.server.port}` : ''}`;

    return `${serverUrl}/user/avatars/${imageName}`;
  }
}

export default AvatarService;
