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

        const product = await ProductModel.findById(productId).populate('category subCategory')

        if (!product) {
            return response.status(404).json({
                message : "Product not found",
                error : true,
                success : false
            })
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
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        const skip = ( page - 1) * limit
        let data = []
        let dataCount = 0

        if (search) {
            try {
                const query = { $text: { $search: search } };
                [data, dataCount] = await Promise.all([
                    ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
                    ProductModel.countDocuments(query)
                ])
            } catch (textErr) {
                // Fallback to regex search if $text index is missing in Atlas
                const regexQuery = {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                };
                [data, dataCount] = await Promise.all([
                    ProductModel.find(regexQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
                    ProductModel.countDocuments(regexQuery)
                ])
            }
        } else {
            [data, dataCount] = await Promise.all([
                ProductModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
                ProductModel.countDocuments({})
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

// Seed 50+ Branded Products with photos, sizes, prices, brands
export const seedProductsController = async (request, response) => {
    try {
        const CategoryModel = (await import('../models/category.model.js')).default;
        const SubCategoryModel = (await import('../models/subCategory.model.js')).default;

        const FASHION_IMAGES = {
            men_shirt: [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?auto=format&fit=crop&w=800&q=80'
            ],
            men_tshirt: [
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
            ],
            men_jeans: [
                'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
            ],
            men_jacket: [
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
            ],
            women_dress: [
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
            ],
            women_top: [
                'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80'
            ],
            women_ethnic: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
            ],
            footwear: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
            ],
            accessories: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
            ]
        };

        const BRANDS = [
            'U.S. Polo Assn.', 'Tommy Hilfiger', 'Woodland', 'Snitch', 'Roadster',
            'H&M', "Levi's", 'Nike', 'Adidas', 'Puma', 'Reebok', 'Peter England',
            'Van Heusen', 'Arrow', 'Louis Philippe', 'Raymond', 'Allen Solly',
            'Jack & Jones', 'Vero Moda', 'Only', 'Benetton', 'Superdry', 'Wrangler',
            'Zara', 'HRX'
        ];

        const CATEGORIES_SPEC = [
            {
                name: "Men's Wear",
                image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
                subCategories: [
                    { name: 'Shirts', imgKey: 'men_shirt', priceRange: [899, 3499] },
                    { name: 'T-Shirts', imgKey: 'men_tshirt', priceRange: [499, 1999] },
                    { name: 'Jeans & Trousers', imgKey: 'men_jeans', priceRange: [1299, 4599] },
                    { name: 'Jackets & Blazers', imgKey: 'men_jacket', priceRange: [2499, 8999] }
                ]
            },
            {
                name: "Women's Wear",
                image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
                subCategories: [
                    { name: 'Dresses & Jumpsuits', imgKey: 'women_dress', priceRange: [1199, 4999] },
                    { name: 'Tops & Tees', imgKey: 'women_top', priceRange: [599, 2299] },
                    { name: 'Kurtas & Ethnic Sets', imgKey: 'women_ethnic', priceRange: [1499, 6999] }
                ]
            },
            {
                name: "Footwear & Shoes",
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
                subCategories: [
                    { name: 'Sneakers & Casual Shoes', imgKey: 'footwear', priceRange: [1999, 9999] },
                    { name: 'Formal & Boots', imgKey: 'footwear', priceRange: [2499, 7999] }
                ]
            },
            {
                name: "Accessories & Watches",
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
                subCategories: [
                    { name: 'Watches & Wearables', imgKey: 'accessories', priceRange: [1999, 14999] },
                    { name: 'Sunglasses & Bags', imgKey: 'accessories', priceRange: [899, 4999] }
                ]
            }
        ];

        const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const COLORS_LIST = ['#111111', '#FFFFFF', '#EF4444', '#1E3A5F', '#6B7C2F', '#D4B896', '#F472B6'];
        const TAGS_LIST = ['new-arrival', 'trending', 'sale', 'best-seller'];
        const FABRICS = ['Pure Cotton', 'Denim', 'Polyester Blend', 'Linen', 'Silk Blend', 'Viscose Rayon', 'Fleece'];
        const FITS = ['Slim Fit', 'Regular Fit', 'Oversized Fit', 'Relaxed Fit'];

        const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];
        const getRandomElements = (arr, count) => [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
        const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Clear existing products to prevent duplicates
        await ProductModel.deleteMany({});
        
        let subCategoryList = [];

        for (const catSpec of CATEGORIES_SPEC) {
            let catDoc = await CategoryModel.findOne({ name: catSpec.name });
            if (!catDoc) {
                catDoc = await CategoryModel.create({ name: catSpec.name, image: catSpec.image });
            }
            for (const subCatSpec of catSpec.subCategories) {
                let subCatDoc = await SubCategoryModel.findOne({ name: subCatSpec.name });
                if (!subCatDoc) {
                    subCatDoc = await SubCategoryModel.create({
                        name: subCatSpec.name,
                        image: catSpec.image,
                        category: [catDoc._id]
                    });
                }
                subCategoryList.push({
                    id: subCatDoc._id,
                    name: subCatDoc.name,
                    catId: catDoc._id,
                    imgKey: subCatSpec.imgKey,
                    priceRange: subCatSpec.priceRange
                });
            }
        }

        const productsToInsert = [];
        const TARGET_COUNT = 52;

        for (let i = 0; i < TARGET_COUNT; i++) {
            const subCatInfo = subCategoryList[i % subCategoryList.length];
            const brand = getRandomElement(BRANDS);
            const price = getRandomInt(subCatInfo.priceRange[0], subCatInfo.priceRange[1]);
            const discount = getRandomElement([10, 15, 20, 25, 30, 40, 50]);
            const stock = getRandomInt(15, 120);

            const isFootwearOrAccessory = subCatInfo.name.includes('Shoe') || subCatInfo.name.includes('Watch') || subCatInfo.name.includes('Bag') || subCatInfo.name.includes('Formal');
            const sizes = isFootwearOrAccessory ? [] : getRandomElements(SIZES_CLOTHING, getRandomInt(3, 5));
            const colors = getRandomElements(COLORS_LIST, getRandomInt(2, 4));
            const tag = Math.random() > 0.3 ? getRandomElement(TAGS_LIST) : '';
            const tags = tag ? [tag] : [];
            const images = getRandomElements(FASHION_IMAGES[subCatInfo.imgKey] || FASHION_IMAGES.men_shirt, getRandomInt(1, 2));
            const fabric = getRandomElement(FABRICS);
            const fit = getRandomElement(FITS);

            const name = `${brand} ${fit} ${subCatInfo.name.replace('&', 'and')} - Style #${1000 + i}`;
            const description = `Elevate your fashion with this premium ${name} from ${brand}. Crafted from high-grade ${fabric} for maximum comfort and modern style appeal.`;

            productsToInsert.push({
                name,
                image: images,
                category: [subCatInfo.catId],
                subCategory: [subCatInfo.id],
                unit: isFootwearOrAccessory ? '1 Pair / Unit' : '1 Piece',
                stock,
                price,
                discount,
                description,
                more_details: {
                    Brand: brand,
                    Fabric: fabric,
                    Fit: fit,
                    Care: 'Machine Wash Cold',
                    Origin: 'Made in India',
                },
                publish: true,
                sizes,
                colors,
                tags,
            });
        }

        await ProductModel.insertMany(productsToInsert);

        return response.json({
            message: `Successfully seeded ${productsToInsert.length} products with brands, photos, sizes & prices!`,
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