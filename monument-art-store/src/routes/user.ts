import { Router } from "express";
import UserController from "../controller/UserController";
import checkJwt  from "../middlewars/checkJwt";
import checkRole from "../middlewars/checkRole";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN", "USER"])], UserController.index);

// Get one user
router.get("/:id", [checkJwt, checkRole(["ADMIN"])], UserController.show);

//Create a new user
router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.create);

//Edit one user
router.patch("/:id", [checkJwt, checkRole(["ADMIN"])], UserController.edit);

//Delete one user
router.delete("/:id", [checkJwt, checkRole(["ADMIN"])], UserController.delete);

export default router;