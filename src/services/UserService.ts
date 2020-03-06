import User from '../models/User';
import PasswordService from './PasswordService';
import { UserInterface } from '../interfaces/UserInterface';
import { v4 as uuid } from 'uuid';

class UserService {
  public static async create(userData: UserInterface) {
    const { password } = userData;
    const hashedPassword = await PasswordService.hashPassword(password);

    return User.query().insert({
      ...userData,
      id: uuid(),
      password: hashedPassword,
    });
  }

  public static async find(id: string = '') {
    return User.query().findById(id);
  }

  public static async findByEmail(email: string = '') {
    return User.query().findOne({ email: email });
  }

  public static async findAll() {
    return User.query();
  }

  public static async remove(id: string = '') {
    return User.query().deleteById(id);
  }

  public static async update(id: string, data: UserInterface) {
    return User.query().patchAndFetchById(id, data);
  }
}

export default UserService;
