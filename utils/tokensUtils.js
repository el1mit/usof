const jwt = require('jsonwebtoken');
const ApiError = require('./errorUtils');

class TokenUtils {

    static createTokenAuth(data) {
        const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '14d', });
        return token;
    }

    static createTokenActivate(data) {
        const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '2h', });
        return token;
    }

    static createTokenReset(data) {
        const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '10m', });
        return token;
    }

    static verifyToken (token) {
        try {
            return jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            throw ApiError.UnprocessableEntity('Invalid token');
        }
    }
    
}

module.exports = TokenUtils;
