import { HttpStatusCode } from '../http-status-code'
import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
    constructor(id: number, type: string, httpCode = HttpStatusCode.NOT_FOUND, description = `Failed to find the ${type} with id ${id}`) {
        super(httpCode, description);
    }
}