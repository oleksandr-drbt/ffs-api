import * as fs from 'fs';
import path from 'path';
import config from '../config';
import File, { IFile } from '../models/File';

class FileService {
  public static STORAGE_NAME = 'storage';
  public static PROJECTS_DIRECTORY = 'user/projects';

  public static save(file: Express.Multer.File, directory: string): IFile {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    const filePath = `${this.STORAGE_NAME}/${directory}/${fileName}`;

    fs.writeFileSync(filePath, file.buffer);

    return {
      name: fileName,
      original_name: file.originalname,
      path: filePath,
    };
  }

  public static generateFileUrl(fileName: string, directory: string) {
    const serverUrl = `${config.server.url}${process.env.NODE_ENV === 'development' ? `:${config.server.port}` : ''}`;

    return `${serverUrl}/${directory}/${fileName}`;
  }

  public static async remove(filePath: string) {
    fs.unlinkSync(path.join(__dirname, '..', '..', filePath));
  }

  public static async findAllByIds(ids: string[]) {
    return File.query().whereIn('id', ids);
  }
}

export default FileService;
