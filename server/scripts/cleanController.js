import fs from 'fs';

const file = 'C:/Users/SUBHAMOY CHOWDHURY/Downloads/FlashFitpr/FlashFit/server/controllers/product.controller.js';
let content = fs.readFileSync(file, 'utf8');

const idxStart = content.indexOf('// Seed 100 100% Unique Branded Products');
const idxEnd = content.indexOf('export const updateAllProductSizesController');

if (idxStart !== -1 && idxEnd !== -1) {
    const header = content.slice(0, idxStart);
    const footer = content.slice(idxEnd);

    const cleanSeed = `// Seed 100 100% Unique Branded Products (Complete Clean Slate Wipe & Seed)
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

            const subCatKey = \`\${item.category}_\${item.subCategory}\`;
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
            subCategory: [subCategoryMap[\`\${item.category}_\${item.subCategory}\`]],
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
            message: \`Successfully wiped database (products, categories, subcategories, orders, cart) and seeded \${productsToInsert.length} 100% unique, non-repeating branded products!\`,
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
};\n\n`;

    fs.writeFileSync(file, header + cleanSeed + footer);
    console.log('Successfully cleaned product.controller.js!');
} else {
    console.log('Could not find markers in file', { idxStart, idxEnd });
}
