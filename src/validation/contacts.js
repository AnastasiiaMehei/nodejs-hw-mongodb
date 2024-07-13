import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.number().integer().min(6).max(16).required(),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(4)
    .max(8)
    .valid('work', 'home', 'personal')
    .required(),
});
const userData = {
  name: 'John Doe',
  phoneNumber: 1234567890,
  email: 'john.doe@example.com',
  isFavourite: true,
  contactType: 'personal',
};
const validationResult = createContactSchema.validate(userData, {
  abortEarly: false,
});
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number().integer().min(6).max(16),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(4).max(8).valid('work', 'home', 'personal'),
});
