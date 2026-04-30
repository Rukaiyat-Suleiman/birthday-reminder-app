import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    dob: Joi.date().iso().required()
});
