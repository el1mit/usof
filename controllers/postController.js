const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const Like = require('../models/Like');
const User = require('../models/User');
const ApiError = require('../utils/errorUtils');

class postController {

    static async getAllPosts(req, res, next) {
        try {
            const posts = await Post.getAllPosts();
            const likes = await Like.getAllPostsLikes();
            const categories = await Category.getAllPostsCategories();
            const comments = await Comment.getAllPostsComments();

            posts?.map((post) => {
                likes.forEach((like) => {
                    if (like.post_id == post.id) {
                        like.count = like.likes_count - like.dislikes_count;
                        post.likes = like;
                    }
                });
                categories.forEach((category) => {
                    if (category.post_id === post.id) {
                        post.categories = {
                            categories_id: category.categories_id.split(','),
                            categories_titles: category.categories_titles.split(','),
                        }
                    }
                });
                comments.forEach((comment) => {
                    if (comment.post_id === post.id) {
                        post.comments = comment;
                    }
                })
            });

            posts?.map((post) => {
                if (!post.likes) {
                    post.likes = {
                        post_id: post.id,
                        likes_count: 0,
                        dislikes_count: 0,
                        count: 0
                    }
                }
                if (!post.categories) {
                    post.categories = {
                        post_id: post.id,
                        categories_id: '',
                        categories_titles: ''
                    }
                }
                if (!post.comments) {
                    post.comments = {
                        post_id: post.id,
                        count: 0
                    }
                }
            });

            posts?.sort((a, b) => (a.publish_date < b.publish_date) ? 1
                : ((b.publish_date < a.publish_date) ? -1 : 0));

            res.status(200).json(posts)
        } catch (error) {
            next(error)
        }
    }

    static async getPostById(req, res, next) {
        try {
            let post = await Post.getPostById(req.params.id);

            if (post.content_image) {
                post.content_image = post.content_image?.split(',');
            } else {
                post.content_image = []
            }

            if (post) res.status(200).json(post);
            else return next(ApiError.NotFound('Post Not Found'));
        } catch (error) {
            next(error)
        }
    }

    static async getPostComments(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Check Comments For Post That Doesnt Exist'));

            let comments = await Comment.getPostComments(req.params.id);

            res.status(200).json(comments);
        } catch (error) {
            next(error)
        }
    }

    static async createComment(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Comment Post That Doesnt Exist'));

            let data = {
                authorId: req.user.id,
                publishDate: Date.now(),
                content: req.body.content,
                postId: req.params.id
            };

            let comment = await Comment.createComment(data);
            comment = await Comment.getCommentById(comment[0].insertId)
            res.status(201).json(comment)
        } catch (error) {
            next(error)
        }
    }

    static async getPostCategories(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Check Categories For Post That Doesnt Exist'));

            let categories = await Post.getPostCategories(req.params.id);
            if (categories) {
                categories.categories_id = categories.categories_id.split(',');
                categories.categories_titles = categories.categories_titles.split(',');
            } else {
                categories = {
                    post_id: post.id,
                    categories_id: '',
                    categories_titles: ''
                }
            }

            res.status(200).json(categories);
        } catch (error) {
            next(error)
        }
    }

    static async getPostLikes(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Check Likes For Post That Doesn Exist'));

            let likes = await Like.getPostLikes(req.params.id);
            if (likes) {
                likes.count = likes.likes_count - likes.dislikes_count;
            } else {
                likes = {
                    post_id: post.id,
                    likes_count: 0,
                    dislikes_count: 0,
                    count: 0
                }
            }
            res.status(200).json(likes);
        } catch (error) {
            next(error);
        }
    }

    static async uploadPostImages(req, res, next) {
        try {
            req.body.postId = req.params.id;
            let post = await Post.getPostById(req.body.postId);
            req.body.content_image = [];

            if (post && req.files) {
                if (!req.user.admin && (post.author_id !== req.user.id)) return next(ApiError.Forbidden('You Dont Have Permissions'));
    
                if (!post.content_image) {
                    req.files?.map((file) => {
                        req.body.content_image.push(file.filename);
                    });
                } else if (!req.body.imageNames && req.files.length === 0) {
                    post.content_image = post.content_image?.split(',');

                    post.content_image.forEach((image) => {
                        const filePath = path.resolve(__dirname, '../uploads/posts', image);
                        fs.unlinkSync(filePath);
                    });

                    req.body.content_image = '';
                    await Post.updatePostImages(req.body);

                } else {
                    post.content_image = post.content_image?.split(',');

                    req.body.imageNames.forEach((imageName) => {
                        const existedImage = post.content_image.indexOf(imageName);
                        const newImage = req.files.map(file => file.originalname).indexOf(imageName);

                        if (existedImage > -1) {
                            req.body.content_image.push(imageName);
                        } else if (newImage > -1) {
                            req.body.content_image.push(req.files[newImage].filename);
                        }
                    });

                    post?.content_image?.forEach((image) => {
                        if (req.body.content_image.indexOf(image) === -1) {
                            const filePath = path.resolve(__dirname, '../uploads/posts', image);
                            fs.unlinkSync(filePath);
                        }
                    });
                    req.body.content_image = req.body.content_image.join(',');
                }
                await Post.updatePostImages(req.body);
            }

            res.status(200).json({ message: "Images Uploaded" });
        } catch (error) {
            next(error);
        }
    }

    static async createPost(req, res, next) {
        try {
            req.body.authorId = req.user.id;
            req.body.publishDate = Date.now();

            const result = await Post.createPost(req.body);
            req.body.categories.forEach(async (value) => {
                const categoryCheck = await Category.getCategoryByTitle(value);

                if (categoryCheck) {
                    await Post.addPostCategory(categoryCheck.id, result.insertId)
                } else {
                    let category = {
                        title: value,
                        description: ""
                    }
                    category = await Category.createCategory(category);
                    await Post.addPostCategory(category.insertId, result.insertId)
                }
            });

            res.status(201).json({ message: 'Post Created', id: result.insertId });
        } catch (error) {
            next(error);
        }
    }

    static async createPostLike(req, res, next) {
        try {
            req.body.postId = req.params.id;
            req.body.authorId = req.user.id;

            const post = await Post.getPostById(req.body.postId);
            if (!post) return next(ApiError.NotFound('You Try To Like Post That Doesn Exist'));

            const like = await Like.getPostLikeByUser(req.body);
            let { rating } = await User.getUserData('id', post.author_id);

            if (like && (like.type === req.body.type)) {
                if (like.type === 1) return next(ApiError.Conflict('You Already Liked This Post'));
                else return next(ApiError.Conflict('You Already Disliked This Post'));
            } else if (like) {
                req.body.likeId = like.id;
                await Like.updatePostLike(req.body);
                if (req.body.type === 1) {
                    User.updateUserRating(post.author_id, rating + 2);
                    res.status(200).json({ message: 'Post Liked', count: 2 });
                } else {
                    User.updateUserRating(post.author_id, rating - 2);
                    res.status(200).json({ message: 'Post Disliked', count: -2 });
                }
            } else {
                req.body.publishDate = Date.now();
                await Like.createPostLike(req.body);
                if (req.body.type === 1) {
                    User.updateUserRating(post.author_id, rating + 1);
                    res.status(201).json({ message: 'Post Liked', count: 1 });
                } else {
                    User.updateUserRating(post.author_id, rating - 1);
                    res.status(201).json({ message: 'Post Disliked', count: -1 });
                }
            }
        } catch (error) {
            next(error)
        }
    }

    static async updatePost(req, res, next) {
        try {
            req.body.postId = req.params.id;
            req.body.authorId = req.user.id;
            req.body.admin = req.user.admin;

            const post = await Post.getPostById(req.body.postId);
            if (!post) return next(ApiError.NotFound('You Try To Change Post That Doesn Exist'));
            if (!req.user.admin && (post.author_id !== req.body.authorId)) return next(ApiError.Forbidden('You Dont Have Permissions'));

            req.body.title = req.body.title || post.title;
            req.body.content = req.body.content || post.content;
            req.body.content_image = post.content_image;

            if (!req.body.status && !(req.body.status === 0)) {
                req.body.status = post.status;
            }

            await Post.updatePost(req.body);

            if (req.body.categories) {
                const categories = req.body.categories;
                await Post.deletePostCategories(req.body.postId);

                categories.forEach(async (value) => {
                    const categoryCheck = await Category.getCategoryByTitle(value);

                    if (categoryCheck) {
                        await Post.addPostCategory(categoryCheck.id, req.body.postId)
                    } else {
                        let category = {
                            title: value,
                            description: ""
                        }
                        category = await Category.createCategory(category);
                        await Post.addPostCategory(category.insertId, req.body.postId)
                    }
                });
            }

            res.status(200).json({ message: 'Post Updated' });
        } catch (error) {
            next(error)
        }
    }

    static async deletePost(req, res, next) {
        try {
            req.body.postId = req.params.id;
            req.body.authorId = req.user.id;

            const post = await Post.getPostById(req.body.postId);
            if (!post) return next(ApiError.NotFound('You Try To Delete Post That Doesn Exist'));
            if (!req.user.admin && (post.author_id !== req.body.authorId)) return next(ApiError.Forbidden('You Dont Have Permissions'));

            if (post.content_image) {
                post.content_image = post.content_image?.split(',');

                post.content_image.forEach((image) => {
                    const filePath = path.resolve(__dirname, '../uploads/posts', image);
                    fs.unlinkSync(filePath);
                });
            }

            await Post.deletePost(req.body.postId)
            res.status(200).json({ message: 'Post Delted' });
        } catch (error) {
            next(error)
        }
    }

    static async deletePostLike(req, res, next) {
        try {
            req.body.postId = req.params.id;
            req.body.authorId = req.user.id;

            const post = await Post.getPostById(req.body.postId);
            if (!post) return next(ApiError.NotFound('You Try To Delete Like For Post That Doesn Exist'));
            const like = await Like.getPostLikeByUser(req.body);
            if (!like) return next(ApiError.NotFound('You Try To Delete Like That Doesn Exist'));

            await Like.deletePostLike(req.body);
            let { rating } = await User.getUserData('id', post.author_id);

            if (like.type === 1) {
                User.updateUserRating(post.author_id, rating - 1);
                res.status(200).json({ message: 'Like Deleted', count: -1 });
            } else {
                User.updateUserRating(post.author_id, rating + 1);
                res.status(200).json({ message: 'Dislike Deleted', count: 1 });
            }
        } catch (error) {
            next(error)
        }
    }

}

module.exports = postController;
