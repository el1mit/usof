const Comment = require('../models/Comment');
const Like = require('../models/Like');
const ApiError = require('../utils/errorUtils');

class commentsController {

    static async getCommentById(req, res, next) {
        try {
            const comment = await Comment.getCommentById(req.params.id);
            if (comment) res.status(200).json({ comment: comment });
            else return next(ApiError.NotFound('Comment Not Found'));
        } catch (error) {
            next(error)
        }
    }

    static async getCommentLikes(req, res, next) {
        try {
            const comment = await Comment.getCommentById(req.params.id);
            if (!comment) return next(ApiError.NotFound('You Try To Check Likes For Comment That Doesn Exist'));

            const likes = await Like.getCommentLikes(req.params.id);
            res.status(200).json({ likes_count: likes.likes_count - likes.dislikes_count });
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
                return next(ApiError.Conflict('You Already Done this'));
            } else if (like) {
                req.body.likeId = like.id;
                await Like.updateCommentLike(req.body);
                res.status(200).json({ message: 'Like Updated' });
            } else {
                let date = new Date();
                let yyyy = date.getFullYear();
                let mm = date.getMonth() + 1;
                let dd = date.getDate();
                req.body.publishDate = `${yyyy}-${mm}-${dd}`;

                await Like.createCommentLike(req.body);
                res.status(201).json({ message: 'Comment Liked' });
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
            if (comment.author_id !== req.body.authorId) return next(ApiError.Forbidden('You Are Not The Author Of The Comment'));

            req.body.content = req.body.content || comment.content;
            await Comment.updateComment(req.body);

            res.status(200).json({ message: 'Post Updated' });
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
            if (comment.author_id !== req.body.authorId) return next(ApiError.Forbidden('You Are Not The Author Of The Comment'));

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
            res.status(200).json({ message: 'Like Delted' });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = commentsController;
