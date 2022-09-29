const router = require('express').Router();
const categoriesController = require('../controllers/categoriesController');
const Validation = require('../middlewares/validation');
const { checkRole } = require('../middlewares/checkRole');

router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategoryById);
router.get('/:id/posts', categoriesController.getCategoryPosts);
router.post('/', checkRole, Validation.categoryValidation, categoriesController.createCategory);
router.patch('/:id', checkRole, Validation.categoryUpdateValidation, categoriesController.updateCategory);
router.delete('/:id', checkRole, categoriesController.deleteCategory)

module.exports = router;
