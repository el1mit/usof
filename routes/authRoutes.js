const router = require('express').Router();
const authController = require('../controllers/authController');
const Validation = require('../middlewares/validation');
const { checkAuth } = require('../middlewares/checkAuth');

router.get('/activation/:token', authController.accountConfirmation);
router.post('/register', Validation.registerValidation, authController.register);
router.post('/login', Validation.loginValidation, authController.login);
router.post('/logout', checkAuth, authController.logout);
router.post('/password-reset', Validation.passResetValidation, authController.sendLink);
router.post('/password-reset/:token', Validation.newPassValidation, authController.resetPassword);

module.exports = router;
