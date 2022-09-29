const User = require('../models/User');
const bcrypt = require('bcryptjs');
const TokenUtils = require('../utils/tokensUtils');
const EmailUtils = require('../utils/emailUtils')
const ApiError = require('../utils/errorUtils');
const { hashPassword } = require('../utils/encryptUtils');

class authController {

    static async register(req, res, next) {
        try {
            const loginExist = await User.getUserData('login', req.body.login);
            if (loginExist) return next(ApiError.Conflict('Login Already Exists'));
            const emailExist = await User.getUserData('email', req.body.email);
            if (emailExist) return next(ApiError.Conflict('Email Already Exists'));

            const passwordHashed = await hashPassword(req.body.password);
            await User.createUser({ ...req.body, password: passwordHashed });

            const user = await User.getUserData('login', req.body.login);
            const token = TokenUtils.createTokenActivate(user);
            await EmailUtils.sendConfirmation(req.body.email, token);

            res.status(201).json({ message: 'User Created. Email Confirmation Sent', user: req.body.login });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const user = await User.getUserData('login', req.body.login);
            if (!user) return next(ApiError.BadRequest('Login Is Wrong'));
            if (user.email !== req.body.email) return next(ApiError.BadRequest('Email Is Wrong'));

            const passwordCheck = await bcrypt.compare(req.body.password, user.password);
            if (!passwordCheck) return next(ApiError.BadRequest('Password Is Wrong'));
            if (!user.activated) return next(ApiError.Forbidden('Confirm Email First'));

            const token = TokenUtils.createTokenAuth(user);
            res.status(200).json({ message: 'User Logged In', token: token });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            req.token = "";
            res.status(200).json({ message: 'User Logged Out', token: req.token })
        } catch (error) {
            next(error);
        }
    }

    static async sendLink(req, res, next) {
        try {
            const user = await User.getUserData('email', req.body.email);
            if (!user) return next(ApiError.UnprocessableEntity('Wrong Email'));
            if (!user.activated) return next(ApiError.UnprocessableEntity('Email Dont Activated'));

            const token = TokenUtils.createTokenReset(user);
            await EmailUtils.sendReset(req.body.email, token);

            res.status(200).json({ message: 'Reset Token Was Sent' });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const user = TokenUtils.verifyToken(req.params.token);
            const passwordHashed = await hashPassword(req.body.new_password);
            await User.resetPassword(user.id, passwordHashed);
            res.status(200).json({ message: 'Password reseted' });
        } catch (error) {
            next(error);
        }
    }

    static async accountConfirmation(req, res, next) {
        try {
            const user = TokenUtils.verifyToken(req.params.token);
            await User.accountActivation(user.id);
            res.status(200).json({ massage: 'Email Activated, You Can Login Now', });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = authController;
