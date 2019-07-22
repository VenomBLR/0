import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import Pool from '../services/serviceDb';
import User from '../models/user';
import JWT from "../services/JWT";

class controllerAuth {
  static login = async (req: Request, res: Response) => {
    let { username, password } = req.body;  //Check if username and password are set                             
    if (!(username && password)) {res.status(400).send("Username or password are incorrect");}
    try {  //Get user from database
    const userDB = await Pool.query(`select * from GetUserByName($1)`, [username]);
    const userData = userDB.rows[0];
    const newUser = new User(userData);
    //Check if encrypted password match
    bcrypt.compare(password, newUser.password).then(function(match) {
    if(match) {
        const token = jwt.sign({ userid: newUser.userid, username: newUser.username, role: newUser.role }, JWT.jwtSecret, { expiresIn: "2h" } );
        res.setHeader('auth', token);
        res.end("Authentication Success!!!");} else {res.status(404).send("Authentication failed!!!");} 
    });   
    } catch (error) {res.status(401).send(`Error!!! ${error}`);};      
    } 

    static changePassword = async (req: Request, res: Response) => {
    //Get ID and username from JWT
    const username = res.locals.jwtPayload.username;
    const id = res.locals.jwtPayload.userid;
    //Get parameters from the body
    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {res.status(400).send("Passwords don't match!!!");}
    try { //Get user from the database
    const userDB = await Pool.query(`select * from GetUserByName($1)`,[username]);
    const userData = userDB.rows[0];
    const newUser = new User(userData);
    //Check if encrypted password match
    bcrypt.compare(oldPassword, newUser.password).then(function(match) {
      if(match) {
      //Hash the new password and save
      bcrypt.hash(newPassword, 10).then(function(passhash) {
      //Store hash in database
      Pool.query(`select * from SavePassById($1, $2)`, [passhash, id]);            
      });
      res.status(201).send('Passwords match and were changed!!!');
      } else {
      res.status(401).send(`Passwords don't match!!!`); 
      }
      }
    );
    }  catch (error) {res.status(401).send(`Error!!! ${error}`);};
}
}
export default controllerAuth;