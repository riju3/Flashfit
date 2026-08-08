import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    eyebrow: {
        type: String,
        default: "EXCLUSIVE DISCOUNT OFFER"
    },
    title: {
        type: String,
        required: [true, "Provide banner title"]
    },
    subtitle: {
        type: String,
        default: ""
    },
    couponCode: {
        type: String,
        default: ""
    },
    ctaText: {
        type: String,
        default: ""
    },
    ctaLink: {
        type: String,
        default: "/search"
    },
    gradientTheme: {
        type: String,
        default: "orange",
        enum: ["orange", "darkRed", "midnight", "purple", "emerald", "gold"]
    },
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    },
    orderIndex: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const BannerModel = mongoose.model("banner", bannerSchema);
export default BannerModel;
