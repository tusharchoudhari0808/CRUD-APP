import * as Joi from "joi";

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

export const adminSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const AdminLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
