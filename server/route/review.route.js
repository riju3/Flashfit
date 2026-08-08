import { Router } from 'express';
import auth from '../middleware/auth.js';
import { addReviewController, getProductReviewsController, getOrderReviewController } from '../controllers/review.controller.js';

const reviewRouter = Router();

reviewRouter.post('/add', auth, addReviewController);
reviewRouter.get('/product/:productId', getProductReviewsController);
reviewRouter.get('/order/:orderId', auth, getOrderReviewController);

export default reviewRouter;
