import Skill, { ISkill } from '../models/Skill';
import User from '../models/User';
import Project from '../models/Project';

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

  public static async findAllByNames(names: string[] = []) {
    return Skill.query().whereIn('name', names);
  }

  public static async findAll() {
    return Skill.query().orderBy('created_at');
  }

  public static async addSkillsToEntity(entity: User | Project, skills: string[]) {
    await entity.$relatedQuery<Skill>('skills').unrelate();

    const foundSkills = await SkillService.findAllByNames(skills);
    await entity.$relatedQuery<Skill>('skills').relate(foundSkills);
    const foundSkillsNames = foundSkills.map(({ name }) => name);

    const newSkills = skills
      .filter(skillName => !foundSkillsNames.includes(skillName));
    await entity.$relatedQuery<Skill>('skills')
      .insert(newSkills.map(skillName => ({
        name: skillName,
      })));
  }
}

export default SkillService;
