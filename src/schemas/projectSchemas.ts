import Joi from 'joi';
import { skillNameRules } from './skillSchemas';

export const titleRules = Joi.string().min(2).max(200);
export const descriptionRules = Joi.string().max(2000);
export const typeRules = Joi.string().valid('ongoing', 'onetime', 'none');
export const studentsCountRules = Joi.string().valid('one', 'many');
export const durationRules = Joi.string().valid('lessone', 'onethree', 'threesix', 'oversix');

export const createProjectSchema = Joi.object().keys({
  title: titleRules.required(),
  description: descriptionRules.required(),
  type: typeRules.required(),
  students_count: studentsCountRules.required(),
  duration: durationRules.required(),
  skills: Joi.array().items(skillNameRules),
  files: Joi.array(),
});

export const editProjectSchema = Joi.object().keys({
  title: titleRules.required(),
  description: descriptionRules.required(),
  type: typeRules.required(),
  students_count: studentsCountRules.required(),
  duration: durationRules.required(),
  skills: Joi.array().items(skillNameRules),
  removedFiles: Joi.array().optional(),
  files: Joi.array(),
});
