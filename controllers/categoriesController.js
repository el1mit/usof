const Category = require('../models/Category');
const ApiError = require('../utils/errorUtils');

class categoriesController {

    static async getAllCategories(req, res, next) {
        try {
            let categories = await Category.getAllCategories();

            for (let i = 0; i < categories.length; i++) {
                let posts = await Category.getCategoryPosts(categories[i].id);
                categories[i].posts_count = posts.length;
            }

            categories?.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1
                : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));

            res.status(200).json(categories)
        } catch (error) {
            next(error);
        }
    }

    static async getCategoryById(req, res, next) {
        try {
            let category = await Category.getCategoryById(req.params.id);
            
            if (category) {
                let posts = await Category.getCategoryPosts(category.id);
                category.posts_count = posts.length;
                res.status(200).json(category);
            } 

            else return next(ApiError.NotFound('Category Not Found'));
        } catch (error) {
            next(error);
        }
    }

    static async getCategoryPosts(req, res, next) {
        try {
            const category = await Category.getCategoryById(req.params.id);
            if (!category) return next(ApiError.NotFound('You Try To Check Posts For Category That Doesnt Exist'));

            const posts = await Category.getCategoryPosts(req.params.id);
            posts?.sort((a, b) => (a.publish_date < b.publish_date) ? 1
            : ((b.publish_date < a.publish_date) ? -1 : 0));
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    static async createCategory(req, res, next) {
        try {
            const categoryCheck = await Category.getCategoryByTitle(req.body.title);
            if (categoryCheck) return next(ApiError.NotFound('Category Already Exist'));

            const newCategory = await Category.createCategory(req.body);
            const category = await Category.getCategoryById(newCategory.insertId);
            res.status(201).json(category)
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            const category = await Category.getCategoryById(req.params.id);
            req.body.title = req.body.title || category.title;
            req.body.description = req.body.description || category.description;
            req.body.categoryId = req.params.id;

            await Category.updateCategory(req.body)
            res.status(200).json({ message: 'Category Updated', category: req.body.title })
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const category = await Category.getCategoryById(req.params.id);
            if (!category) return next(ApiError.NotFound('You Try To Delete Category That Doesn Exist'));

            await Category.deleteCategory(req.params.id)
            res.status(200).json({ message: 'Category Deleted' })
        } catch (error) {
            next(error);
        }
    }

}

module.exports = categoriesController;
