import CouponModel from "../models/coupon.model.js";
import OrderModel from "../models/order.model.js";

// Seed default FIRST10 coupon if db is empty
const seedDefaultCoupon = async () => {
    const count = await CouponModel.countDocuments();
    if (count === 0) {
        await CouponModel.create({
            code: "FIRST10",
            discountPercentage: 10,
            minOrderValue: 0,
            maxUses: 1000,
            usesCount: 0,
            description: "10% OFF on your first purchase!",
            isBannerCoupon: true,
            status: "Active"
        });
    }
};

// Add Coupon (Admin)
export const addCouponController = async (request, response) => {
    try {
        const { code, discountPercentage, minOrderValue, maxUses, description, isBannerCoupon } = request.body;

        if (!code || !discountPercentage) {
            return response.status(400).json({
                message: "Coupon code and discount percentage are required",
                error: true,
                success: false
            });
        }

        const formattedCode = code.toUpperCase().trim();
        const existing = await CouponModel.findOne({ code: formattedCode });
        if (existing) {
            return response.status(400).json({
                message: "Coupon code already exists",
                error: true,
                success: false
            });
        }

        if (isBannerCoupon) {
            await CouponModel.updateMany({}, { isBannerCoupon: false });
        }

        const newCoupon = new CouponModel({
            code: formattedCode,
            discountPercentage: Number(discountPercentage),
            minOrderValue: Number(minOrderValue) || 0,
            maxUses: Number(maxUses) || 100,
            description: description || `${discountPercentage}% OFF on your order!`,
            isBannerCoupon: Boolean(isBannerCoupon),
            status: "Active"
        });

        await newCoupon.save();

        return response.json({
            message: "Coupon created successfully",
            error: false,
            success: true,
            data: newCoupon
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get All Coupons (Admin)
export const getAllCouponsController = async (request, response) => {
    try {
        await seedDefaultCoupon();
        const coupons = await CouponModel.find().sort({ createdAt: -1 });
        return response.json({
            message: "Coupons fetched successfully",
            error: false,
            success: true,
            data: coupons
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Update Coupon (Admin)
export const updateCouponController = async (request, response) => {
    try {
        const { _id, code, discountPercentage, minOrderValue, maxUses, description, isBannerCoupon, status } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Coupon ID is required",
                error: true,
                success: false
            });
        }

        if (isBannerCoupon) {
            await CouponModel.updateMany({ _id: { $ne: _id } }, { isBannerCoupon: false });
        }

        const updateData = {};
        if (code) updateData.code = code.toUpperCase().trim();
        if (discountPercentage !== undefined) updateData.discountPercentage = Number(discountPercentage);
        if (minOrderValue !== undefined) updateData.minOrderValue = Number(minOrderValue);
        if (maxUses !== undefined) updateData.maxUses = Number(maxUses);
        if (description !== undefined) updateData.description = description;
        if (isBannerCoupon !== undefined) updateData.isBannerCoupon = Boolean(isBannerCoupon);
        if (status !== undefined) updateData.status = status;

        const updated = await CouponModel.findByIdAndUpdate(_id, updateData, { new: true });

        return response.json({
            message: "Coupon updated successfully",
            error: false,
            success: true,
            data: updated
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Delete Coupon (Admin)
export const deleteCouponController = async (request, response) => {
    try {
        const { _id } = request.body;
        await CouponModel.findByIdAndDelete(_id);
        return response.json({
            message: "Coupon deleted successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Verify & Apply Coupon (User)
export const verifyCouponController = async (request, response) => {
    try {
        const { code, orderAmount } = request.body;

        if (!code) {
            return response.status(400).json({
                message: "Please enter a coupon code",
                error: true,
                success: false
            });
        }

        await seedDefaultCoupon();

        const formattedCode = code.toUpperCase().trim();
        const coupon = await CouponModel.findOne({ code: formattedCode });

        if (!coupon) {
            return response.status(404).json({
                message: "Invalid coupon code",
                error: true,
                success: false
            });
        }

        if (coupon.status !== "Active") {
            return response.status(400).json({
                message: "This coupon code is inactive",
                error: true,
                success: false
            });
        }

        // One-time use per customer check
        if (request.userId) {
            const userAlreadyUsed = (coupon.usedByUsers && coupon.usedByUsers.some(id => String(id) === String(request.userId))) ||
                await OrderModel.exists({ userId: request.userId, couponCode: formattedCode });

            if (userAlreadyUsed) {
                return response.status(400).json({
                    message: `You have already used coupon code ${coupon.code}. Coupons can only be redeemed once per customer.`,
                    error: true,
                    success: false
                });
            }
        }

        // Check if expired / max uses reached
        if (coupon.usesCount >= coupon.maxUses) {
            return response.status(400).json({
                message: "Coupon code has expired or reached maximum usage limit",
                error: true,
                success: false
            });
        }

        const currentAmount = Number(orderAmount) || 0;
        if (currentAmount < coupon.minOrderValue) {
            return response.status(400).json({
                message: `Minimum order value of ₹${coupon.minOrderValue} required for coupon ${coupon.code}`,
                error: true,
                success: false
            });
        }

        const discountAmount = Math.round((currentAmount * coupon.discountPercentage) / 100);

        return response.json({
            message: `Coupon ${coupon.code} applied! Saved ₹${discountAmount}`,
            error: false,
            success: true,
            data: {
                code: coupon.code,
                discountPercentage: coupon.discountPercentage,
                discountAmount,
                description: coupon.description
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get Banner Coupon (Public for Home Page)
export const getBannerCouponController = async (request, response) => {
    try {
        await seedDefaultCoupon();
        let coupon = await CouponModel.findOne({ isBannerCoupon: true, status: "Active" });
        if (!coupon) {
            coupon = await CouponModel.findOne({ status: "Active" }).sort({ createdAt: -1 });
        }
        return response.json({
            message: "Banner coupon fetched",
            error: false,
            success: true,
            data: coupon
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
