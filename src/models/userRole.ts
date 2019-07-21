export default class Role{

    roleid: number;
    role: string; 
    constructor(obj) {
        if (!obj) {return;}
        this.roleid = obj.roleid;
        this.role = obj.role;
    }
}