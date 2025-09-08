import Joi from "joi";

export const userSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required(),
  last_name: Joi.string().min(3).max(30).required(),
  dob: Joi.date().iso().required(),
  mobile_number: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  address: Joi.string().max(255).required(),
});
