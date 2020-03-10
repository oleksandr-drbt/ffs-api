import Joi from 'joi';
import { passwordRules } from './userSchemas';

export const changePasswordSchema = Joi.object().keys({
  old_password: passwordRules.required(),
  new_password: passwordRules.required(),
});
