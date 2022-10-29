const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const ApiError = require('../utils/errorUtils');
const TokenUtils = require('../utils/tokensUtils');
const EmailUtils = require('../utils/emailUtils');
const { hashPassword } = require('../utils/encryptUtils');

class userController {

    static async getAllUsers(req, res, next) {
        try {
            const usersData = await User.getAllUsers();
            let users = [];

            usersData.map((user) => {
                const { password, ...userData } = user
                users.push(userData);
            });

            users.sort((a, b) => (a.id < b.id) ? 1
                : ((b.id < a.id) ? -1 : 0));

            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async getAllUserPosts(req, res, next) {
        try {
            let posts = await Post.getAllUserPosts(req.params.id);

            for (let i = 0; i < posts.length; i++) {
                let likes = await Like.getPostLikes(posts[i].id);
                let categories = await Post.getPostCategories(posts[i].id);
                let comments = await Comment.getPostComments(posts[i].id);

                if (likes) {
                    likes.count = likes.likes_count - likes.dislikes_count
                } else {
                    likes = {
                        post_id: posts[i].id,
                        likes_count: 0,
                        dislikes_count: 0,
                        count: 0
                    }
                }

                if (categories) {
                    categories = {
                        categories_id: categories.categories_id.split(','),
                        categories_titles: categories.categories_titles.split(','),
                    }
                } else {
                    categories = {
                        post_id: posts[i].id,
                        categories_id: [],
                        categories_titles: [],

                    }
                }


                posts[i].likes = likes;
                posts[i].categories = categories;
                posts[i].comments = {
                    post_id: posts[i].id,
                    count: comments.length,
                }
            }


            posts?.sort((a, b) => (a.publish_date < b.publish_date) ? 1
                : ((b.publish_date < a.publish_date) ? -1 : 0));

            res.status(200).json(posts)
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req, res, next) {
        try {
            const userData = await User.getUserData('id', req.params.id);
            if (userData) {
                const { password, ...user } = userData
                res.status(200).json(user);
            }
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

            const userData = await User.getUserData('login', req.body.login);
            const { password, ...user } = userData
            const token = TokenUtils.createTokenActivate(user);
            await EmailUtils.sendConfirmation(req.body.email, token);

            res.status(201).json({ message: 'User Created. Email Confirmation Sent', user });
        } catch (error) {
            next(error);
        }
    }

    static async uploadUserAvatar(req, res, next) {
        try {
            const user = await User.getUserData('id', req.user.id);
            
            if (user.avatar !== 'avatar.png') {
                const filePath = path.resolve(__dirname, '../uploads/avatars', user.avatar);
                fs.unlinkSync(filePath);
            }

            User.uploadUserAvatar(req.user.id, req.file.filename);
            res.status(200).json({ message: 'Avatar uploaded', avatar: `${req.file.filename}` });
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

                if ((req.body.login?.length > 3) && (req.body.login?.length < 21)) {
                    const loginExist = await User.getUserData('login', req.body.login);
                    if (loginExist) return next(ApiError.Conflict('Login Already Exists'));
                    user.login = req.body.login || user.login;
                }

                if (req.body.email?.length > 3) {
                    const emailExist = await User.getUserData('email', req.body.email);
                    if (emailExist) return next(ApiError.Conflict('Email Already Exists'));
                    user.email = req.body.email || user.email;
                }

                if ((req.body.new_password?.length > 5) && (req.body.new_password?.length < 23)) {
                    user.password = req.body.new_password;
                    user.password = await hashPassword(user.password);
                }

                if (req.body.full_name?.length > 3) {
                    user.full_name = req.body.full_name;
                }

                if (req.body?.role === 'ADMIN' || req.body.role === 'USER') {
                    user.role = req.body.role
                }

                let userData = await User.updateUserData(req.params.id, user);
                if (userData) {
                    const { password, ...user } = userData
                    res.status(200).json(user);
                }
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

    static async deleteUserAvatar(req, res, next) {
        try {
            const user = await User.getUserData('id', req.user.id);
            if (user.avatar !== 'avatar.png') {
                const filePath = path.resolve(__dirname, '../uploads/avatars', user.avatar);
                fs.unlinkSync(filePath);
            }

            User.uploadUserAvatar(req.user.id, 'avatar.png');
            res.status(200).json({ message: 'Avatar uploaded', avatar: 'avatar.png' });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = userController;
