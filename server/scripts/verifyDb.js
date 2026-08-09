import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../config/connectDB.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import OrderModel from '../models/order.model.js';
import CartProductModel from '../models/cartproduct.model.js';

async function verify() {
    await connectDB();

    const pCount = await ProductModel.countDocuments();
    const cCount = await CategoryModel.countDocuments();
    const sCount = await SubCategoryModel.countDocuments();
    const oCount = await OrderModel.countDocuments();
    const cartCount = await CartProductModel.countDocuments();

    console.log('\n================ DB VERIFICATION SUMMARY ================');
    console.log(`📦 Total Products: ${pCount}`);
    console.log(`🏷️ Total Categories: ${cCount}`);
    console.log(`📂 Total Subcategories: ${sCount}`);
    console.log(`📋 Total Orders (Should be 0): ${oCount}`);
    console.log(`🛒 Total Cart Items (Should be 0): ${cartCount}`);

    const oosProducts = await ProductModel.find({ stock: 0 }).lean();
    console.log('\n🔴 Fully Out of Stock Products (Total stock = 0):');
    oosProducts.forEach(p => console.log(`   - ${p.name}`));

    const zeroSizeProducts = await ProductModel.find({
        sizes: { $elemMatch: { stock: 0 } },
        stock: { $gt: 0 }
    }).lean();

    console.log('\n⚠️ Products with specific size out of stock (e.g. Size M or UK 8 is stock=0 while others available):');
    zeroSizeProducts.forEach(p => {
        const zeroSizes = p.sizes.filter(s => s.stock === 0).map(s => s.size).join(', ');
        console.log(`   - ${p.name} (Out of stock size: ${zeroSizes})`);
    });

    console.log('\n=========================================================\n');
    process.exit(0);
}

verify();
