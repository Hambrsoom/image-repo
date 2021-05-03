import { HttpStatusCode } from '../http-status-code'

export class BaseError extends Error {
    readonly name: string;
    readonly httpStatusCode: HttpStatusCode;
    readonly message: string;
    
    constructor(httpStatusCode: HttpStatusCode, message: string) {
        super(message);
        
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}