const router = require('express').Router();
const commentsController = require('../controllers/commentsController');
const Validation = require('../middlewares/validation');
const { checkAuth } = require('../middlewares/checkAuth');

router.get('/:id', commentsController.getCommentById);
router.get('/:id/like', commentsController.getCommentLikes);
router.post('/:id/like', checkAuth, commentsController.createCommentLike);
router.patch('/:id', checkAuth, Validation.commentUpdateValidation, commentsController.updateComment);
router.delete('/:id', checkAuth, commentsController.deleteComment);
router.delete('/:id/like', checkAuth, commentsController.deleteCommentLike);

module.exports = router;
