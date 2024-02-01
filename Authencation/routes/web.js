import express from "express";
import UserControllers from "../controllers/userControllers.js";
import isuserAuthencated from "../middleware/authMiddleware.js";
const routes = express.Router();

routes.post("/create", UserControllers.createData);
routes.post("/", UserControllers.getAllData);
routes.post("/login", UserControllers.loginUser);

//Protected Routes
routes.post('/change-password',isuserAuthencated,UserControllers.changePassword)

export default routes;
