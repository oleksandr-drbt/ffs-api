import Joi from 'joi';

const firstNameRules = Joi.string().max(100);
const lastNameRules = Joi.string().max(100);
const emailRules = Joi.string().email().max(255);
const phoneRules = Joi.string().max(20);
const positionRules = Joi.string().max(100);
const passwordRules = Joi.string().max(255);

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
});
