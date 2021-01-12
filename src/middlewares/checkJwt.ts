
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // get the jwt token from the head
  // format Token: Authorization: Bearer <accesss_token>
  const token = req.headers["authorization"];

  // if(!token) {
  //   return res.status(401).send("Sorry pal");
  // } else {
  //   // validate JWT:
  //   const tokenBody = token.slice(7);
  //   jwt.verify(tokenBody,)
  //   next()
  // }
  let jwtPayload: any;
  // try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token.slice(7), config.jwtSecret);
    console.log(jwtPayload);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // if token is not valid, respond with 401 (unauthorized)
    res.status(401).send("here");
    return;
  }

  // the token is valid for 1 hour
  // we want to send a new token on every request
  const { userId, username } = jwtPayload;
  console.log(userId)
  const newToken:any = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: "1h"
  });

  
  // call the next middleware or controller
  next();
};
//}
