const Joi = require('joi');
const ApiError = require('../utils/errorUtils');

class Validation {

    static registerValidation(req, res, next) {
        const schema = Joi.object({
            login: Joi.string().min(4).max(20).required(),
            password: Joi.string().min(6).max(22).required(),
            password_confirmation: Joi.any().valid(Joi.ref('password')).required(),
            full_name: Joi.string().min(4).required(),
            email: Joi.string().min(4).required().email(),
            role: Joi.string()
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static loginValidation(req, res, next) {
        const schema = Joi.object({
            login: Joi.string().min(4).max(20).required(),
            email: Joi.string().min(4).required().email(),
            password: Joi.string().min(6).max(22).required()
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static updateValidation(req, res, next) {
        const schema = Joi.object({
            login: Joi.string().min(4).max(20),
            new_password: Joi.string().min(6).max(22),
            password: Joi.string().min(6).max(22).required(),
            password_confirmation: Joi.any().valid(Joi.ref('password')).required(),
            full_name: Joi.string().min(4),
            email: Joi.string().min(4).email(),
            avatar: Joi.string(),
            rating: Joi.string(),
            role: Joi.string()
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static passResetValidation(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().min(4).required().email(),
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static newPassValidation(req, res, next) {
        const schema = Joi.object({
            new_password: Joi.string().min(6).max(22).required(),
            new_password_confirm: Joi.any().valid(Joi.ref('new_password')).required(),
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static commentValidation(req, res, next) {
        const schema = Joi.object({
            content: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static commentUpdateValidation(req, res, next) {
        const schema = Joi.object({
            content: Joi.string(),
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static postValidation(req, res, next) {
        const schema = Joi.object({
            title: Joi.string().min(5).required(),
            content: Joi.string().min(10).required(),
            categories: Joi.array().items(Joi.number()).min(1).required()
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static postUpdateValidation(req, res, next) {
        const schema = Joi.object({
            title: Joi.string().min(5),
            content: Joi.string().min(10),
            categories: Joi.array().items(Joi.number()).min(1)
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static categoryValidation(req, res, next) {
        const schema = Joi.object({
            title: Joi.string().min(1).required(),
            description: Joi.string().min(10).required()
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

    static categoryUpdateValidation(req, res, next) {
        const schema = Joi.object({
            title: Joi.string().min(1),
            description: Joi.string().min(10)
        });
        const { error } = schema.validate(req.body);
        if (error) next(ApiError.BadRequest(error.details[0].message));
        next();
    }

}

module.exports = Validation;
