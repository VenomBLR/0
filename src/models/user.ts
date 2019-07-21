import { Length } from "class-validator";
export default class User {

        userid: number;

        @Length(4, 20)
        username: string; 

        @Length(4, 100)
        password: string; 

        firstname: string;

        lastname: string;
  
        email: string; 

        roleid: number;
        
        role: string;
        
        constructor(obj: { userid: number; username: string; password: string; firstname: string; lastname: string; email: string; roleid: number; role: string; }){
          if (!obj) {return;} 
            this.userid = obj.userid; 
            this.username = obj.username;  
            this.password = obj.password; 
            this.firstname = obj.firstname; 
            this.lastname = obj.lastname; 
            this.email = obj.email; 
            this.roleid = obj.roleid;
            this.role = obj.role; 
        } 
}