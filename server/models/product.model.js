import mongoose from "mongoose";

const sizeStockSchema = new mongoose.Schema({
    size  : { type: String, required: true },
    stock : { type: Number, default: 0 }
}, { _id: false })

const productSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    brand : {
        type : String,
        default : ""
    },
    color : {
        type : String,
        default : ""
    },
    image : {
        type : Array,
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category'
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory'
        }
    ],
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
        default : null
    },
    discount : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true
    },
    // Fashion-specific fields (all optional)
    sizes : {
        type : [sizeStockSchema],
        default : []
    },
    colors : {
        type : [String],
        default : []
    },
    keywords : {
        type : [String],
        default : []
    },
    tags : {
        type : [String],
        default : [],
        enum : { values : ['new-arrival','trending','sale','best-seller',''], message : '{VALUE} is not a valid tag' }
    }
},{
    timestamps : true
})

//create a text index
productSchema.index({
    name  : "text",
    description : 'text'
},{
    name : 10,
    description : 5
})


const ProductModel = mongoose.model('product',productSchema)

export default ProductModel