import { Router } from "express";
import controllerUsers from "../controllers/controllerUsers";
import { checkJwt } from "../services/chkJWT";
import { checkRole } from "../services/chkRole";

  const router = Router();

  //Get all users
  router.get("/users", [checkJwt, checkRole(["Admin","Manager"])], controllerUsers.listAll);

  //Get one user
  router.get("/users/:id([0-9]+)", [checkJwt, checkRole(["Admin","Manager","Employee"])], controllerUsers.getOneById);

  //Create a new user
  router.post("/users/newuser", [checkJwt, checkRole(["Admin"])], controllerUsers.newUser);

  //Edit one user
  router.patch("/users", [checkJwt, checkRole(["Admin"])], controllerUsers.editUser);

  export default router;