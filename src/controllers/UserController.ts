import { Request, Response } from 'express';
import { validator } from '../libs/validator';
import UserService from '../services/UserService';
import { editUserSchema } from '../schemas/userSchemas';
import { USER_NOT_FOUND } from '../constants/errorMessages';

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
      res.status(400).send(errors);
      return;
    }

    // @ts-ignore
    user = await UserService.update(user.id, userData);
    res.send(user);
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

    res.send({ message: 'User has been deleted successfully!' });
  }
}

export default UserController;
