const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const ApiError = require('../utils/errorUtils');

class postController {

    static async getAllPosts(req, res, next) {
        try {
            const posts = await Post.getAllPosts();
            res.status(200).json({ posts: posts })
        } catch (error) {
            next(error)
        }
    }

    static async getPostById(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (post) res.status(200).json({ post: post });
            else return next(ApiError.NotFound('Post Not Found'));
        } catch (error) {
            next(error)
        }
    }

    static async getPostComments(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Check Comments For Post That Doesnt Exist'));

            const comments = await Comment.getPostComments(req.params.id);
            res.status(200).json({ comments: comments });
        } catch (error) {
            next(error)
        }
    }

    static async createComment(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Comment Post That Doesnt Exist'));

            let date = new Date();
            let yyyy = date.getFullYear();
            let mm = date.getMonth() + 1;
            let dd = date.getDate();

            let data = {
                authorId: req.user.id,
                publishDate: `${yyyy}-${mm}-${dd}`,
                content: req.body.content,
                postId: req.params.id
            };

            const comment = await Comment.createComment(data);
            res.status(201).json({ message: 'Comment Created', comment: comment })
        } catch (error) {
            next(error)
        }
    }

    static async getPostCategories(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Check Categories For Post That Doesnt Exist'));

            const categories = await Post.getPostCategories(req.params.id);
            res.status(200).json({ categories: categories });
        } catch (error) {
            next(error)
        }
    }

    static async getPostLikes(req, res, next) {
        try {
            const post = await Post.getPostById(req.params.id);
            if (!post) return next(ApiError.NotFound('You Try To Check Likes For Post That Doesn Exist'));

            const likes = await Like.getPostLikes(req.params.id);
            res.status(200).json({ likes_count: likes.likes_count - likes.dislikes_count });
        } catch (error) {
            next(error);
        }
    }

    static async createPost(req, res, next) {
        try {
            let date = new Date();
            let yyyy = date.getFullYear();
            let mm = date.getMonth() + 1;
            let dd = date.getDate();

            req.body.authorId = req.user.id;
            req.body.publishDate = `${yyyy}-${mm}-${dd}`;

            const result = await Post.createPost(req.body);
            await Post.addPostCategories(req.body.categories, result.insertId);
            res.status(201).json({ message: 'Post Created', title: req.body.title });
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
            if (like && like.type === req.body.type) {
                return next(ApiError.Conflict('You Already Done this'));
            } else if (like) {
                req.body.likeId = like.id;
                await Like.updatePostLike(req.body);
                res.status(200).json({ message: 'Like Updated' });
            } else {
                let date = new Date();
                let yyyy = date.getFullYear();
                let mm = date.getMonth() + 1;
                let dd = date.getDate();
                req.body.publishDate = `${yyyy}-${mm}-${dd}`;

                await Like.createPostLike(req.body);
                res.status(201).json({ message: 'Post Liked' });
            }
        } catch (error) {
            next(error)
        }
    }

    static async updatePost(req, res, next) {
        try {
            req.body.postId = req.params.id;
            req.body.authorId = req.user.id;

            const post = await Post.getPostById(req.body.postId);
            if (!post) return next(ApiError.NotFound('You Try To Change Post That Doesn Exist'));
            if (post.author_id !== req.body.authorId) return next(ApiError.Forbidden('You Are Not The Author Of The Post'));

            req.body.title = req.body.title || post.title;
            req.body.content = req.body.content || post.content;
            await Post.updatePost(req.body);

            if (req.body.categories) {
                const categories = req.body.categories;
                await Post.deletePostCategories(req.body.postId);
                await Post.addPostCategories(categories, req.body.postId);
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
            if (post.author_id !== req.body.authorId) return next(ApiError.Forbidden('You Are Not The Author Of The Post'));

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

            await Like.deletePostLike(req.body)
            res.status(200).json({ message: 'Like Delted' });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = postController;
