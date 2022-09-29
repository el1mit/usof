const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const ApiError = require('../utils/errorUtils');
const TokenUtils = require('../utils/tokensUtils');
const { hashPassword } = require('../utils/encryptUtils');

class userController {

    static async getAllUsers(req, res, next) {
        try {
            const users = await User.getAllUsers();
            res.status(200).json({ users: users })
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        try {
            const user = await User.getUserData('id', req.params.id);
            if (user) res.status(200).json({ user: user });
            else return next(ApiError.NotFound('User Not Found'));
        } catch (error) {
            next(error);
        }
    }

    static async createNewUser(req, res, next) {
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

    static async uploadUserAvatar(req, res, next) {
        try {
            const user = await User.getUserData('id', req.user.id);
            if (user.avatar !== 'avatar.png') {
                const filePath = path.resolve(__dirname, '../images/avatars/', user.avatar); 
                fs.unlinkSync(filePath);
            }

            User.uploadUserAvatar(req.user.id, req.file.filename);
            res.status(200).json({message: 'Avatar uploaded'});
        } catch (error) {
            next(error);
        }
    }

    static async updateUserData(req, res, next) {
        try {
            let user = await User.getUserData('id', req.params.id);
            if (user) {
                const passwordCheck = await bcrypt.compare(req.body.password, user.password);
                if (!passwordCheck) return next(ApiError.BadRequest('Password Is Wrong'));

                if (req.body.login) {
                    const loginExist = await User.getUserData('login', req.body.login);
                    if (loginExist) return next(ApiError.Conflict('Login Already Exists'));
                    user.login = req.body.login || user.login;
                }

                if (req.body.email) {
                    const emailExist = await User.getUserData('email', req.body.email);
                    if (emailExist) return next(ApiError.Conflict('Email Already Exists'));
                    user.email = req.body.email || user.email;
                }

                if (req.body.new_password) {
                    user.password = req.body.new_password;
                    user.password = await hashPassword(user.password);
                }

                user.full_name = req.body.full_name || user.full_name;
                user.rating = req.body.rating || user.rating;
                user.role = req.body.role || user.role;

                user = await User.updateUserData(req.params.id, user);
                res.status(200).json({ message: 'User data updated', user: user });
            } else {
                return next(ApiError.NotFound('User Not Found'));
            }

        } catch (error) {
            next(error);
        }
    }

    static async deleteUserById(req, res, next) {
        try {
            const user = await User.getUserData('id', req.params.id);
            if (user.avatar !== 'avatar.png') {
                const filePath = path.resolve(__dirname, '../images/avatars/', user.avatar);
                fs.unlinkSync(filePath);
            }
            
            const result = await User.deleteUserById(req.params.id);
            if (result[0].affectedRows) res.status(200).json({ message: 'User deleted' });
            else return next(ApiError.NotFound('User Not Found'));
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = userController;
