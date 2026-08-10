import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
        unique : true
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : "product"
    },
    product_details : {
        name : String,
        image : Array,
        size : {
            type : String,
            default : ""
        }
    },
    couponCode : {
        type : String,
        default : ""
    },
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    delivery_address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },
    invoice_receipt : {
        type : String,
        default : ""
    },
    order_status : {
        type : String,
        default : "CONFIRMED"
    },
    cancel_reason : {
        type : String,
        default : ""
    },
    return_status : {
        type : String,
        default : ""
    },
    return_type : {
        type : String,
        default : ""
    },
    return_reason : {
        type : String,
        default : ""
    },
    replace_size : {
        type : String,
        default : ""
    },
    deliveredAt : {
        type : Date,
        default : null
    }
},{
    timestamps : true
})

const OrderModel = mongoose.model('order',orderSchema)

export default OrderModel