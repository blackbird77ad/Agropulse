import Joi from 'joi';

export const userSignUpValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s]+$/).trim(),
    dateOfBirth: Joi.date().iso(), 
    profilePicture: Joi.string(),
    role: Joi.string()
        .valid("site-visitor", 'farmer','district-officer', "admin")
})


export const userSignInValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})

export const userUpdateValidator = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s]+$/).trim(),
    dateOfBirth: Joi.date().iso(), 
    profilePicture: Joi.string(),
    role: Joi.string()
        .valid("site-visitor", 'farmer','district-officer', "admin")
})