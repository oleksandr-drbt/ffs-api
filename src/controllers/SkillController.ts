import { Request, Response } from 'express';
import { validator } from '../libs/validator';
import SkillService from '../services/SkillService';
import { createSkillSchema } from '../schemas/skillSchemas';
import { SKILL_EXISTS } from '../constants/errorMessages';

class SkillController {
  /**
   * Create skill
   * @param req
   * @param res
   */
  public static async create(req: Request, res: Response): Promise<void> {
    const skillData = req.body;
    const errors = validator.validate(skillData, createSkillSchema);

    if (errors) {
      res.status(400).send(errors);
      return;
    }

    let skill = await SkillService.findByName(skillData.name);

    if (skill) {
      res.status(400).send({ message: SKILL_EXISTS });
      return;
    }

    skill = await SkillService.create(skillData);
    res.send(skill);
  }

  /**
   * Get all skills
   * @param req
   * @param res
   */
  public static async list(req: Request, res: Response): Promise<void> {
    const skills = await SkillService.findAll();

    res.send(skills);
  }
}

export default SkillController;
