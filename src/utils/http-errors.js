module.exports.BadRequestError = class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = "BadRequestError"
        this.statusCode = 400
    }
}

module.exports.UnauthorizedError = class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
        this.name = "UnauthorizedError"
        this.statusCode = 401
    }
}

module.exports.PaymentRequiredError = class PaymentRequiredError extends Error {
    constructor(message) {
        super(message)
        this.name = "PaymentRequiredError"
        this.statusCode = 402
    }
}

module.exports.NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFoundError"
        this.statusCode = 404
    }
}

module.exports.NotAcceptableError = class NotAcceptableError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotAcceptableError"
        this.statusCode = 406
    }
}

module.exports.ConflictError = class ConflictError extends Error {
    constructor(message) {
        super(message)
        this.name = "ConflictError"
        this.statusCode = 409
    }
}

module.exports.UnprocessableEntityError = class UnprocessableEntityError extends Error {
    constructor(message) {
        super(message)
        this.name = "UnprocessableEntityError"
        this.statusCode = 422
    }
}

module.exports.InternalServerError = class InternalServerError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.name = "InternalServerError"
        this.statusCode = statusCode || 500
    }
}

module.exports.DatabaseError = class DatabaseError extends this.InternalServerError {
    constructor(message, statusCode) {
        super(message, statusCode)
        this.name = "DatabaseError"
    }
}
