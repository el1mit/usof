const db = require('../config/db');

class Category {

    static async getAllCategories() {
        try {
            let sql = `SELECT * FROM categories`;
            const [data, _] = await db.execute(sql);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async getCategoryById(id) {
        try {
            let sql = `SELECT * FROM categories WHERE id = ${id}`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getCategoryByTitle(title) {
        try {
            let sql = `SELECT * FROM categories WHERE title = '${title}'`;
            const [data, _] = await db.execute(sql);
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getCategoryPosts(categoryId) {
        try {
            let sql = `SELECT post_categories.*, categories.title AS category_title, posts.title AS post_title FROM post_categories 
                INNER JOIN posts ON post_categories.post_id = posts.id 
                INNER JOIN categories ON post_categories.category_id = categories.id 
                WHERE post_categories.category_id = ${categoryId}`;
            const [data, _] = await db.execute(sql);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async createCategory(data) {
        try {
            let sql = `INSERT INTO categories (title, description) VALUES ('${data.title}', '${data.description}')`;
            const [post, _] = await db.execute(sql);
            return post;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateCategory(data) {
        try {
            let sql = `UPDATE categories 
                SET title = '${data.title}', description = '${data.description}' 
                WHERE id = ${data.categoryId}`;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteCategory(id) {
        try {
            let sql = `DELETE FROM categories WHERE id = ${id} `;
            return await db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Category;
