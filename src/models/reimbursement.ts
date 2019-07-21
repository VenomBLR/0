export default class Reimbursement{

    reimbursementid: Number;

    author: Number;

    amount: Number;

    datesubmitted: string;

    dateresolved: string;

    description: String;

    resolver: String;

    statusid: Number;

    typeid: Number;
       
    constructor(obj) { 
        if (!obj) {return;}   
        this.reimbursementid = obj.reimbursementid; 
        this.author = obj.author; 
        this.amount = obj.amount; 
        this.datesubmitted = obj.datesubmitted; 
        this.dateresolved = obj.dateresolved;
        this.description = obj.description; 
        this.resolver = obj.resolver;
        this.statusid = obj.statusid; 
        this.typeid =obj.typeid; 
    }
}