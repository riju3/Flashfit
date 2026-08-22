import { Router } from "express";
import { virtualTryOnController } from "../controllers/tryon.controller.js";

const tryonRouter = Router();

tryonRouter.post("/process", virtualTryOnController);

export default tryonRouter;
