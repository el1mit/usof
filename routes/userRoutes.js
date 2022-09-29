const router = require('express').Router();
const userController = require('../controllers/userController');
const Validation = require('../middlewares/validation');
const { checkRole } = require('../middlewares/checkRole');
const { checkAuth } = require('../middlewares/checkAuth');
const { avatarUpload } = require('../middlewares/fileUpload');

router.get('/', checkAuth, userController.getAllUsers);
router.get('/:id', checkAuth, userController.getUserById);
router.post('/', checkAuth, checkRole, Validation.registerValidation, userController.createNewUser);
router.patch('/avatar', checkAuth, avatarUpload.single('avatar'), userController.uploadUserAvatar);
router.patch('/:id', checkAuth, Validation.updateValidation, userController.updateUserData);
router.delete('/:id', checkAuth, userController.deleteUserById);

module.exports = router;
