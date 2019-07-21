export default class ReimbursementStatus{
    statusid: number;
    status: string;
    constructor(obj){
        if (!obj) {return;}  
        this.statusid = obj.statusid;
        this.status = obj.status 
    }
}