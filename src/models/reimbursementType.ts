export default class ReimbursementType{
    typeid: number;
    type: string;

    constructor(obj) {
        if (!obj) {return;}
        this.typeid = obj.typeid;        
        this.type = obj.type;
    }
}