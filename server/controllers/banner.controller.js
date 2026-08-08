import BannerModel from "../models/banner.model.js";

// Seed 2 default banners if DB has 0 banners
const seedDefaultBanners = async () => {
    const count = await BannerModel.countDocuments();
    if (count === 0) {
        await BannerModel.create([
            {
                eyebrow: "⚡ EXCLUSIVE DISCOUNT OFFER",
                title: "10% OFF on your first purchase!",
                subtitle: "Use this special promotional code at checkout to claim your instant discount.",
                couponCode: "FIRST10",
                ctaText: "",
                ctaLink: "/checkout",
                gradientTheme: "orange",
                status: "Active",
                orderIndex: 0
            },
            {
                eyebrow: "UP TO 60% OFF",
                title: "End of Season Sale",
                subtitle: "Hundreds of styles at unbeatable prices.",
                couponCode: "",
                ctaText: "Shop Sale →",
                ctaLink: "/search?tag=sale",
                gradientTheme: "darkRed",
                status: "Active",
                orderIndex: 1
            }
        ]);
    }
};

// Add Banner (Admin - Text only)
export const addBannerController = async (request, response) => {
    try {
        const { eyebrow, title, subtitle, couponCode, ctaText, ctaLink, gradientTheme } = request.body;

        if (!title) {
            return response.status(400).json({
                message: "Banner title is required",
                error: true,
                success: false
            });
        }

        const newBanner = new BannerModel({
            eyebrow: eyebrow || "PROMOTIONAL OFFER",
            title: title.trim(),
            subtitle: subtitle || "",
            couponCode: couponCode ? couponCode.toUpperCase().trim() : "",
            ctaText: ctaText || "",
            ctaLink: ctaLink || "/search",
            gradientTheme: gradientTheme || "orange",
            status: "Active"
        });

        await newBanner.save();

        return response.json({
            message: "Promotional banner created successfully",
            error: false,
            success: true,
            data: newBanner
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Get All Banners (Public & Admin)
export const getAllBannersController = async (request, response) => {
    try {
        await seedDefaultBanners();
        const banners = await BannerModel.find().sort({ orderIndex: 1, createdAt: -1 });
        return response.json({
            message: "Banners fetched successfully",
            error: false,
            success: true,
            data: banners
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Update Banner (Admin)
export const updateBannerController = async (request, response) => {
    try {
        const { _id, eyebrow, title, subtitle, couponCode, ctaText, ctaLink, gradientTheme, status, orderIndex } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Banner ID is required",
                error: true,
                success: false
            });
        }

        const updateData = {};
        if (eyebrow !== undefined) updateData.eyebrow = eyebrow;
        if (title !== undefined) updateData.title = title.trim();
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (couponCode !== undefined) updateData.couponCode = couponCode.toUpperCase().trim();
        if (ctaText !== undefined) updateData.ctaText = ctaText;
        if (ctaLink !== undefined) updateData.ctaLink = ctaLink;
        if (gradientTheme !== undefined) updateData.gradientTheme = gradientTheme;
        if (status !== undefined) updateData.status = status;
        if (orderIndex !== undefined) updateData.orderIndex = Number(orderIndex);

        const updated = await BannerModel.findByIdAndUpdate(_id, updateData, { new: true });

        return response.json({
            message: "Banner updated successfully",
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

// Delete Banner (Admin)
export const deleteBannerController = async (request, response) => {
    try {
        const { _id } = request.body;
        await BannerModel.findByIdAndDelete(_id);
        return response.json({
            message: "Banner deleted successfully",
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
