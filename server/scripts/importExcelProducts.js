import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import connectDB from '../config/connectDB.js';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import ProductModel from '../models/product.model.js';

dotenv.config();

const EXCEL_FILE_PATH = "C:\\Users\\SUBHAMOY CHOWDHURY\\Downloads\\100_products_dataset.xlsx";

// High quality category cover image fallbacks
const DEFAULT_CATEGORY_IMAGES = {
  "Men's Wear": "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
  "Women's Wear": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  "Footwear": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  "Accessories": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  "Default": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80"
};

// High quality subcategory image fallbacks
const SUB_IMAGES = {
  "Shirts": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  "T-Shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  "Jeans": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
  "Trousers": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
  "Jackets": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
  "Sweatshirts": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
  "Ethnic Wear": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  "Blazers": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
  "Dresses": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
  "Tops": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
  "Skirts": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80",
  "Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  "Formal Shoes": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
  "Casual Shoes": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
  "Boots": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
  "Sandals": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
  "Watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  "Sunglasses": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
  "Handbags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
  "Belts": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80"
};

const mapTagValue = (rawTagStr) => {
  if (!rawTagStr) return [];
  const tags = rawTagStr.split(',').map(t => t.trim().toLowerCase());
  const tagList = [];
  tags.forEach(t => {
    if (t.includes('new arrival')) tagList.push('new-arrival');
    if (t.includes('trending')) tagList.push('trending');
    if (t.includes('sale')) tagList.push('sale');
    if (t.includes('best seller') || t.includes('bestseller')) tagList.push('best-seller');
  });
  return [...new Set(tagList)];
};

const importExcel = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB successfully!");

    const workbook = xlsx.readFile(EXCEL_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const rawRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`Processing ${rawRows.length} products from sheet "${sheetName}"...`);

    const categoryCache = {};
    const subCategoryCache = {};

    let insertedCount = 0;

    for (const row of rawRows) {
      const pName = row['Product Name'] || row['name'] || '';
      if (!pName) continue;

      const catName = (row['Category'] || 'Fashion').trim();
      const subCatName = (row['Sub Category'] || 'General').trim();

      // 1. Get or create Category
      if (!categoryCache[catName]) {
        let catDoc = await CategoryModel.findOne({ name: catName });
        if (!catDoc) {
          const catImg = DEFAULT_CATEGORY_IMAGES[catName] || DEFAULT_CATEGORY_IMAGES['Default'];
          catDoc = await CategoryModel.create({ name: catName, image: catImg });
          console.log(`Created new Category: "${catName}"`);
        }
        categoryCache[catName] = catDoc;
      }
      const categoryObj = categoryCache[catName];

      // 2. Get or create SubCategory
      const subKey = `${catName}_${subCatName}`;
      if (!subCategoryCache[subKey]) {
        let subDoc = await SubCategoryModel.findOne({ name: subCatName });
        if (!subDoc) {
          const subImg = SUB_IMAGES[subCatName] || categoryObj.image;
          subDoc = await SubCategoryModel.create({
            name: subCatName,
            image: subImg,
            category: [categoryObj._id]
          });
          console.log(`Created new SubCategory: "${subCatName}"`);
        } else {
          if (!subDoc.category.includes(categoryObj._id)) {
            subDoc.category.push(categoryObj._id);
            await subDoc.save();
          }
        }
        subCategoryCache[subKey] = subDoc;
      }
      const subCategoryObj = subCategoryCache[subKey];

      // 3. Parse Sizes
      const rawSizes = (row['Available Sizes'] || '').toString();
      const sizeArray = rawSizes ? rawSizes.split(',').map(s => s.trim()) : ['Free Size'];
      const stockQty = Number(row['Stock Quantity']) || 20;

      const sizesList = sizeArray.map(s => ({
        size: s,
        stock: stockQty
      }));

      // 4. Parse Keywords & Tags
      const rawKeywords = (row['AI Search Keywords'] || '').toString();
      const keywordsList = rawKeywords ? rawKeywords.split(',').map(k => k.trim().toLowerCase()) : [];

      const rawTags = (row['Product Labels/Tags'] || '').toString();
      const tagsList = mapTagValue(rawTags);

      // 5. Construct Key Features & Specifications (more_details)
      const colorVal = (row['Color'] || 'Multicolor').trim();
      const brandVal = (row['Brand'] || 'FlashFit').trim();

      const isFootwear = catName.toLowerCase().includes('footwear') || subCatName.toLowerCase().includes('shoe') || subCatName.toLowerCase().includes('sneaker');
      const isSunglasses = subCatName.toLowerCase().includes('sunglasses') || subCatName.toLowerCase().includes('eyewear');
      const isWatches = subCatName.toLowerCase().includes('watch');

      const moreDetailsObj = {
        'Brand': brandVal,
        'Color Family': colorVal,
      };

      if (isFootwear) {
        moreDetailsObj['Sole Material'] = 'Rubber';
        moreDetailsObj['Heel Type'] = 'Flat';
        moreDetailsObj['Heel Height'] = '1 inch';
        moreDetailsObj['Upper Material'] = 'Synthetic';
        moreDetailsObj['Net Quantity'] = '1 Pair';
      } else if (isSunglasses) {
        moreDetailsObj['Frame Material'] = 'Acetate';
        moreDetailsObj['Lens Technology'] = 'UV400 Protected';
        moreDetailsObj['Frame Shape'] = 'Wayfarer';
        moreDetailsObj['Gender / Fit'] = 'Unisex';
        moreDetailsObj['Net Quantity'] = '1 N (With Case)';
      } else if (isWatches) {
        moreDetailsObj['Strap Material'] = 'Stainless Steel';
        moreDetailsObj['Movement'] = 'Analog Quartz';
        moreDetailsObj['Water Resistance'] = '3 ATM / 30m';
        moreDetailsObj['Net Quantity'] = '1 N';
      } else {
        moreDetailsObj['Fabric / Material'] = 'Cotton Blend';
        moreDetailsObj['Pattern'] = pName.toLowerCase().includes('check') ? 'Checked' : pName.toLowerCase().includes('print') ? 'Printed' : 'Solid';
        moreDetailsObj['Fit Type'] = pName.toLowerCase().includes('slim') ? 'Slim Fit' : 'Regular Fit';
        moreDetailsObj['Net Quantity'] = '1 N';
      }

      // Pick image fallback based on subcategory or category
      const coverImage = SUB_IMAGES[subCatName] || categoryObj.image;

      // 6. Build Product Document
      const productPayload = {
        name: pName,
        image: [coverImage],
        category: [categoryObj._id],
        subCategory: [subCategoryObj._id],
        unit: (row['Unit/Size Label'] || 'Per Piece').trim(),
        stock: stockQty,
        price: Number(row['Price (₹)']) || 999,
        discount: Number(row['Discount (%)']) || 0,
        description: (row['Description'] || pName).trim(),
        more_details: moreDetailsObj,
        sizes: sizesList,
        colors: [colorVal],
        tags: tagsList,
        keywords: keywordsList,
        publish: true
      };

      await ProductModel.create(productPayload);
      insertedCount++;
    }

    console.log(`\n🎉 SUCCESS! Inserted ${insertedCount} products into database successfully.`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error importing products:", error);
    process.exit(1);
  }
};

importExcel();
