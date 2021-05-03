import { HttpStatusCode } from '../http-status-code'
import { BaseError } from './base-error';

export class AlreadyInUseError extends BaseError {
    constructor(attribute: string, value: string, httpCode = HttpStatusCode.UNAUTHORIZED, description = `${attribute} with value (${value}) is already in use`) {
        super(httpCode, description);
    }
}