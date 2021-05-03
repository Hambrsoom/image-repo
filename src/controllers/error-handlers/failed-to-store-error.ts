import { HttpStatusCode } from '../http-status-code'
import { BaseError } from './base-error';

export class FailedToStoreError extends BaseError {
    constructor(type: string, httpCode = HttpStatusCode.INTERNAL_SERVER, description = `Failed in storing the ${type} in the database`) {
        super(httpCode, description);
    }
}