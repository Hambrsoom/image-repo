import { HttpStatusCode } from '../http-status-code'
import { BaseError } from './base-error';

export class APIError extends BaseError {
    constructor(httpCode = HttpStatusCode.INTERNAL_SERVER, description = 'Internal server error') {
        super(httpCode, description);
    }
}