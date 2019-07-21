import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Pool from '../services/serviceDb';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user role from previous midleware
    const role = res.locals.jwtPayload.role;
    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(role) > -1) next();
    else res.status(401).send("You are not authorized for this operation!!!");
  };
};