const Joi = require('joi');

// Validation schema for user creation

const userSchema = Joi.object({
    First_Name: Joi.string().min(3).max(30).required(),
    Last_Name: Joi.string().min(3).max(30).required(),
    DOB: Joi.date().required(),
    Mobile_Number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    Address: Joi.string().max(255).required()
});

module.exports = userSchema;