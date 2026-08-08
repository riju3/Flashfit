import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe, cancelOrderController, getAllOrdersAdminController, updateOrderStatusAdminController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.post("/cancel-order",auth,cancelOrderController)
orderRouter.get("/admin-all-orders",auth,getAllOrdersAdminController)
orderRouter.put("/admin-update-order-status",auth,updateOrderStatusAdminController)

export default orderRouter