import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import JWT from "../services/JWT";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  let jwtPayload;
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, JWT.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }
  //The token is valid for 2 hour
  //We want to send a new token on every request
  const { userid, username, role } = jwtPayload;
  const newToken = jwt.sign({ userid, username, role }, JWT.jwtSecret, {expiresIn: "2h"});
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Authorization' , `${newToken}`);
  //Call the next middleware or controller
  next();
};