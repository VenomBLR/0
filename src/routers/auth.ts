import { Router } from "express";
import controllerAuth from "../controllers/controllerAuth";
import { checkJwt } from "../services/chkJWT";
import { checkRole } from "../services/chkRole";

const router = Router();
//Login route
router.post("/login", controllerAuth.login);

//Change password
router.post("/change-password", [checkJwt, checkRole(["Admin","Manager","Employee"])], controllerAuth.changePassword);

export default router;