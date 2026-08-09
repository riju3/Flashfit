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

// Seed 50+ 100% Unique Branded Products (Complete Clean Slate Wipe & Seed)
export const seedProductsController = async (request, response) => {
    try {
        const CategoryModel = (await import('../models/category.model.js')).default;
        const SubCategoryModel = (await import('../models/subCategory.model.js')).default;

        const RAW_PRODUCT_DATA = [
          // ─── MEN'S WEAR: SHIRTS ───
          {
            category: "Men's Wear",
            subCategory: "Shirts",
            brand: "U.S. Polo Assn.",
            name: "U.S. Polo Assn. Classic Oxford Cotton Shirt",
            price: 2499,
            discount: 25,
            unit: "1 Piece",
            stock: 45,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["#FFFFFF", "#1E3A5F", "#6B7C2F"],
            fabric: "100% Oxford Cotton",
            fit: "Regular Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Iconic U.S. Polo Assn. button-down Oxford shirt crafted from breathable premium cotton with subtle horse logo embroidery."
          },
          {
            category: "Men's Wear",
            subCategory: "Shirts",
            brand: "Tommy Hilfiger",
            name: "Tommy Hilfiger Slim Fit Gingham Check Shirt",
            price: 3899,
            discount: 20,
            unit: "1 Piece",
            stock: 30,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#1E3A5F", "#EF4444"],
            fabric: "Combed Cotton",
            fit: "Slim Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Sophisticated Tommy Hilfiger gingham plaid shirt featuring soft touch fabric and signature flag emblem on chest."
          },
          {
            category: "Men's Wear",
            subCategory: "Shirts",
            brand: "Snitch",
            name: "Snitch Cuban Collar Resort Linen Shirt",
            price: 1599,
            discount: 30,
            unit: "1 Piece",
            stock: 60,
            sizes: ["M", "L", "XL"],
            colors: ["#D4B896", "#FFFFFF"],
            fabric: "Pure Linen Blend",
            fit: "Relaxed Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Beach and vacation essential Cuban collar shirt by Snitch made from ultra-breezy linen fabric."
          },
          {
            category: "Men's Wear",
            subCategory: "Shirts",
            brand: "Peter England",
            name: "Peter England Elite Formal Dress Shirt",
            price: 1799,
            discount: 15,
            unit: "1 Piece",
            stock: 50,
            sizes: ["39", "40", "42", "44"],
            colors: ["#FFFFFF", "#9CA3AF"],
            fabric: "Wrinkle-Free Cotton",
            fit: "Tailored Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Crisp wrinkle-resistant formal shirt engineered for crisp executive wear throughout long office hours."
          },
          {
            category: "Men's Wear",
            subCategory: "Shirts",
            brand: "Arrow",
            name: "Arrow Autofressh French Cuff Formal Shirt",
            price: 2299,
            discount: 35,
            unit: "1 Piece",
            stock: 25,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#1E3A5F"],
            fabric: "100% Supima Cotton",
            fit: "Regular Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Premium French cuff formal dress shirt tailored from rare Supima cotton yarn."
          },

          // ─── MEN'S WEAR: T-SHIRTS ───
          {
            category: "Men's Wear",
            subCategory: "T-Shirts",
            brand: "Nike",
            name: "Nike Sportswear Club Fleece Crew Neck Tee",
            price: 1995,
            discount: 15,
            unit: "1 Piece",
            stock: 80,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["#111111", "#EF4444", "#9CA3AF"],
            fabric: "Heavyweight Jersey Cotton",
            fit: "Regular Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Essential streetwear Nike graphic t-shirt featuring iconic Futura swoosh branding."
          },
          {
            category: "Men's Wear",
            subCategory: "T-Shirts",
            brand: "Adidas",
            name: "Adidas Originals Trefoil Graphic Polo T-Shirt",
            price: 2499,
            discount: 20,
            unit: "1 Piece",
            stock: 55,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#FFFFFF", "#1E3A5F"],
            fabric: "Cotton Pique",
            fit: "Regular Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Classic sports style Adidas polo t-shirt with signature 3-stripes trim and trefoil embroidered patch."
          },
          {
            category: "Men's Wear",
            subCategory: "T-Shirts",
            brand: "Puma",
            name: "Puma Essentials Logo Slim T-Shirt",
            price: 999,
            discount: 40,
            unit: "1 Piece",
            stock: 100,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#111111", "#EF4444"],
            fabric: "100% Sustainable Cotton",
            fit: "Slim Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Super soft everyday activewear tee from Puma with rubberized cat logo graphic."
          },
          {
            category: "Men's Wear",
            subCategory: "T-Shirts",
            brand: "Roadster",
            name: "Roadster Acid Wash Oversized Heavyweight Tee",
            price: 799,
            discount: 50,
            unit: "1 Piece",
            stock: 90,
            sizes: ["M", "L", "XL", "XXL"],
            colors: ["#6B7C2F", "#9CA3AF"],
            fabric: "240 GSM Cotton",
            fit: "Oversized Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Trendy vintage acid wash oversized t-shirt crafted from heavy 240 GSM organic cotton fabric."
          },
          {
            category: "Men's Wear",
            subCategory: "T-Shirts",
            brand: "HRX by Hrithik Roshan",
            name: "HRX Rapid-Dry Training Performance T-Shirt",
            price: 699,
            discount: 30,
            unit: "1 Piece",
            stock: 70,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#F472B6", "#1E3A5F"],
            fabric: "Poly-Elastane Mesh",
            fit: "Athletic Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80"
            ],
            description: "High-performance moisture wicking workout t-shirt designed for gym, running, and athletic activities."
          },

          // ─── MEN'S WEAR: JEANS & TROUSERS ───
          {
            category: "Men's Wear",
            subCategory: "Jeans & Trousers",
            brand: "Levi's",
            name: "Levi's 511 Slim Fit Dark Indigo Stretch Jeans",
            price: 3999,
            discount: 20,
            unit: "1 Piece",
            stock: 60,
            sizes: ["30", "32", "34", "36"],
            colors: ["#1E3A5F"],
            fabric: "Stretch Cotton Denim",
            fit: "Slim Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Original Levi's 511 slim fit jeans featuring iconic red tab and classic 5-pocket styling."
          },
          {
            category: "Men's Wear",
            subCategory: "Jeans & Trousers",
            brand: "Wrangler",
            name: "Wrangler Rugged Wear Straight Leg Jeans",
            price: 2999,
            discount: 30,
            unit: "1 Piece",
            stock: 40,
            sizes: ["30", "32", "34", "36"],
            colors: ["#1E3A5F", "#9CA3AF"],
            fabric: "Heavyweight Denim",
            fit: "Regular Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Durable authentic western style Wrangler denim trousers built for rugged outdoor comfort."
          },
          {
            category: "Men's Wear",
            subCategory: "Jeans & Trousers",
            brand: "Spykar",
            name: "Spykar Tapered Fit Distressed Blue Jeans",
            price: 2799,
            discount: 35,
            unit: "1 Piece",
            stock: 35,
            sizes: ["30", "32", "34"],
            colors: ["#1E3A5F"],
            fabric: "Cotton Lycra Denim",
            fit: "Tapered Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Modern youthful distressed jeans with subtle whiskering and knee abrasion details."
          },
          {
            category: "Men's Wear",
            subCategory: "Jeans & Trousers",
            brand: "Jack & Jones",
            name: "Jack & Jones Intelligence Skinny Fit Chinos",
            price: 2499,
            discount: 25,
            unit: "1 Piece",
            stock: 45,
            sizes: ["30", "32", "34", "36"],
            colors: ["#D4B896", "#111111"],
            fabric: "Stretch Cotton Twill",
            fit: "Slim Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Versatile casual chino trousers ideal for semi-formal friday office wear."
          },
          {
            category: "Men's Wear",
            subCategory: "Jeans & Trousers",
            brand: "Flying Machine",
            name: "Flying Machine Rocker Tapered Light Wash Jeans",
            price: 2199,
            discount: 40,
            unit: "1 Piece",
            stock: 50,
            sizes: ["30", "32", "34"],
            colors: ["#9CA3AF"],
            fabric: "Cotton Denim",
            fit: "Tapered Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Stylish light wash denim jeans with flexible stretch for maximum movement."
          },

          // ─── MEN'S WEAR: JACKETS & BLAZERS ───
          {
            category: "Men's Wear",
            subCategory: "Jackets & Blazers",
            brand: "Superdry",
            name: "Superdry Everest Hooded Winter Bomber Jacket",
            price: 8999,
            discount: 20,
            unit: "1 Piece",
            stock: 20,
            sizes: ["M", "L", "XL"],
            colors: ["#111111", "#6B7C2F"],
            fabric: "Nylon Shell & Fleece Lining",
            fit: "Regular Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Heavy duty thermal insulated Superdry winter jacket with detachable faux fur trim hood."
          },
          {
            category: "Men's Wear",
            subCategory: "Jackets & Blazers",
            brand: "Woodland",
            name: "Woodland Rugged Leather Biker Jacket",
            price: 9995,
            discount: 15,
            unit: "1 Piece",
            stock: 15,
            sizes: ["M", "L", "XL"],
            colors: ["#111111", "#7C4B1E"],
            fabric: "100% Genuine Leather",
            fit: "Regular Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Authentic Woodland full-grain leather motorcycle jacket engineered for timeless style and road durability."
          },
          {
            category: "Men's Wear",
            subCategory: "Jackets & Blazers",
            brand: "Benetton",
            name: "Benetton Single Breasted Casual Cotton Blazer",
            price: 4999,
            discount: 30,
            unit: "1 Piece",
            stock: 25,
            sizes: ["M", "L", "XL"],
            colors: ["#1E3A5F", "#9CA3AF"],
            fabric: "Cotton Linen Blend",
            fit: "Slim Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Chic single breasted unstructured blazer perfect for modern smart-casual layering."
          },
          {
            category: "Men's Wear",
            subCategory: "Jackets & Blazers",
            brand: "Roadster",
            name: "Roadster Faux Leather Sherpa Biker Jacket",
            price: 3499,
            discount: 45,
            unit: "1 Piece",
            stock: 40,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#7C4B1E"],
            fabric: "Faux Leather with Sherpa Collar",
            fit: "Regular Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Warm plush sherpa collar biker jacket with vintage distressed tan finish."
          },
          {
            category: "Men's Wear",
            subCategory: "Jackets & Blazers",
            brand: "U.S. Polo Assn.",
            name: "U.S. Polo Assn. Lightweight Zip Windcheater",
            price: 2999,
            discount: 25,
            unit: "1 Piece",
            stock: 35,
            sizes: ["M", "L", "XL"],
            colors: ["#1E3A5F", "#EF4444"],
            fabric: "Water Resistant Polyester",
            fit: "Regular Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Sporty water-resistant windbreaker jacket featuring standing collar and branded chest insignia."
          },

          // ─── WOMEN'S WEAR: DRESSES ───
          {
            category: "Women's Wear",
            subCategory: "Dresses & Jumpsuits",
            brand: "H&M",
            name: "H&M Floral Print A-Line Summer Midi Dress",
            price: 2299,
            discount: 20,
            unit: "1 Piece",
            stock: 50,
            sizes: ["XS", "S", "M", "L"],
            colors: ["#F472B6", "#FFFFFF"],
            fabric: "Viscose Weave",
            fit: "A-Line Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Flowy feminine midi dress by H&M rendered in cheerful floral pattern with sweetheart neckline."
          },
          {
            category: "Women's Wear",
            subCategory: "Dresses & Jumpsuits",
            brand: "Zara",
            name: "Zara Satin Evening Wrap Party Gown",
            price: 4590,
            discount: 15,
            unit: "1 Piece",
            stock: 25,
            sizes: ["S", "M", "L"],
            colors: ["#EF4444", "#111111"],
            fabric: "Luxurious Poly Satin",
            fit: "Wrap Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Glamorous satin wrap dress with subtle thigh slit designed for red carpet and cocktail occasions."
          },
          {
            category: "Women's Wear",
            subCategory: "Dresses & Jumpsuits",
            brand: "Vero Moda",
            name: "Vero Moda Pleated Shirt Dress with Belt",
            price: 2999,
            discount: 30,
            unit: "1 Piece",
            stock: 35,
            sizes: ["XS", "S", "M", "L"],
            colors: ["#6B7C2F"],
            fabric: "Woven Cotton Blend",
            fit: "Fit & Flare",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Elegant button-front shirt dress with cinched waist belt and accordion pleat skirt."
          },
          {
            category: "Women's Wear",
            subCategory: "Dresses & Jumpsuits",
            brand: "Only",
            name: "Only Denim Wide Leg Casual Jumpsuit",
            price: 3299,
            discount: 35,
            unit: "1 Piece",
            stock: 30,
            sizes: ["S", "M", "L"],
            colors: ["#1E3A5F"],
            fabric: "Soft Denim Twill",
            fit: "Relaxed Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Trendy full-length denim jumpsuit featuring shoulder straps and wide leg silhouette."
          },
          {
            category: "Women's Wear",
            subCategory: "Dresses & Jumpsuits",
            brand: "Forever 21",
            name: "Forever 21 Ribbed Knit Bodycon Dress",
            price: 1499,
            discount: 40,
            unit: "1 Piece",
            stock: 65,
            sizes: ["XS", "S", "M"],
            colors: ["#111111", "#F472B6"],
            fabric: "Ribbed Cotton Elastane",
            fit: "Bodycon Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Sleek form-fitting ribbed knit mini dress for easy day-to-night styling."
          },

          // ─── WOMEN'S WEAR: TOPS & TEES ───
          {
            category: "Women's Wear",
            subCategory: "Tops & Tees",
            brand: "Vero Moda",
            name: "Vero Moda Chiffon Ruffled Bishop Sleeve Top",
            price: 1799,
            discount: 25,
            unit: "1 Piece",
            stock: 45,
            sizes: ["S", "M", "L"],
            colors: ["#FFFFFF", "#F472B6"],
            fabric: "Sheer Chiffon",
            fit: "Regular Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Romantic sheer chiffon top with dramatic bishop sleeves and neck tie detailing."
          },
          {
            category: "Women's Wear",
            subCategory: "Tops & Tees",
            brand: "H&M",
            name: "H&M Cropped Ribbed Cotton Tank Top",
            price: 699,
            discount: 20,
            unit: "1 Piece",
            stock: 90,
            sizes: ["XS", "S", "M", "L"],
            colors: ["#FFFFFF", "#111111", "#D4B896"],
            fabric: "Ribbed Cotton Jersey",
            fit: "Cropped Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Minimalist essential crop tank top cut from high stretch ribbed organic cotton."
          },
          {
            category: "Women's Wear",
            subCategory: "Tops & Tees",
            brand: "Levi's",
            name: "Levi's Graphic Batwing Logo T-Shirt",
            price: 1499,
            discount: 30,
            unit: "1 Piece",
            stock: 70,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#FFFFFF", "#EF4444"],
            fabric: "100% Soft Cotton",
            fit: "Regular Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Classic Levi's crew neck tee showcasing iconic red batwing chest screenprint."
          },
          {
            category: "Women's Wear",
            subCategory: "Tops & Tees",
            brand: "Only",
            name: "Only Puff Sleeve Peplum Floral Top",
            price: 1599,
            discount: 35,
            unit: "1 Piece",
            stock: 50,
            sizes: ["S", "M", "L"],
            colors: ["#F472B6"],
            fabric: "Woven Rayon",
            fit: "Peplum Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Charming floral peplum top detailed with smocked elastic back and voluminous puff shoulders."
          },
          {
            category: "Women's Wear",
            subCategory: "Tops & Tees",
            brand: "Allen Solly",
            name: "Allen Solly Woman Satin Formal Shirt",
            price: 1999,
            discount: 20,
            unit: "1 Piece",
            stock: 40,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#1E3A5F", "#9CA3AF"],
            fabric: "Poly Satin Weave",
            fit: "Regular Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Polished office wear satin shirt featuring subtle sheen and concealed button placket."
          },

          // ─── WOMEN'S WEAR: ETHNIC WEAR ───
          {
            category: "Women's Wear",
            subCategory: "Kurtas & Ethnic Sets",
            brand: "Biba",
            name: "Biba Printed Anarkali Kurta with Dupatta",
            price: 3999,
            discount: 25,
            unit: "1 Piece",
            stock: 40,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#EF4444", "#D4B896"],
            fabric: "Pure Cotton Anarkali",
            fit: "Flared Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Graceful floral printed flared Anarkali suit set paired with matching chiffony printed dupatta."
          },
          {
            category: "Women's Wear",
            subCategory: "Kurtas & Ethnic Sets",
            brand: "W for Woman",
            name: "W Straight Cotton Kurta & Palazzo Set",
            price: 2999,
            discount: 30,
            unit: "1 Piece",
            stock: 50,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#6B7C2F", "#FFFFFF"],
            fabric: "Slub Cotton",
            fit: "Straight Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Modern fusion ethnic set featuring keyhole collar neck and comfortable wide palazzo pants."
          },
          {
            category: "Women's Wear",
            subCategory: "Kurtas & Ethnic Sets",
            brand: "FabIndia",
            name: "FabIndia Handloom Tussar Silk Tunic Kurti",
            price: 3490,
            discount: 15,
            unit: "1 Piece",
            stock: 30,
            sizes: ["M", "L", "XL"],
            colors: ["#D4B896", "#EF4444"],
            fabric: "Handwoven Tussar Silk",
            fit: "Straight Fit",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Authentic handloomed silk ethnic tunic woven by artisanal craftsmen using traditional techniques."
          },
          {
            category: "Women's Wear",
            subCategory: "Kurtas & Ethnic Sets",
            brand: "Manyavar Mohey",
            name: "Manyavar Mohey Designer Velvet Festive Suit",
            price: 6999,
            discount: 20,
            unit: "1 Piece",
            stock: 20,
            sizes: ["S", "M", "L"],
            colors: ["#1E3A5F", "#7C4B1E"],
            fabric: "Micro Velvet with Zari Work",
            fit: "Royal Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Luxurious bridal & wedding reception designer suit adorned with gold thread zari embroidery."
          },
          {
            category: "Women's Wear",
            subCategory: "Kurtas & Ethnic Sets",
            brand: "Aurelia",
            name: "Aurelia Embroidered Rayon Straight Kurta",
            price: 1499,
            discount: 40,
            unit: "1 Piece",
            stock: 60,
            sizes: ["S", "M", "L", "XL"],
            colors: ["#F472B6"],
            fabric: "Soft Liva Rayon",
            fit: "Straight Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1610030469857-e6f65446f2c7?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Comfortable dailywear straight kurta decorated with neck embroidery motifs."
          },

          // ─── FOOTWEAR & SHOES ───
          {
            category: "Footwear & Shoes",
            subCategory: "Sneakers & Casual Shoes",
            brand: "Nike",
            name: "Nike Air Force 1 '07 Leather Sneakers",
            price: 8995,
            discount: 10,
            unit: "1 Pair",
            stock: 50,
            sizes: ["7", "8", "9", "10", "11"],
            colors: ["#FFFFFF", "#111111"],
            fabric: "Full Grain Leather",
            fit: "Regular",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
            ],
            description: "The legendary Nike Air Force 1 basketball shoe styled with crisp leather edges and cushioned air sole."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Sneakers & Casual Shoes",
            brand: "Adidas",
            name: "Adidas Ultraboost Light Running Shoes",
            price: 13999,
            discount: 20,
            unit: "1 Pair",
            stock: 35,
            sizes: ["7", "8", "9", "10"],
            colors: ["#111111", "#EF4444"],
            fabric: "Primeknit Upper",
            fit: "Sock-like Fit",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Ultimate energy return running performance sneakers powered by Adidas Boost midsole technology."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Sneakers & Casual Shoes",
            brand: "Puma",
            name: "Puma RS-X Retro Colorblock Sneakers",
            price: 6999,
            discount: 30,
            unit: "1 Pair",
            stock: 40,
            sizes: ["8", "9", "10"],
            colors: ["#1E3A5F", "#F472B6"],
            fabric: "Mesh & Suede Overlay",
            fit: "Regular",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Chunky 80s throwback retro running shoes with bold multi-color chunky silhouette."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Sneakers & Casual Shoes",
            brand: "Reebok",
            name: "Reebok Classic Leather Vintage Shoes",
            price: 4999,
            discount: 25,
            unit: "1 Pair",
            stock: 45,
            sizes: ["7", "8", "9", "10"],
            colors: ["#FFFFFF"],
            fabric: "Garment Leather",
            fit: "Regular",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Clean timeless tennis aesthetic lifestyle sneakers with lightweight EVA midsole."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Sneakers & Casual Shoes",
            brand: "Woodland",
            name: "Woodland Leather Casual Walking Sneakers",
            price: 3795,
            discount: 35,
            unit: "1 Pair",
            stock: 55,
            sizes: ["7", "8", "9", "10", "11"],
            colors: ["#7C4B1E", "#6B7C2F"],
            fabric: "Nubuck Leather",
            fit: "Wide Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Heavy duty nubuck leather casual sneakers built with slip resistant rubber outsoles."
          },

          // ─── FOOTWEAR & SHOES: FORMAL SHOES ───
          {
            category: "Footwear & Shoes",
            subCategory: "Formal & Boots",
            brand: "Woodland",
            name: "Woodland Genuine Leather Outdoor Boots",
            price: 4995,
            discount: 20,
            unit: "1 Pair",
            stock: 40,
            sizes: ["7", "8", "9", "10", "11"],
            colors: ["#7C4B1E", "#111111"],
            fabric: "Crazy Horse Leather",
            fit: "Rugged Boot Fit",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Indestructible Woodland high-top leather adventure boots with deep traction rubber lugs."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Formal & Boots",
            brand: "Peter England",
            name: "Peter England Handcrafted Leather Oxfords",
            price: 3499,
            discount: 30,
            unit: "1 Pair",
            stock: 30,
            sizes: ["7", "8", "9", "10"],
            colors: ["#111111", "#7C4B1E"],
            fabric: "Burnished Crust Leather",
            fit: "Formal Slim",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Sleek closed lacing lace-up oxford shoes burnished for rich tonal gradient elegance."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Formal & Boots",
            brand: "Louis Philippe",
            name: "Louis Philippe Premium Leather Derby Shoes",
            price: 4599,
            discount: 25,
            unit: "1 Pair",
            stock: 25,
            sizes: ["8", "9", "10"],
            colors: ["#7C4B1E"],
            fabric: "Calfskin Leather",
            fit: "Regular Formal",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Hand-finished calfskin derby formal dress shoes with padded Memory Foam insoles."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Formal & Boots",
            brand: "Red Tape",
            name: "Red Tape Classic Leather Slip-On Loafers",
            price: 2199,
            discount: 50,
            unit: "1 Pair",
            stock: 65,
            sizes: ["7", "8", "9", "10"],
            colors: ["#111111", "#D4B896"],
            fabric: "Soft Nappa Leather",
            fit: "Slip-on Fit",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1582845844300-66970b282333?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Effortless slip-on leather driving loafers crafted for versatile smart formal style."
          },
          {
            category: "Footwear & Shoes",
            subCategory: "Formal & Boots",
            brand: "Clarks",
            name: "Clarks Desert Chukka Ankle Boots",
            price: 6999,
            discount: 15,
            unit: "1 Pair",
            stock: 20,
            sizes: ["8", "9", "10"],
            colors: ["#D4B896"],
            fabric: "English Suede",
            fit: "Ankle Boot",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Iconic original Clarks suede desert boots featuring natural crepe rubber soles."
          },

          // ─── ACCESSORIES & WATCHES ───
          {
            category: "Accessories & Watches",
            subCategory: "Watches & Wearables",
            brand: "Fossil",
            name: "Fossil Grant Chronograph Brown Leather Watch",
            price: 11995,
            discount: 25,
            unit: "1 Piece",
            stock: 35,
            sizes: [],
            colors: ["#7C4B1E", "#1E3A5F"],
            fabric: "Stainless Steel Case & Genuine Leather",
            fit: "44mm Dial",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Classic Roman numeral dial Fossil chronograph watch featuring genuine leather strap."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Watches & Wearables",
            brand: "Casio",
            name: "Casio G-Shock Tough Solar Sport Digital Watch",
            price: 8495,
            discount: 15,
            unit: "1 Piece",
            stock: 45,
            sizes: [],
            colors: ["#111111"],
            fabric: "Shock Resistant Resin",
            fit: "50mm Tough Case",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Indestructible 200m water resistant G-Shock sports digital watch with solar charging."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Watches & Wearables",
            brand: "Titan",
            name: "Titan Neo Analog Stainless Steel Blue Dial Watch",
            price: 3995,
            discount: 20,
            unit: "1 Piece",
            stock: 50,
            sizes: [],
            colors: ["#9CA3AF", "#1E3A5F"],
            fabric: "Stainless Steel Mesh",
            fit: "40mm Dial",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Sleek Titan analog wrist watch styled with deep blue sunray dial and silver mesh bracelet."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Watches & Wearables",
            brand: "Tommy Hilfiger",
            name: "Tommy Hilfiger Executive Black Mesh Watch",
            price: 9495,
            discount: 30,
            unit: "1 Piece",
            stock: 25,
            sizes: [],
            colors: ["#111111"],
            fabric: "Black Ion-Plated Steel",
            fit: "42mm Case",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Understated matte black stainless steel watch with signature red white blue accent second hand."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Watches & Wearables",
            brand: "Fastrack",
            name: "Fastrack Trendies Casual Youth Quartz Watch",
            price: 1995,
            discount: 35,
            unit: "1 Piece",
            stock: 60,
            sizes: [],
            colors: ["#EF4444", "#111111"],
            fabric: "Silicone Strap",
            fit: "Unisex",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Vibrant sporty silicone watch with high contrast hands designed for casual everyday wear."
          },

          // ─── ACCESSORIES: SUNGLASSES & BAGS ───
          {
            category: "Accessories & Watches",
            subCategory: "Sunglasses & Bags",
            brand: "Ray-Ban",
            name: "Ray-Ban Aviator Classic Gold Lens Sunglasses",
            price: 8590,
            discount: 15,
            unit: "1 Piece",
            stock: 40,
            sizes: [],
            colors: ["#D4B896", "#6B7C2F"],
            fabric: "Metal Frame & G-15 Glass",
            fit: "58mm Medium",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Timeless original 1937 Ray-Ban Aviator metal frame sunglasses with 100% UV protection G-15 lenses."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Sunglasses & Bags",
            brand: "Oakley",
            name: "Oakley Holbrook Matte Black Polarized Sunglasses",
            price: 9790,
            discount: 20,
            unit: "1 Piece",
            stock: 30,
            sizes: [],
            colors: ["#111111"],
            fabric: "O Matter Frame & Prizm Lens",
            fit: "Regular",
            tags: ["trending"],
            images: [
              "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Iconic American frame design fused with Oakley Prizm optical polarization technology."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Sunglasses & Bags",
            brand: "Tommy Hilfiger",
            name: "Tommy Hilfiger Canvas College Laptop Backpack",
            price: 3499,
            discount: 40,
            unit: "1 Piece",
            stock: 50,
            sizes: [],
            colors: ["#1E3A5F", "#EF4444"],
            fabric: "Water Resistant Canvas",
            fit: "24 Liter",
            tags: ["sale"],
            images: [
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Spacious 15.6-inch laptop padded compartment backpack styled with signature flag crest."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Sunglasses & Bags",
            brand: "Wildcraft",
            name: "Wildcraft Travel Workpack 30L Backpack",
            price: 2199,
            discount: 45,
            unit: "1 Piece",
            stock: 75,
            sizes: [],
            colors: ["#111111", "#9CA3AF"],
            fabric: "Ripstop Polyester",
            fit: "30 Liter",
            tags: ["best-seller"],
            images: [
              "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Ergonomic airmesh padded back panel backpack built for work, commute, and weekend travel."
          },
          {
            category: "Accessories & Watches",
            subCategory: "Sunglasses & Bags",
            brand: "Fossil",
            name: "Fossil Buckner Genuine Leather Messenger Bag",
            price: 8995,
            discount: 25,
            unit: "1 Piece",
            stock: 20,
            sizes: [],
            colors: ["#7C4B1E"],
            fabric: "100% Cognac Leather",
            fit: "Medium Crossbody",
            tags: ["new-arrival"],
            images: [
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Handsome vintage cognac leather crossbody messenger bag with brass hardware closures."
          }
        ];

        // STEP 1: CLEAN SLATE WIPE
        const ProductModel = (await import('../models/product.model.js')).default;
        await ProductModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await SubCategoryModel.deleteMany({});

        // STEP 2: BUILD CATEGORIES AND SUBCATEGORIES MAP
        const categoryMap = {};
        const subCategoryMap = {};

        for (const item of RAW_PRODUCT_DATA) {
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

        // STEP 3: PREPARE AND INSERT UNIQUE PRODUCTS
        const productsToInsert = RAW_PRODUCT_DATA.map(item => ({
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
            message: `Successfully wiped database and seeded ${productsToInsert.length} 100% unique, non-repeating branded products!`,
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
}

export const updateAllProductSizesController = async (request, response) => {
    try {
        // Fetch raw documents to detect old string-format sizes
        const products = await ProductModel.find({}).populate('category subCategory').lean();
        let updatedCount = 0;
        let skippedCount = 0;

        // Random stock between 5 and 50
        const randStock = () => Math.floor(Math.random() * 46) + 5;

        // Convert a string array to {size, stock} objects
        const fromStrings = (arr) => arr.map(s => ({ size: s, stock: randStock() }));

        // Build a {size, stock} array for a given size list
        const toSizeStock = (arr) => arr.map(s => ({ size: s, stock: randStock() }));

        // Check if value is a plain string (old format)
        const isStringArray = (arr) =>
            Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string';

        // Check if value is already properly formatted {size, stock}
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
                // OLD STRING FORMAT → migrate to {size, stock} with random stock
                newSizes = fromStrings(existingSizes);

            } else if (isStockArray(existingSizes)) {
                // Already in correct format — just ensure no size has stock=0 from migration (set to random if 0)
                const hasZeroStock = existingSizes.some(x => x.stock === 0);
                if (hasZeroStock) {
                    newSizes = existingSizes.map(x => ({ ...x, stock: x.stock === 0 ? randStock() : x.stock }));
                } else {
                    skippedCount++;
                    continue; // Already properly set, skip
                }

            } else {
                // EMPTY sizes — classify and assign
                if (isFootwear(cat, sub, name)) {
                    newSizes = toSizeStock(['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']);
                } else if (isApparel(cat, sub, name)) {
                    newSizes = toSizeStock(['S', 'M', 'L', 'XL', 'XXL']);
                } else {
                    // Non-clothing product (watch, bag, wallet, etc.) — no sizes needed
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