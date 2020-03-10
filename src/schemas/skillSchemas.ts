import Joi from 'joi';

export const skillNameRules = Joi.string().max(50);

export const createSkillSchema = Joi.object().keys({
  name: skillNameRules.required(),
});
