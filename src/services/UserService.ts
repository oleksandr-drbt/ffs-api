import User from '../models/User';
import Skill from '../models/Skill';
import PasswordService from './PasswordService';
import SkillService from './SkillService';
import AvatarService from './AvatarService';
import { UserInterface } from '../interfaces/UserInterface';
import { v4 as uuid } from 'uuid';

class UserService {
  public static async create(userData: UserInterface) {
    const { password } = userData;
    const hashedPassword = await PasswordService.hashPassword(password);
    const userId = uuid();

    await User.query().insert({
      ...userData,
      id: userId,
      password: hashedPassword,
      avatar: AvatarService.generateAvatarUrl('default.png'),
    });

    return this.find(userId);
  }

  public static async find(id: string = '') {
    return User.query().findById(id).withGraphFetched('skills');
  }

  public static async findByEmail(email: string = '') {
    return User.query().findOne({ email: email }).withGraphFetched('skills');
  }

  public static async findAll() {
    return User.query().withGraphFetched('skills');
  }

  public static async remove(id: string = '') {
    return User.query().deleteById(id);
  }

  public static async update(id: string, data: UserInterface) {
    const { skills = [] } = data;
    const user = await User.query().findById(id);
    await user.$query().update(data);

    if (skills.length) {
      await this.addSkills(user, skills);
    }

    return user;
  }

  public static async changeAvatar(id: string, avatarLink: string) {
    const user = await User.query().findById(id);

    return user.$query().update({ avatar: avatarLink });
  }

  public static async changePassword(id: string, password: string) {
    const hashedPassword = await PasswordService.hashPassword(password);
    const user = await User.query().findById(id);

    return user.$query().update({ password: hashedPassword });
  }

  private static async addSkills(user: User, skills: string[]) {
    return skills.map(async (skillName) => {
      await user.$relatedQuery<Skill>('skills').unrelate();
      const skill = await SkillService.findByName(skillName);

      if (skill) {
        return user.$relatedQuery<Skill>('skills')
          .relate(skill);
      }

      return user.$relatedQuery<Skill>('skills').insert({
        name: skillName,
      });
    });
  }
}

export default UserService;
