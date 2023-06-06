const router = require('express').Router();
const userController = require('../controllers/userController');
const Validation = require('../middlewares/validation');
const { checkRole } = require('../middlewares/checkRole');
const { checkAuth } = require('../middlewares/checkAuth');
const { avatarUpload } = require('../middlewares/fileUpload');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/posts', userController.getAllUserPosts);
router.post('/', checkAuth, checkRole, Validation.registerValidation, userController.createNewUser);
router.patch('/avatar', checkAuth, avatarUpload.single('avatar'), userController.uploadUserAvatar);
router.patch('/:id', checkAuth, Validation.updateValidation, userController.updateUserData);
router.delete('/avatar', checkAuth, userController.deleteUserAvatar);
router.delete('/:id', checkAuth, userController.deleteUserById);

module.exports = router;
