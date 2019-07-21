import { Router } from "express";
import controllerReimbursement from "../controllers/controllerReimbursement";
import { checkJwt } from "../services/chkJWT";
import { checkRole } from "../services/chkRole";

  const router = Router();

  //Get reimbursements by status
  router.get("/reimbursements/status/:statusid([0-9]+)", [checkJwt, checkRole(["Manager"])], controllerReimbursement.byStatus);

  //Get reimbursements by user
  router.get("/reimbursements/author/:id([0-9]+)", [checkJwt, checkRole(["Manager", "Employee"])], controllerReimbursement.getOneById);

  //Submit reimbursement
  router.post("/reimbursements", [checkJwt, checkRole(["Manager"])], controllerReimbursement.submitReimbursement);

  //Edit reimbursement
  router.patch("/reimbursements", [checkJwt, checkRole(["Manager"])], controllerReimbursement.editReimbursement);

  export default router;