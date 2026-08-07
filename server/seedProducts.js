import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import CategoryModel from './models/category.model.js';
import SubCategoryModel from './models/subCategory.model.js';
import ProductModel from './models/product.model.js';

// High quality Unsplash fashion image URLs by type
const FASHION_IMAGES = {
  men_shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
  ],
  men_tshirt: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
  ],
  men_jeans: [
    'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80',
  ],
  men_jacket: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
  ],
  women_dress: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
  ],
  women_top: [
    'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=800&q=80',
  ],
  women_ethnic: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  ],
  footwear: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  ],
};

const BRANDS = [
  'U.S. Polo Assn.', 'Tommy Hilfiger', 'Woodland', 'Snitch', 'Roadster',
  'H&M', "Levi's", 'Nike', 'Adidas', 'Puma', 'Reebok', 'Peter England',
  'Van Heusen', 'Arrow', 'Louis Philippe', 'Raymond', 'Allen Solly',
  'Jack & Jones', 'Vero Moda', 'Only', 'Benetton', 'Superdry', 'Wrangler',
  'Lee', 'Spykar', 'Flying Machine', 'Being Human', 'FabIndia', 'Manyavar',
  'W', 'Biba', 'Calvin Klein', 'Zara', 'HRX'
];

const CATEGORIES_SPEC = [
  {
    name: "Men's Wear",
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    subCategories: [
      { name: 'Shirts', imgKey: 'men_shirt', priceRange: [899, 3499] },
      { name: 'T-Shirts', imgKey: 'men_tshirt', priceRange: [499, 1999] },
      { name: 'Jeans & Trousers', imgKey: 'men_jeans', priceRange: [1299, 4599] },
      { name: 'Jackets & Blazers', imgKey: 'men_jacket', priceRange: [2499, 8999] },
    ]
  },
  {
    name: "Women's Wear",
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    subCategories: [
      { name: 'Dresses & Jumpsuits', imgKey: 'women_dress', priceRange: [1199, 4999] },
      { name: 'Tops & Tees', imgKey: 'women_top', priceRange: [599, 2299] },
      { name: 'Kurtas & Ethnic Sets', imgKey: 'women_ethnic', priceRange: [1499, 6999] },
    ]
  },
  {
    name: "Footwear & Shoes",
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
    subCategories: [
      { name: 'Sneakers & Casual Shoes', imgKey: 'footwear', priceRange: [1999, 9999] },
      { name: 'Formal & Boots', imgKey: 'footwear', priceRange: [2499, 7999] },
    ]
  },
  {
    name: "Accessories & Watches",
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    subCategories: [
      { name: 'Watches & Wearables', imgKey: 'accessories', priceRange: [1999, 14999] },
      { name: 'Sunglasses & Bags', imgKey: 'accessories', priceRange: [899, 4999] },
    ]
  }
];

const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS_LIST = ['#111111', '#FFFFFF', '#EF4444', '#1E3A5F', '#6B7C2F', '#D4B896', '#F472B6', '#9CA3AF', '#7C4B1E'];
const TAGS_LIST = ['new-arrival', 'trending', 'sale', 'best-seller'];

const FABRICS = ['Pure Cotton', 'Denim', 'Polyester Blend', 'Linen', 'Silk Blend', 'Viscose Rayon', 'Fleece', 'Leather'];
const FITS = ['Slim Fit', 'Regular Fit', 'Oversized Fit', 'Relaxed Fit', 'Tailored Fit'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database successfully!');

    // Clean existing data if needed or just insert fresh batch
    // We'll keep existing categories or sync them
    const categoryMap = {};
    const subCategoryMap = {};

    console.log('Creating/Updating Categories & SubCategories...');

    for (const catSpec of CATEGORIES_SPEC) {
      let category = await CategoryModel.findOne({ name: catSpec.name });
      if (!category) {
        category = await CategoryModel.create({
          name: catSpec.name,
          image: catSpec.image,
        });
      }
      categoryMap[catSpec.name] = category._id;

      for (const subSpec of catSpec.subCategories) {
        let subCategory = await SubCategoryModel.findOne({ name: subSpec.name });
        if (!subCategory) {
          subCategory = await SubCategoryModel.create({
            name: subSpec.name,
            image: FASHION_IMAGES[subSpec.imgKey][0],
            category: [category._id],
          });
        } else {
          if (!subCategory.category.includes(category._id)) {
            subCategory.category.push(category._id);
            await subCategory.save();
          }
        }
        subCategoryMap[subSpec.name] = {
          id: subCategory._id,
          catId: category._id,
          imgKey: subSpec.imgKey,
          priceRange: subSpec.priceRange,
        };
      }
    }

    console.log('Generating 320 Premium Fashion Products...');
    const productsToInsert = [];

    const TOTAL_TARGET = 320;
    const subCatKeys = Object.keys(subCategoryMap);

    for (let i = 0; i < TOTAL_TARGET; i++) {
      const brand = getRandomElement(BRANDS);
      const subCatName = subCatKeys[i % subCatKeys.length];
      const subCatInfo = subCategoryMap[subCatName];

      const price = getRandomInt(subCatInfo.priceRange[0], subCatInfo.priceRange[1]);
      const hasDiscount = Math.random() > 0.3;
      const discount = hasDiscount ? getRandomElement([10, 15, 20, 25, 30, 40, 50, 60]) : 0;
      const stock = getRandomInt(5, 120);

      const isFootwearOrAccessory = subCatName.includes('Shoes') || subCatName.includes('Sneakers') || subCatName.includes('Watches') || subCatName.includes('Bags') || subCatName.includes('Sunglasses');
      const sizes = isFootwearOrAccessory ? [] : getRandomElements(SIZES_CLOTHING, getRandomInt(3, 6));
      const colors = getRandomElements(COLORS_LIST, getRandomInt(2, 4));

      const tag = Math.random() > 0.25 ? getRandomElement(TAGS_LIST) : '';
      const tags = tag ? [tag] : [];

      const images = getRandomElements(FASHION_IMAGES[subCatInfo.imgKey], getRandomInt(1, 3));

      const fabric = getRandomElement(FABRICS);
      const fit = getRandomElement(FITS);

      const name = `${brand} ${fit} ${subCatName.replace('&', 'and')} - Style #${1000 + i}`;
      const description = `Elevate your everyday wardrobe with this premium ${name} from ${brand}. Crafted from high-grade ${fabric} for maximum comfort, durability, and modern fashion appeal. Ideal for casual outings, work, or evening events.`;

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

    console.log(`Inserting ${productsToInsert.length} products into MongoDB...`);
    // Insert products in bulk
    await ProductModel.insertMany(productsToInsert);

    console.log(`Successfully seeded ${productsToInsert.length} products into database!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
