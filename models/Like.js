const db = require('../config/db');

class Like {

    static async getPostLikes(postId) {
        try {
            let sql = `SELECT posts_likes.*,
                (SELECT COUNT(IF(type = 1, 1, NULL))) AS likes_count,
                (SELECT COUNT(IF(type = 0, 1, NULL))) AS dislikes_count
                FROM posts_likes
                WHERE post_id = ${postId}`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async createPostLike(data) {
        try {
            let sql = `INSERT INTO posts_likes (author_id, publish_date, post_id, type) 
                VALUES ('${data.authorId}', '${data.publishDate}', '${data.postId}', '${data.type}')`;
            const [like, _] = await db.execute(sql);
            return like[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getPostLikeByUser(data) {
        try {
            let sql = `SELECT * FROM posts_likes WHERE post_id = ${data.postId} AND author_id = ${data.authorId}`;
            const [like, _] = await db.execute(sql);
            return like[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async updatePostLike(data) {
        try {
            let sql = `UPDATE posts_likes SET type = '${data.type}' WHERE id = ${data.likeId}`;
            const [like, _] = await db.execute(sql);
            return like[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async deletePostLike(data) {
        try {
            let sql = `DELETE FROM posts_likes WHERE author_id = ${data.authorId} AND post_id = ${data.postId} `;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async getCommentLikes(commentId) {
        try {
            let sql = `SELECT comments_likes.*,
                (SELECT COUNT(IF(type = 1, 1, NULL))) AS likes_count,
                (SELECT COUNT(IF(type = 0, 1, NULL))) AS dislikes_count
                FROM comments_likes
                WHERE comment_id = ${commentId}`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async createCommentLike(data) {
        try {
            let sql = `INSERT INTO comments_likes (author_id, publish_date, comment_id, type) 
                VALUES ('${data.authorId}', '${data.publishDate}', '${data.commentId}', '${data.type}')`;
            const [like, _] = await db.execute(sql);
            return like[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getCommentLikeByUser(data) {
        try {
            let sql = `SELECT * FROM comments_likes WHERE comment_id = ${data.commentId} AND author_id = ${data.authorId}`;
            const [like, _] = await db.execute(sql);
            return like[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async updateCommentLike(data) {
        try {
            let sql = `UPDATE comments_likes SET type = '${data.type}' WHERE id = ${data.likeId}`;
            const [like, _] = await db.execute(sql);
            return like[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteCommentLike(data) {
        try {
            let sql = `DELETE FROM comments_likes WHERE author_id = ${data.authorId} AND comment_id = ${data.commentId} `;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Like;
