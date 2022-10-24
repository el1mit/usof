const TokenUtils = require('../utils/tokensUtils');
const ApiError = require('../utils/errorUtils');

module.exports.checkRole = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            let token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
            if (!token) return next(ApiError.Unauthorized('Access Denied'));
            req.user = TokenUtils.verifyToken(token);

            if (!req.user.admin) return next(ApiError.Forbidden('You Dont Have Permissions'));
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next(ApiError.Unauthorized('Token Is Required'));
    }
}
