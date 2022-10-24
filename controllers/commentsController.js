const Comment = require('../models/Comment');
const Like = require('../models/Like');
const ApiError = require('../utils/errorUtils');

class commentsController {

    static async getCommentById(req, res, next) {
        try {
            const comment = await Comment.getCommentById(req.params.id);
            if (comment) res.status(200).json(comment);
            else return next(ApiError.NotFound('Comment Not Found'));
        } catch (error) {
            next(error)
        }
    }

    static async getCommentLikes(req, res, next) {
        try {
            const comment = await Comment.getCommentById(req.params.id);
            if (!comment) return next(ApiError.NotFound('You Try To Check Likes For Comment That Doesn Exist'));

            let likes = await Like.getCommentLikes(req.params.id);
            if (!likes.comment_id) likes = { ...likes, comment_id: req.params.id }
            likes = { ...likes, count: likes.likes_count - likes.dislikes_count };

            res.status(200).json(likes);
        } catch (error) {
            next(error);
        }
    }

    static async createCommentLike(req, res, next) {
        try {
            req.body.commentId = req.params.id;
            req.body.authorId = req.user.id;

            const comment = await Comment.getCommentById(req.body.commentId);
            if (!comment) return next(ApiError.NotFound('You Try To Like Comment That Doesn Exist'));

            const like = await Like.getCommentLikeByUser(req.body);
            if (like && like.type === req.body.type) {
                if (like.type === 1) return next(ApiError.Conflict('You Already Liked This Comment'));
                else return next(ApiError.Conflict('You Already Disliked This Comment'));
            } else if (like) {
                req.body.likeId = like.id;
                await Like.updateCommentLike(req.body);
                if (req.body.type === 1) {
                    res.status(200).json({ message: 'Comment Liked', count: 2 });
                } else {
                    res.status(200).json({ message: 'Comment Disliked', count: -2 });
                }
            } else {
                req.body.publishDate = Date.now();
                await Like.createCommentLike(req.body);
                if (req.body.type === 1) {
                    res.status(201).json({ message: 'Comment Liked', count: 1 });
                } else {
                    res.status(201).json({ message: 'Comment Disliked', count: -1 });
                }
            }
        } catch (error) {
            next(error)
        }
    }

    static async updateComment(req, res, next) {
        try {
            req.body.commentId = req.params.id;
            req.body.authorId = req.user.id;

            const comment = await Comment.getCommentById(req.body.commentId);
            if (!comment) return next(ApiError.NotFound('You Try To Change Comment That Doesn Exist'));
            if (!req.user.admin && (comment.author_id !== req.body.authorId)) return next(ApiError.Forbidden('You Are Not The Author Of The Comment'));

            req.body.content = req.body.content || comment.content;
            await Comment.updateComment(req.body);

            res.status(200).json({ message: 'Comment Updated' });
        } catch (error) {
            next(error)
        }
    }

    static async deleteComment(req, res, next) {
        try {
            req.body.commentId = req.params.id;
            req.body.authorId = req.user.id;

            const comment = await Comment.getCommentById(req.body.commentId);
            if (!comment) return next(ApiError.NotFound('You Try To Delete Comment That Doesn Exist'));
            if (!req.user.admin && (comment.author_id !== req.body.authorId)) return next(ApiError.Forbidden('You Are Not The Author Of The Comment'));

            await Comment.deleteComment(req.body.commentId)
            res.status(200).json({ message: 'Comment Delted' });
        } catch (error) {
            next(error)
        }
    }

    static async deleteCommentLike(req, res, next) {
        try {
            req.body.commentId = req.params.id;
            req.body.authorId = req.user.id;

            const comment = await Comment.getCommentById(req.body.commentId);
            if (!comment) return next(ApiError.NotFound('You Try To Delete Like For Comment That Doesn Exist'));
            const like = await Like.getCommentLikeByUser(req.body);
            if (!like) return next(ApiError.NotFound('You Try To Delete Like That Doesn Exist'));

            await Like.deleteCommentLike(req.body)
            if (like.type === 1) {
                res.status(200).json({ message: 'Like Deleted', count: -1 });
            } else {
                res.status(200).json({ message: 'Dislike Deleted', count: 1 });
            }
        } catch (error) {
            next(error)
        }
    }

}

module.exports = commentsController;
