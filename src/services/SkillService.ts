import Skill from '../models/Skill';
import { SkillInterface } from '../interfaces/SkillInterface';

class SkillService {
  public static async create(skillData: SkillInterface) {
    return Skill.query().insert(skillData);
  }

  public static async find(id: number) {
    return Skill.query().findById(id);
  }

  public static async findByName(name: string = '') {
    return Skill.query().findOne({ name: name });
  }

  public static async findAll() {
    return Skill.query().orderBy('created_at');
  }
}

export default SkillService;
