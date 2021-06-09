import Joi from 'joi';
import { skillNameRules } from './skillSchemas';

export const firstNameRules = Joi.string().max(100);
export const lastNameRules = Joi.string().max(100);
export const emailRules = Joi.string().email().max(255);
export const roleRules = Joi.string().valid('student', 'teacher');
export const phoneRules = Joi.string().max(20);
export const positionRules = Joi.string().max(100);
export const descriptionRules = Joi.string().max(2000);
export const passwordRules = Joi.string().min(6).max(255);

export const registerUserSchema = Joi.object().keys({
  first_name: firstNameRules.required(),
  last_name: lastNameRules.required(),
  email: emailRules.required(),
  role: roleRules.required(),
  password: passwordRules.required(),
  password_confirmation: Joi.ref('password'),
});

export const editUserSchema = Joi.object().keys({
  first_name: firstNameRules.optional(),
  last_name: lastNameRules.optional(),
  phone: phoneRules.allow(null, '').optional(),
  position: positionRules.allow(null, '').optional(),
  description: descriptionRules.allow(null, '').optional(),
  skills: Joi.array().items(skillNameRules),
});
