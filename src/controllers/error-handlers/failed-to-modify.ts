import { HttpStatusCode } from '../http-status-code'
import { BaseError } from './base-error';

export class FailedToModifyError extends BaseError {
    constructor(type: string, id: number, httpCode = HttpStatusCode.INTERNAL_SERVER, description = `Failed in modify the ${type} with id ${id}`) {
        super(httpCode, description);
    }
}