import ProductModel from "../models/product.model.js";

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            sizes,
            colors,
            tags
        } = request.body 

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            sizes: sizes || [],
            colors: colors || [],
            tags: tags || []
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
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

export const getProductController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
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

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        if (!productId) {
            return response.status(400).json({
                message : "Provide productId",
                error : true,
                success : false
            })
        }

        // Use lean() to get raw data so old string-format sizes aren't silently dropped by Mongoose schema coercion
        const product = await ProductModel.findById(productId)
            .populate('category subCategory')
            .lean()

        if (!product) {
            return response.status(404).json({
                message : "Product not found",
                error : true,
                success : false
            })
        }

        // Normalize sizes: if any entry is a plain string (old format), convert it to {size, stock:1}
        if (Array.isArray(product.sizes) && product.sizes.length > 0) {
            product.sizes = product.sizes.map(s =>
                typeof s === 'string' ? { size: s, stock: 1 } : s
            )
        }

        return response.json({
            message : "product details",
            data : product,
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

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
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

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, tag, page, limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit = 24
        }

        const skip = ( page - 1) * limit
        let data = []
        let dataCount = 0

        let filterQuery = {}

        if (tag) {
            filterQuery.tags = tag
        }

        if (search && search.trim() !== '') {
            const cleanSearch = search.trim()
            try {
                const query = { ...filterQuery, $text: { $search: cleanSearch } };
                [data, dataCount] = await Promise.all([
                    ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
                    ProductModel.countDocuments(query)
                ])
            } catch (textErr) {
                // Fallback to regex search if $text index is missing in Atlas
                const regexQuery = {
                    ...filterQuery,
                    $or: [
                        { name: { $regex: cleanSearch, $options: "i" } },
                        { description: { $regex: cleanSearch, $options: "i" } }
                    ]
                };
                [data, dataCount] = await Promise.all([
                    ProductModel.find(regexQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
                    ProductModel.countDocuments(regexQuery)
                ])
            }
        } else {
            [data, dataCount] = await Promise.all([
                ProductModel.find(filterQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
                ProductModel.countDocuments(filterQuery)
            ])
        }

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Seed 100 100% Unique Branded Products (Complete Clean Slate Wipe & Seed)
export const seedProductsController = async (request, response) => {
    try {
        const CategoryModel = (await import('../models/category.model.js')).default;
        const SubCategoryModel = (await import('../models/subCategory.model.js')).default;
        const ProductModel = (await import('../models/product.model.js')).default;
        const OrderModel = (await import('../models/order.model.js')).default;
        const CartProductModel = (await import('../models/cartproduct.model.js')).default;
        const { SEED_PRODUCTS_100 } = await import('../data/seedData100.js');

        // STEP 1: CLEAN SLATE WIPE (Products, Categories, Subcategories, Orders, Cart)
        await ProductModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await SubCategoryModel.deleteMany({});
        await OrderModel.deleteMany({});
        await CartProductModel.deleteMany({});

        // STEP 2: BUILD CATEGORIES AND SUBCATEGORIES MAP
        const categoryMap = {};
        const subCategoryMap = {};

        for (const item of SEED_PRODUCTS_100) {
            if (!categoryMap[item.category]) {
                const catDoc = await CategoryModel.create({
                    name: item.category,
                    image: item.images[0]
                });
                categoryMap[item.category] = catDoc._id;
            }

            const subCatKey = `${item.category}_${item.subCategory}`;
            if (!subCategoryMap[subCatKey]) {
                const subCatDoc = await SubCategoryModel.create({
                    name: item.subCategory,
                    image: item.images[0],
                    category: [categoryMap[item.category]]
                });
                subCategoryMap[subCatKey] = subCatDoc._id;
            }
        }

        // STEP 3: PREPARE AND INSERT 100 UNIQUE PRODUCTS
        const productsToInsert = SEED_PRODUCTS_100.map(item => ({
            name: item.name,
            image: item.images,
            category: [categoryMap[item.category]],
            subCategory: [subCategoryMap[`${item.category}_${item.subCategory}`]],
            unit: item.unit,
            stock: item.stock,
            price: item.price,
            discount: item.discount,
            description: item.description,
            more_details: {
                Brand: item.brand,
                Fabric: item.fabric,
                Fit: item.fit,
                Care: 'Machine Wash Cold',
                Origin: 'Made in India'
            },
            publish: true,
            sizes: item.sizes,
            colors: item.colors,
            tags: item.tags
        }));

        await ProductModel.insertMany(productsToInsert);

        return response.json({
            message: `Successfully wiped database (products, categories, subcategories, orders, cart) and seeded ${productsToInsert.length} 100% unique, non-repeating branded products!`,
            success: true,
            error: false,
            totalProductsSeeded: productsToInsert.length
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateAllProductSizesController = async (request, response) => {
    try {
        const products = await ProductModel.find({}).populate('category subCategory').lean();
        let updatedCount = 0;
        let skippedCount = 0;

        const randStock = () => Math.floor(Math.random() * 46) + 5;
        const fromStrings = (arr) => arr.map(s => ({ size: s, stock: randStock() }));
        const toSizeStock = (arr) => arr.map(s => ({ size: s, stock: randStock() }));

        const isStringArray = (arr) =>
            Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string';

        const isStockArray = (arr) =>
            Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && arr[0].size !== undefined;

        const isFootwear = (cat, sub, name) =>
            cat.includes('shoe') || cat.includes('footwear') || cat.includes('sneaker') ||
            sub.includes('shoe') || sub.includes('footwear') || sub.includes('sneaker') ||
            name.includes('shoe') || name.includes('sneaker') || name.includes('boot') ||
            name.includes('heel') || name.includes('sandal') || name.includes('slide') || name.includes('loafer');

        const isApparel = (cat, sub, name) =>
            cat.includes('men') || cat.includes('women') || cat.includes('dress') ||
            cat.includes('top') || cat.includes('shirt') || cat.includes('wear') ||
            cat.includes('fashion') || cat.includes('kid') || cat.includes('cloth') ||
            sub.includes('top') || sub.includes('dress') || sub.includes('pant') ||
            sub.includes('jean') || sub.includes('shirt') || sub.includes('jacket') || sub.includes('tshirt') ||
            name.includes('dress') || name.includes('shirt') || name.includes('t-shirt') ||
            name.includes('top') || name.includes('jean') || name.includes('pant') ||
            name.includes('jacket') || name.includes('hoodie') || name.includes('kurti') ||
            name.includes('saree') || name.includes('suit') || name.includes('frock') || name.includes('skirt') ||
            name.includes('kurta') || name.includes('legging') || name.includes('trouser') || name.includes('blouse');

        for (const prod of products) {
            const cat  = (prod.category?.[0]?.name    || '').toLowerCase();
            const sub  = (prod.subCategory?.[0]?.name || '').toLowerCase();
            const name = (prod.name || '').toLowerCase();
            const existingSizes = prod.sizes || [];

            let newSizes = null;

            if (isStringArray(existingSizes)) {
                newSizes = fromStrings(existingSizes);
            } else if (isStockArray(existingSizes)) {
                const hasZeroStock = existingSizes.some(x => x.stock === 0);
                if (hasZeroStock) {
                    newSizes = existingSizes.map(x => ({ ...x, stock: x.stock === 0 ? randStock() : x.stock }));
                } else {
                    skippedCount++;
                    continue;
                }
            } else {
                if (isFootwear(cat, sub, name)) {
                    newSizes = toSizeStock(['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']);
                } else if (isApparel(cat, sub, name)) {
                    newSizes = toSizeStock(['S', 'M', 'L', 'XL', 'XXL']);
                } else {
                    skippedCount++;
                    continue;
                }
            }

            if (newSizes) {
                await ProductModel.updateOne({ _id: prod._id }, { $set: { sizes: newSizes } });
                updatedCount++;
            }
        }

        return response.json({
            message: `Migration complete! Updated ${updatedCount} products, skipped ${skippedCount} (already correct or no size needed).`,
            success: true,
            error: false,
            updatedCount,
            skippedCount
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Bulk Delete Products
export const bulkDeleteProductsController = async (request, response) => {
    try {
        const { ids } = request.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.status(400).json({
                message: "Provide array of product IDs to delete",
                error: true,
                success: false
            });
        }

        const deleteResult = await ProductModel.deleteMany({ _id: { $in: ids } });

        return response.json({
            message: `Successfully deleted ${deleteResult.deletedCount} products`,
            deletedCount: deleteResult.deletedCount,
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

// Bulk Update Publish Status
export const bulkPublishProductsController = async (request, response) => {
    try {
        const { ids, publish } = request.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.status(400).json({
                message: "Provide array of product IDs to update",
                error: true,
                success: false
            });
        }

        const updateResult = await ProductModel.updateMany(
            { _id: { $in: ids } },
            { $set: { publish: Boolean(publish) } }
        );

        return response.json({
            message: `Successfully updated ${updateResult.modifiedCount} products`,
            modifiedCount: updateResult.modifiedCount,
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