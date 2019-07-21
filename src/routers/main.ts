import { Router } from "express";
import auth from "./auth";
import users from "./users";
import reimbursement from "./reimbursement";


const routes = Router();
routes.use("/auth", auth);
routes.use("/", users);
routes.use("/", reimbursement);

export default routes;