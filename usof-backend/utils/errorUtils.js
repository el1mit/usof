class ApiError extends Error {

    constructor(errorCode, message) {
        super(message);
        this.errorCode = errorCode;
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }

    static Unauthorized(message) {
        return new ApiError(401, message);
    }

    static Forbidden(message) {
        return new ApiError(403, message);
    }

    static NotFound(message) {
        return new ApiError(404, message);
    }

    static Conflict(message) {
        return new ApiError(409, message);
    }

    static UnprocessableEntity(message) {
        return new ApiError(422, message);
    }
    
}

module.exports = ApiError;
