const Category = require('../models/Category');
const ApiError = require('../utils/errorUtils');

class categoriesController {

    static async getAllCategories(req, res, next) {
        try {
            const categories = await Category.getAllCategories();
            res.status(200).json(categories)
        } catch (error) {
            next(error);
        }
    }

    static async getCategoryById(req, res, next) {
        try {
            const category = await Category.getCategoryById(req.params.id);
            if (category) res.status(200).json(category);
            else return next(ApiError.NotFound('Category Not Found'));
        } catch (error) {
            next(error);
        }
    }

    static async getCategoryPosts(req, res, next) {
        try {
            const category = await Category.getCategoryById(req.params.id);
            if (!category) return next(ApiError.NotFound('You Try To Check Posts For Category That Doesnt Exist'));

            const categories = await Category.getCategoryPosts(req.params.id);
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    static async createCategory(req, res, next) {
        try {
            const categoryCheck = await Category.getCategoryByTitle(req.body.title);
            if (categoryCheck) return next(ApiError.NotFound('Category Already Exist'));

            await Category.createCategory(req.body);
            res.status(201).json({ message: 'Category Created', category: req.body.title })
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
