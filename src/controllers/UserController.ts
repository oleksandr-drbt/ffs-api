import { Request, Response } from 'express';
import { validator } from '../libs/validator';
import imageUploader from '../libs/imageUploader';
import UserService from '../services/UserService';
import PasswordService from '../services/PasswordService';
import ImageService from '../services/ImageService';
import { editUserSchema } from '../schemas/userSchemas';
import { changePasswordSchema } from '../schemas/passwordSchemas';
import { USER_NOT_FOUND, PASSWORD_NOT_CORRECT } from '../constants/errorMessages';
import { AVATAR_UPLOADED_SUCCESS, PASSWORD_CHANGED, USER_DELETED } from '../constants/successMessages';

class UserController {
  /**
   * List of users
   * @param req
   * @param res
   */
  public static async list(req: Request, res: Response): Promise<void> {
    const users = await UserService.findAll();

    res.send(users);
  }

  /**
   * Get user by id
   * @param req
   * @param res
   */
  public static async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await UserService.find(id);

    if (!user) {
      res.status(404).json({ message: USER_NOT_FOUND });
      return;
    }

    res.send(user);
  }

  /**
   * Edit account
   * @param req
   * @param res
   */
  public static async update(req: Request, res: Response): Promise<void> {
    let user = req.user;
    const userData = req.body;
    const errors = validator.validate(userData, editUserSchema);

    if (errors) {
      res.status(400).json(errors);
      return;
    }

    // @ts-ignore
    user = await UserService.update(user.id, userData);
    res.json(user);
  }

  /**
   * Upload user's avatar
   * @param req
   * @param res
   */
  public static async uploadAvatar(req: Request, res: Response) {
    const upload = imageUploader.single('avatar');

    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      // @ts-ignore
      const { id, avatar: oldAvatar } = req.user;

      if (oldAvatar) {
        await ImageService.remove(oldAvatar.path);
      }

      const avatar = await ImageService.save(req.file, ImageService.AVATARS_DIRECTORY);
      await UserService.changeAvatar(id, avatar);

      res.json({
        message: AVATAR_UPLOADED_SUCCESS,
        avatarUrl: ImageService.generateImageUrl(avatar.name, ImageService.AVATARS_DIRECTORY),
      });
    });
  }

  /**
   * Change user's password
   * @param req
   * @param res
   */
  public static async changePassword(req: Request, res: Response): Promise<void> {
    const { old_password, new_password } = req.body;
    const errors = validator.validate(req.body, changePasswordSchema);

    if (errors) {
      res.status(400).json(errors);
      return;
    }

    // @ts-ignore
    const { id, password } = req.user;
    const isValidPassword = await PasswordService.comparePasswords(old_password, password);

    if (!isValidPassword) {
      res.status(400).json({ message: PASSWORD_NOT_CORRECT });
      return;
    }

    await UserService.changePassword(id, new_password);
    res.json({ message: PASSWORD_CHANGED });
  }

  /**
   * Delete account
   * @param req
   * @param res
   */
  public static async remove(req: Request, res: Response): Promise<void> {
    // @ts-ignore
    const { id, avatar } = req.user;
    await UserService.remove(id);

    if (avatar) {
      await ImageService.remove(avatar.path);
    }

    res.json({ message: USER_DELETED });
  }
}

export default UserController;
