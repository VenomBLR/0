import { Request, Response } from "express";
import Reimbursement from '../models/reimbursement';
import Pool from '../services/serviceDb';


class controllerReimbursement{

    static byStatus = async (req: Request, res: Response) => {
      //Get the Statusid from the url
      const reqid: number = req.params.statusid;
      //Get Reimbursements from database
      try {
      const reimbursement = await Pool.query(`select * from GetAllReimbursementStatusId($1)`, [reqid]) 
      const reimbursementData = reimbursement.rows;
      if (!(reimbursementData.length == 0)) {
      res.status(200).send(reimbursementData);
      } else {
      res.status(404).send("Reimbursements not found");    
      } 
    } catch (error) {res.status(401).send(`Error!!! ${error}`);};  
    };
    
    static getOneById = async (req: Request, res: Response) => {
      //Get the UserID from the url
      const reqid: number = req.params.id;
      //Get UserID from JWT
      const id = res.locals.jwtPayload.userid;
      //Get the user role from JWT
      const role = res.locals.jwtPayload.role;
      try {
      if ((reqid == id) || (role == 'Manager')) {const reimbursement = await Pool.query(`select * from GetReimbursementById($1)`, [reqid]);
      if (reimbursement.rows[0]) {
      res.status(200).send(reimbursement.rows); 
      } else {
      res.status(404).send("User not found");
      }
      } else {
      res.status(404).send("You are not authorized"); 
      }
     } catch (error) {res.status(401).send(`Error!!! ${error}`);}; 
    };
    
    static submitReimbursement = async (req: Request, res: Response) => {
      //Get parameters from the body
      try{
       let { reimbursementid, author, amount, datesubmitted, dateresolved, description, resolver, statusid, typeid } = req.body;
       if (!(reimbursementid)) { 
       const newReimbursement = new Reimbursement(req.body);
       delete newReimbursement.reimbursementid;
       for (let key in newReimbursement) { if (!(newReimbursement[key])) {newReimbursement[key] = null;}} 
       //Store Reimbursement in database.
       await Pool.query(`select SubmitReim($1, $2, 'now', $3, $4, $5, $6, $7)`, [newReimbursement.author, newReimbursement.amount, newReimbursement.dateresolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.statusid, newReimbursement.typeid]);  
       res.status(201).send("Reimbursement was submited!!!");
       } else {res.status(404).send("Reimbursementid is incorrect!!!");}
       } catch (error) {res.status(401).send(`Error!!! ${error}`);};    
      };
   
    static editReimbursement = async (req: Request, res: Response) => {
      //Get values from the body
      try{
      let { reimbursementid, author, amount, datesubmitted, dateResolved, description, resolver, statusid, typeid } = req.body;
      let updateReimbursement = new Reimbursement(req.body);
      //Try to find reimbursement on database
      const reimbursementDB = await Pool.query(`select * from GetReimbursement($1)`, [updateReimbursement.reimbursementid]);
      const newReimbursement = new Reimbursement(reimbursementDB.rows[0]);
      if (updateReimbursement.reimbursementid) {
       for (let key in updateReimbursement) { if (!(updateReimbursement[key])) {updateReimbursement[key] = null;}} 
        for (let key in newReimbursement) { if (!(updateReimbursement[key])) {newReimbursement[key] = newReimbursement[key];} else {newReimbursement[key] = updateReimbursement[key]}};
         await Pool.query(`select EditReimById($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [newReimbursement.author, newReimbursement.amount, newReimbursement.datesubmitted, newReimbursement.dateresolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.statusid, newReimbursement.typeid, reimbursementid]);
           res.status(200).send("Reimbursement was changed!!!" );
        } else {res.status(404).send("Reimbursement not found!!!");}
      } catch (error) {res.status(401).send(`Error!!! ${error}`);};    
     };
   };
   
export default controllerReimbursement;