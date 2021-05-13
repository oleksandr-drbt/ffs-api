import Joi from 'joi';

export const titleRules = Joi.string().max(100);
export const descriptionRules = Joi.string().max(255).allow(null, '');
export const linkRules = Joi.string().max(255).allow(null, '');
export const isPublishedRules = Joi.bool();
export const imageRules = Joi.string().allow([null, '']);

export const createWorkSchema = Joi.object().keys({
  title: titleRules.required(),
  description: descriptionRules.optional(),
  link: linkRules.optional(),
  is_published: isPublishedRules.required(),
  image: imageRules.optional(),
});

export const editWorkSchema = Joi.object().keys({
  title: titleRules.optional(),
  description: descriptionRules.optional(),
  link: linkRules.optional(),
  is_published: isPublishedRules.required(),
  image: imageRules.optional(),
  is_image_removed: Joi.bool().optional(),
});
