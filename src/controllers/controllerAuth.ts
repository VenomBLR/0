import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import Pool from '../services/serviceDb';
import User from '../models/user';
import JWT from "../services/JWT";

class controllerAuth {
  static login = async (req: Request, res: Response) => {
  try {  
    let payload = req.body;                        
    if (!(payload.username && payload.password)) {res.status(400).send("Username or password are incorrect!!!");} //Check if username and password are set  
    const userDB = await Pool.query(`select * from GetUserByName($1)`, [payload.username]); //Get user from database
    if (!(userDB.rows[0])){res.status(400).send("User does not exist!!!");}
    const userData = userDB.rows[0];
    const newUser = new User(userData);
    //Check if encrypted password match
    bcrypt.compare(payload.password, newUser.password).then(function(match) {
    if(match) {
        const token = jwt.sign({userid: newUser.userid, username: payload.username, role: newUser.role }, JWT.jwtSecret, { expiresIn: "2h" } );
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.set({'Authorization' : `${token}`}); res.end('Authentication Ok!!!');} else {res.status(404).send("Authentication failed!!!");} 
    });
    } catch (error) {res.status(401).send(`Error!!! ${error}`);};      
  } 

  static changePassword = async (req: Request, res: Response) => {
  try { 
    //Get ID and username from JWT
    const username = res.locals.jwtPayload.username;
    const id = res.locals.jwtPayload.userid;
    const {oldPassword, newPassword} = req.body; //Get parameters from the body
    if (!(oldPassword && newPassword)) {res.status(400).send("Passwords don't match!!!");}
    const userDB = await Pool.query(`select * from GetUserByName($1)`,[username]); //Get user from the database
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
      } else {
      res.status(401).send(`Passwords don't match!!!`); 
      }
      }
    );
    const newToken = jwt.sign({userid: newUser.userid, username: newUser.username, role: newUser.role }, JWT.jwtSecret, {expiresIn: "2h"});
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, PATCH, UPDATE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Authorization' , `${newToken}`); res.end('Password was changed!!!');
    }  catch (error) {res.status(401).send(`Error!!! ${error}`);};
}
}
export default controllerAuth;