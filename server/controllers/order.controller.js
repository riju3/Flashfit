import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import CouponModel from "../models/coupon.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

// Decrement overall stock AND per-size stock after an order
const decrementStock = async (productId, size, qty = 1) => {
    try {
        const updateOps = {
            $inc: { stock: -qty }
        };
        await ProductModel.findByIdAndUpdate(productId, updateOps);

        // If a size was selected, also decrement that size's stock
        if (size) {
            await ProductModel.findOneAndUpdate(
                { _id: productId, 'sizes.size': size },
                { $inc: { 'sizes.$.stock': -qty } }
            );
        }
    } catch (e) {
        console.error('Stock decrement error:', e.message);
    }
};

// Restore stock on order cancellation
const restoreStock = async (productId, size, qty = 1) => {
    try {
        await ProductModel.findByIdAndUpdate(productId, { $inc: { stock: qty } });
        if (size) {
            await ProductModel.findOneAndUpdate(
                { _id: productId, 'sizes.size': size },
                { $inc: { 'sizes.$.stock': qty } }
            );
        }
    } catch (e) {
        console.error('Stock restore error:', e.message);
    }
};


 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt, couponCode } = request.body 

        // Filter out null or missing products
        const validItems = (list_items || []).filter(el => el?.productId && (el?.productId?._id || el?.productId));

        if (!validItems || validItems.length === 0) {
            return response.status(400).json({
                message: "No valid products found in your cart.",
                error: true,
                success: false
            });
        }

        const payload = validItems.map(el => {
            const pId = el.productId._id || el.productId;
            const pName = el.productId.name || "Product";
            const pImage = el.productId.image || [];
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : pId, 
                product_details : {
                    name : pName,
                    image : pImage,
                    size : el.size || ""
                } ,
                couponCode : couponCode ? String(couponCode).toUpperCase().trim() : "",
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        // Decrement stock for each ordered item
        for (const el of validItems) {
            const pId = el.productId._id || el.productId;
            await decrementStock(
                pId,
                el.size || "",
                el.quantity || 1
            );
        }

        // Increment coupon usage count and record user ID
        if (couponCode) {
            await CouponModel.findOneAndUpdate(
                { code: String(couponCode).toUpperCase().trim() },
                { 
                    $inc: { usesCount: 1 },
                    $addToSet: { usedByUsers: userId }
                }
            );
        }

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const validItems = (list_items || []).filter(el => el?.productId && (el?.productId?._id || el?.productId));

        if (!validItems || validItems.length === 0) {
            return response.status(400).json({
                message: "No valid products found in your cart.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId)

        const line_items  = validItems.map(item =>{
            const pName = item.productId.name || "Product";
            const pImage = item.productId.image || [];
            const pId = item.productId._id || item.productId;
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : pName,
                        images : Array.isArray(pImage) ? pImage : [pImage],
                        metadata : {
                            productId : pId
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price || 0, item.productId.discount || 0) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity || 1
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        // Decrement stock for each Stripe ordered item
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)
            const productId = product.metadata.productId
            const qty = item.quantity || 1
            await decrementStock(productId, '', qty);
        }

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function cancelOrderController(request, response) {
    try {
        const userId = request.userId;
        const { orderId, cancel_reason } = request.body;

        if (!orderId) {
            return response.status(400).json({
                message: "Provide orderId",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order.order_status === "DELIVERED") {
            return response.status(400).json({
                message: "Delivered orders cannot be cancelled",
                error: true,
                success: false
            });
        }

        order.order_status = "CANCELLED";
        order.cancel_reason = cancel_reason || "User requested cancellation";
        await order.save();

        // Restore stock on cancellation
        await restoreStock(
            order.productId,
            order.product_details?.size || "",
            1
        );

        return response.json({
            message: "Order cancelled successfully",
            error: false,
            success: true,
            data: order
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getAllOrdersAdminController(request, response) {
    try {
        const adminUser = await UserModel.findById(request.userId);
        if (adminUser.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Access denied. Admin only.",
                error: true,
                success: false
            });
        }

        const allOrders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email mobile')
            .populate('delivery_address');

        return response.json({
            message: "All orders fetched successfully",
            data: allOrders,
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

export async function returnOrderController(request, response) {
    try {
        const userId = request.userId;
        const { orderId, return_type, return_reason, return_comment, replace_size } = request.body;

        if (!orderId || !return_type || !return_reason) {
            return response.status(400).json({
                message: "Provide orderId, return_type, and return_reason",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order.order_status !== "DELIVERED") {
            return response.status(400).json({
                message: "Return or replacement is only available for delivered orders",
                error: true,
                success: false
            });
        }

        // Verify 7-day return window
        const deliveryTime = order.deliveredAt ? new Date(order.deliveredAt).getTime() : new Date(order.updatedAt || order.createdAt).getTime();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if ((Date.now() - deliveryTime) > sevenDaysMs) {
            return response.status(400).json({
                message: "7-day return/replacement window has expired for this order",
                error: true,
                success: false
            });
        }

        order.return_status = return_type === "REPLACE" ? "REPLACE_REQUESTED" : "RETURN_REQUESTED";
        order.return_type = return_type;
        order.return_reason = return_reason;
        if (return_comment !== undefined) order.return_comment = return_comment;
        if (return_type === "REPLACE") {
            order.replace_size = replace_size || "";
        }

        await order.save();

        return response.json({
            message: `${return_type === "REPLACE" ? "Replacement" : "Return"} request submitted successfully!`,
            error: false,
            success: true,
            data: order
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateOrderStatusAdminController(request, response) {
    try {
        const adminUser = await UserModel.findById(request.userId);
        if (adminUser.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Access denied. Admin only.",
                error: true,
                success: false
            });
        }

        const { orderId, order_status, return_status, cancel_reason, return_reason, return_comment } = request.body;

        const order = await OrderModel.findById(orderId);
        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order_status) {
            order.order_status = order_status;
            if (order_status === "DELIVERED" && !order.deliveredAt) {
                order.deliveredAt = new Date();
            }
        }
        if (return_status !== undefined) order.return_status = return_status;
        if (cancel_reason !== undefined) order.cancel_reason = cancel_reason;
        if (return_reason !== undefined) order.return_reason = return_reason;
        if (return_comment !== undefined) order.return_comment = return_comment;

        await order.save();

        return response.json({
            message: "Order status updated successfully",
            error: false,
            success: true,
            data: order
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
