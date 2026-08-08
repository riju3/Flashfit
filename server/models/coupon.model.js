import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Provide coupon code"],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        default: 10
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    maxUses: {
        type: Number,
        default: 100
    },
    usesCount: {
        type: Number,
        default: 0
    },
    usedByUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {
        type: String,
        default: "10% OFF on your purchase!"
    },
    isBannerCoupon: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    }
}, {
    timestamps: true
});

const CouponModel = mongoose.model("coupon", couponSchema);
export default CouponModel;
