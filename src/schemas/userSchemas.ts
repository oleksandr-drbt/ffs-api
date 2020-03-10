import Joi from 'joi';
import { skillNameRules } from './skillSchemas';

export const firstNameRules = Joi.string().max(100);
export const lastNameRules = Joi.string().max(100);
export const emailRules = Joi.string().email().max(255);
export const phoneRules = Joi.string().max(20);
export const positionRules = Joi.string().max(100);
export const passwordRules = Joi.string().min(6).max(255);

export const createUserSchema = Joi.object().keys({
  first_name: firstNameRules.required(),
  last_name: lastNameRules.required(),
  email: emailRules.required(),
  password: passwordRules.required(),
});

export const editUserSchema = Joi.object().keys({
  first_name: firstNameRules.optional(),
  last_name: lastNameRules.optional(),
  phone: phoneRules.optional(),
  position: positionRules.optional(),
  skills: Joi.array().items(skillNameRules),
});
