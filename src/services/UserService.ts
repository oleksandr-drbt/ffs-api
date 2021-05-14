import { v4 as uuid } from 'uuid';
import User from '../models/User';
import Image, { IImage } from '../models/Image';
import Skill from '../models/Skill';
import PasswordService from './PasswordService';
import SkillService from './SkillService';

export interface ICreateUser {
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  password: string;
  password_confirmation: string;
}

export interface IEditUser {
  first_name?: string;
  last_name?: string;
  phone?: string;
  position?: string;
  skills?: string[];
}

class UserService {
  public static async create(userData: ICreateUser) {
    const {
      email,
      password,
      role,
      first_name: firstName,
      last_name: lastName,
    } = userData;

    const hashedPassword = await PasswordService.hashPassword(password);
    const userId = uuid();

    await User.query().insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      role: role,
    });

    return this.find(userId);
  }

  public static async find(id: string = '') {
    return User.query().findById(id).withGraphFetched(User.relationsExpr);
  }

  public static async findByEmail(email: string = '') {
    return User.query().findOne({ email: email }).withGraphFetched(User.relationsExpr);
  }

  public static async findAll() {
    return User.query().withGraphFetched(User.relationsExpr);
  }

  public static async remove(id: string = '') {
    const user = await this.find(id);

    if (user.avatar) {
      await user.$relatedQuery<Image>('avatar').delete();
    }
    await user.$relatedQuery<Skill>('skills').unrelate();

    return user.$query().delete();
  }

  public static async update(id: string, userData: IEditUser) {
    const { skills = [] } = userData;
    const user = await User.query().patchAndFetchById(id, userData);
    await SkillService.addSkillsToEntity(user, skills);

    return this.find(id);
  }

  public static async changeAvatar(id: string, avatar: IImage) {
    const user = await User.query().findById(id);
    await user.$relatedQuery<Image>('avatar').delete();
    const imageId = uuid();

    return user.$relatedQuery<Image>('avatar').insert({
      id: imageId,
      ...avatar,
    });
  }

  public static async changePassword(id: string, password: string) {
    const hashedPassword = await PasswordService.hashPassword(password);
    const user = await User.query().findById(id);

    return user.$query().update({ password: hashedPassword });
  }
}

export default UserService;
