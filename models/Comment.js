const db = require('../config/db');

class Comment {

    static async getCommentById(id) {
        try {
            let sql = `SELECT * FROM comments WHERE id = ${id}`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getPostComments(postId) {
        try {
            let sql = `SELECT comments.*, users.login AS author_login FROM comments 
            INNER JOIN users ON comments.author_id = users.id 
            WHERE post_id = ${postId}`;
            const [data, _] = await db.execute(sql);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async createComment(data) {
        try {
            let sql = `INSERT INTO comments (author_id, publish_date, content, post_id) 
                VALUES ('${data.authorId}', '${data.publishDate}', '${data.content}', '${data.postId}')`;
            const [user, _] = await db.execute(sql);
            return user[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async updateComment(data) {
        try {
            let sql = `UPDATE comments SET content = '${data.content}' WHERE id = ${data.commentId}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteComment(id) {
        try {
            let sql = `DELETE FROM comments WHERE id = ${id} `;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Comment;