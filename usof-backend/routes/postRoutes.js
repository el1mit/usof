const router = require('express').Router();
const postController = require('../controllers/postController');
const Validation = require('../middlewares/validation');
const { checkAuth } = require('../middlewares/checkAuth');
const { postImagesUpload } = require('../middlewares/fileUpload');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/:id/comments', postController.getPostComments);
router.post('/:id/comments', checkAuth, Validation.commentValidation, postController.createComment);
router.get('/:id/categories', postController.getPostCategories);
router.get('/:id/like', postController.getPostLikes);
router.post('/', checkAuth, Validation.postValidation, postImagesUpload.array('images', 10), postController.createPost);
router.patch('/:id/images', checkAuth, postImagesUpload.any('images'), postController.uploadPostImages);
router.post('/:id/like', checkAuth, postController.createPostLike);
router.patch('/:id', checkAuth, Validation.postUpdateValidation, postController.updatePost);
router.delete('/:id', checkAuth, postController.deletePost);
router.delete('/:id/like', checkAuth, postController.deletePostLike);

module.exports = router;
