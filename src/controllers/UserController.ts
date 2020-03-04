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
	public static async list(req: Request, res: Response) {
		const users = await UserService.findAll();

		res.send(users);
	}

	/**
	 * Get user by id
	 * @param req
	 * @param res
	 */
	public static async get(req: Request, res: Response) {
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
	public static async update(req: Request, res: Response) {
		const authorizedUser = req.user;
		// @ts-ignore
		const { id } = authorizedUser;
		let user = await UserService.find(id);

		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		const userData = req.body;
		const errors = validator.validate(userData, editUserSchema);

		if (errors) {
			res.status(400).send(errors);
			return;
		}

		user = await UserService.update(id, userData);
		res.send(user);
	}

	/**
	 * Delete account
	 * @param req
	 * @param res
	 */
	public static async remove(req: Request, res: Response) {
		const authorizedUser = req.user;
		// @ts-ignore
		const { id } = authorizedUser;
		await UserService.remove(id);

		res.send({ message: 'User has been deleted successfully!' });
	}
}

export default UserController;
