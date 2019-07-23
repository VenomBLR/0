import { Request, Response } from "express";
import User from "../models/user";
import * as bcrypt from "bcryptjs";
import Pool from '../services/serviceDb';

class controllerUsers{

static listAll = async (req: Request, res: Response) => {
try { 
  //Get users from database
  const usersDB = await Pool.query(`select * from GetAll()`) //We dont want to send the passwords on response
  res.status(200).send(usersDB.rows);
} catch (error) {res.status(401).send(`Error!!! ${error}`);};     
};

static getOneById = async (req: Request, res: Response) => {
  try {
  //Get the ID from the url
  const reqid: number = req.params.id;
  //Get ID and role from JWT
  const userid = res.locals.jwtPayload.userid;
  const role = res.locals.jwtPayload.role;
  //Get the user from database
  if ((reqid == userid) || (role == "Admin") || (role == "Manager")) {
  const userDB = await Pool.query(`select * from GetById($1) as t1`,[reqid]); //We dont want to send the password on response
  const userData = userDB.rows[0];
  const newUser = new User(userData);
  if (!(newUser.userid)) {res.status(404).send("User not found!!!");} 
  res.status(201).send(userDB.rows);
  } else {
  res.status(404).send("You are not authorized for this operation!!!");
  }
} catch (error) {res.status(401).send(`Error!!! ${error}`);};      
};

static newUser = async (req: Request, res: Response) => {
  try{ 
  //Get parameters from the body
  let { username, password, firstname, lastname, email, roleid } = req.body;
  const newUser = new User(req.body);
  for (let key in newUser) { if (!(newUser[key])) {newUser[key] = null;}}
  //Hash the password, to securely store on DB
  bcrypt.hash(newUser.password, 10).then(function(passhash) {
  //Store newuser in database. If fails, the username is already in use
  Pool.query(`select SaveUser($1, $2, $3, $4, $5, $6)`, [newUser.username, passhash, newUser.firstname, newUser.lastname, newUser.email, newUser.roleid]);  
  res.status(201).send("User created!!!");});
  } catch (error) {res.status(401).send(`Error!!! ${error}`);};    
};

static editUser = async (req: Request, res: Response) => {
  try{ 
  //Get values from the body
  let { userid, username, password, firstname, lastname, email, roleid } = req.body;
  if (!req.body.userid) {res.status(404).send("Userid not found!!!")};
  //Put request into updatedata 
  const updateData = new User(req.body);
  //Try to find user on database
  const userDB = await Pool.query(`select * from GetByIdAdmin($1)`,[userid]);
  const userfromDB = new User(userDB.rows[0]);
  for (let key in userfromDB) { if (!(updateData[key])) {userfromDB[key] = userfromDB[key];} else {userfromDB[key] = updateData[key]}};
  delete userfromDB.userid;
  delete userfromDB.role;
  bcrypt.hash(updateData.password, 10).then(function(passhash) { // Store hash in your password DB.
  Pool.query(`select EditUserById($1, $2, $3, $4, $5, $6, $7)`, [userfromDB.username, passhash, userfromDB.firstname, userfromDB.lastname, userfromDB.email, userfromDB.roleid, userid]); 
  res.status(200).send("User was changed!!!");});
} catch (error) {res.status(401).send(`Error!!! ${error}`);};    
};
}
export default controllerUsers;