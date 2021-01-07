import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import art from './art.routes'

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/arts", art);

export default routes;