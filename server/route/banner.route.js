import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    addBannerController,
    getAllBannersController,
    updateBannerController,
    deleteBannerController
} from "../controllers/banner.controller.js";

const bannerRouter = Router();

bannerRouter.post("/add", auth, addBannerController);
bannerRouter.get("/all", getAllBannersController);
bannerRouter.put("/update", auth, updateBannerController);
bannerRouter.delete("/delete", auth, deleteBannerController);

export default bannerRouter;
