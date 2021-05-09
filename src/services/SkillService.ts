import Skill, { ISkill } from '../models/Skill';

class SkillService {
  public static async create(skillData: ISkill) {
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
