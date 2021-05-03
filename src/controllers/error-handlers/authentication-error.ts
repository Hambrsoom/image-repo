import { HttpStatusCode } from './http-status-code'
import { BaseError } from './base-error';

export class NotAuthenticatedError extends BaseError {
    constructor(httpCode = HttpStatusCode.FORBIDDEN, description = 'Must authenticate') {
        super(httpCode, description);
    }
}

export class NotAuthorizedError extends BaseError {
    constructor(httpCode = HttpStatusCode.UNAUTHORIZED, description = 'Not authorized') {
        super(httpCode, description);
    }
}

export class IncorrectCredentialsError extends BaseError {
    constructor(httpCode = HttpStatusCode.UNAUTHORIZED, description = 'Either your username or password is incorrect') {
        super(httpCode, description);
    }
}