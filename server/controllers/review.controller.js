import ReviewModel from "../models/review.model.js";
import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";

export async function addReviewController(request, response) {
    try {
        const userId = request.userId;
        const { productId, rating, comment, orderId } = request.body;

        if (!productId || !rating || !comment) {
            return response.status(400).json({
                message: "Provide productId, rating, and comment",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check if user has already reviewed for this order
        if (orderId) {
            const existingReview = await ReviewModel.findOne({ userId, orderId });
            if (existingReview) {
                return response.status(400).json({
                    message: "You have already submitted a review for this order",
                    error: true,
                    success: false
                });
            }
        }

        const newReview = new ReviewModel({
            productId,
            userId,
            userName: user.name || 'Verified Buyer',
            userAvatar: user.avatar || '',
            orderId: orderId || '',
            rating: Number(rating),
            comment: comment.trim()
        });

        await newReview.save();

        return response.json({
            message: "Thank you for your review!",
            data: newReview,
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
}

export async function getProductReviewsController(request, response) {
    try {
        const productId = request.params.productId || request.body.productId;

        if (!productId) {
            return response.status(400).json({
                message: "Provide productId",
                error: true,
                success: false
            });
        }

        const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 });
        
        let totalRating = 0;
        reviews.forEach(r => {
            totalRating += r.rating;
        });

        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0.0";

        return response.json({
            message: "Product reviews fetched successfully",
            data: {
                reviews,
                averageRating: Number(averageRating),
                totalReviews: reviews.length
            },
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
}

export async function getOrderReviewController(request, response) {
    try {
        const userId = request.userId;
        const { orderId } = request.params;

        if (!orderId) {
            return response.status(400).json({
                message: "Provide orderId",
                error: true,
                success: false
            });
        }

        const review = await ReviewModel.findOne({ userId, orderId });

        return response.json({
            message: "Order review status fetched",
            data: review,
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
}
