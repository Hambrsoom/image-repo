import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../utils/error-handlers/base-error';
 
export default function errorMiddleware(error: BaseError, request: Request, response: Response, next: NextFunction) {
  const status = error.httpStatusCode || 500;
  const message = error.message || 'Something went wrong';
  response
    .status(status)
    .send({message});
}