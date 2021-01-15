
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  let jwtPayload: any;
  // try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token.slice(7), config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.sendStatus(401);
    return;
  }

  next();
};
