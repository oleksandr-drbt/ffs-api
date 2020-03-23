import { Request, Response } from 'express';
import { validator } from '../libs/validator';
import imageUploader from '../libs/imageUploader';
import UserService from '../services/UserService';
import PasswordService from '../services/PasswordService';
import AvatarService from '../services/AvatarService';
import { editUserSchema } from '../schemas/userSchemas';
import { changePasswordSchema } from '../schemas/passwordSchemas';
import { USER_NOT_FOUND, PASSWORD_NOT_CORRECT } from '../constants/errorMessages';

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
      res.status(404).json({ error: USER_NOT_FOUND });
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

      const filePath = await AvatarService.save(req.file, 'user/avatars');
      // @ts-ignore
      const { id } = req.user;
      await UserService.changeAvatar(id, filePath);
      res.json({ message: 'Avatar has been uploaded successfully.', avatar: filePath });
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
    res.json({ message: 'Password has been changed successfully.' });
  }

  /**
   * Delete account
   * @param req
   * @param res
   */
  public static async remove(req: Request, res: Response): Promise<void> {
    // @ts-ignore
    const { id } = req.user;
    await UserService.remove(id);

    res.json({ message: 'User has been deleted successfully!' });
  }
}

export default UserController;
