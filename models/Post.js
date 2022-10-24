const db = require('../config/db');

class Post {

    static async getAllPosts() {
        try {
            let sql = `SELECT posts.*, users.login, users.full_name, users.avatar
                FROM posts 
                INNER JOIN users ON posts.author_id = users.id
                GROUP BY posts.id`;
            const [data, _] = await db.execute(sql);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getPostById(id) {
        try {
            let sql = `SELECT posts.*, users.login, users.full_name, users.avatar
                FROM posts
                INNER JOIN users ON posts.author_id = users.id 
                WHERE posts.id = ${id}`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getPostCategories(postId) {
        try {
            let sql = `SELECT post_categories.post_id,
                GROUP_CONCAT(post_categories.category_id) AS categories_id,
                GROUP_CONCAT(categories.title) AS categories_titles 
                FROM post_categories 
                INNER JOIN categories ON post_categories.category_id = categories.id 
                WHERE post_categories.post_id = ${postId}
                GROUP BY post_categories.post_id`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async createPost(data) {
        try {
            let sql = `INSERT INTO posts (author_id, title, publish_date, status, content) 
                VALUES ('${data.authorId}', '${data.title}', '${data.publishDate}', '0', '${data.content}')`;
            const [post, _] = await db.execute(sql);
            return post;
        } catch (error) {
            console.log(error);
        }
    }

    static async addPostCategory(category_id, post_id) {
        try {
            let sql = `INSERT INTO post_categories (post_id, category_id) 
                    VALUES ('${post_id}', '${category_id}')`;
            await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async updatePost(data) {
        try {
            let sql = `UPDATE posts 
                SET title = '${data.title}', content = '${data.content}', status = ${data.status} 
                WHERE id = ${data.postId}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async deletePostCategories(post_id) {
        try {
            let sql = `DELETE FROM post_categories WHERE post_id = ${post_id}`;
            await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async deletePost(id) {
        try {
            let sql = `DELETE FROM posts WHERE id = ${id} `;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Post;
