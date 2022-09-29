const TokenUtils = require('../utils/tokensUtils');
const ApiError = require('../utils/errorUtils');

module.exports.checkAuth = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            let token = req.headers.authorization.split(' ')[1];
            if (!token) return next(ApiError.Unauthorized('Access Denied'));
            req.user = TokenUtils.verifyToken(token);
            req.token = token;

            if (!req.user.activated) return next(ApiError.Forbidden('Confirm Email First'));
            if (req.originalUrl.match('/api/users/') &&
                ((req.method === 'DELETE' && req.route.path === '/:id') ||
                (req.method === 'PATCH' && req.route.path === '/:id'))) {
                if (req.params.id != req.user.id) {
                    return next(ApiError.Forbidden('You Dont Have Permissions'));
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next(ApiError.Unauthorized('You Dont Have Access'));
    }
}
