import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    addCouponController,
    getAllCouponsController,
    updateCouponController,
    deleteCouponController,
    verifyCouponController,
    getBannerCouponController
} from "../controllers/coupon.controller.js";

const couponRouter = Router();

couponRouter.post("/add", auth, addCouponController);
couponRouter.get("/all", auth, getAllCouponsController);
couponRouter.put("/update", auth, updateCouponController);
couponRouter.delete("/delete", auth, deleteCouponController);
couponRouter.post("/verify", auth, verifyCouponController);
couponRouter.get("/banner", getBannerCouponController);

export default couponRouter;
