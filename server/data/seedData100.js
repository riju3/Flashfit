export const SEED_PRODUCTS_100 = [
  // ─────────────────────────────────────────────────────────────
  // 1. MEN'S WEAR - SHIRTS (7 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Men's Wear",
    subCategory: "Shirts",
    brand: "U.S. Polo Assn.",
    name: "U.S. Polo Assn. Classic Oxford Cotton Shirt",
    price: 2499,
    discount: 25,
    unit: "1 Piece",
    stock: 28,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 0 }, // OUT OF STOCK SIZE FOR TESTING
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 },
      { size: "XXL", stock: 3 }
    ],
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
    name: "Tommy Hilfiger Slim Fit Striped Dress Shirt",
    price: 3999,
    discount: 30,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 15 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 7 }
    ],
    colors: ["#1E3A5F", "#EF4444", "#FFFFFF"],
    fabric: "Poplin Cotton",
    fit: "Slim Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sharp executive striped dress shirt with Tommy flag chest emblem and tailored slim-fit silhouette."
  },
  {
    category: "Men's Wear",
    subCategory: "Shirts",
    brand: "Levi's",
    name: "Levi's Classic Denim Western Shirt",
    price: 2999,
    discount: 20,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 12 },
      { size: "L", stock: 11 },
      { size: "XL", stock: 6 }
    ],
    colors: ["#2563EB", "#1E293B"],
    fabric: "100% Cotton Denim",
    fit: "Standard Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Authentic Western yoke detail denim shirt with pearl snap buttons and twin flap chest pockets."
  },
  {
    category: "Men's Wear",
    subCategory: "Shirts",
    brand: "Arrow",
    name: "Arrow President Collection Formal White Shirt",
    price: 2299,
    discount: 15,
    unit: "1 Piece",
    stock: 50,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: ["#FFFFFF"],
    fabric: "Superfine Giza Cotton",
    fit: "Formal Regular Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Crisp white wrinkle-resistant formal shirt tailored for corporate elegance and boardroom power meetings."
  },
  {
    category: "Men's Wear",
    subCategory: "Shirts",
    brand: "Raymond",
    name: "Raymond Luxury Micro-Check Formal Shirt",
    price: 2799,
    discount: 35,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "M", stock: 10 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["#3B82F6", "#94A3B8"],
    fabric: "Pure Egyptian Cotton",
    fit: "Tailored Fit",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Premium Raymond woven micro-check shirt offering unbeatable smoothness and long-lasting lustre."
  },
  {
    category: "Men's Wear",
    subCategory: "Shirts",
    brand: "Mufti",
    name: "Mufti Casual Linen Blend Mandarin Shirt",
    price: 2199,
    discount: 40,
    unit: "1 Piece",
    stock: 22,
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 8 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 4 }
    ],
    colors: ["#D4B896", "#059669"],
    fabric: "Linen Cotton Blend",
    fit: "Relaxed Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lightweight Mandarin collar shirt engineered for effortless summer resort styling."
  },
  {
    category: "Men's Wear",
    subCategory: "Shirts",
    brand: "Allen Solly",
    name: "Allen Solly French Cuff Solid Evening Shirt",
    price: 2699,
    discount: 20,
    unit: "1 Piece",
    stock: 25,
    sizes: [
      { size: "M", stock: 8 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 7 }
    ],
    colors: ["#1E1B4B", "#475569"],
    fabric: "100% Mercerized Cotton",
    fit: "Slim Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Elegant deep-hued evening shirt designed with French cuffs for cufflink pairing."
  },

  // ─────────────────────────────────────────────────────────────
  // 2. MEN'S WEAR - T-SHIRTS & POLOS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Men's Wear",
    subCategory: "T-Shirts & Polos",
    brand: "Nike",
    name: "Nike Sportswear Club Fleece Crewneck T-Shirt",
    price: 1795,
    discount: 15,
    unit: "1 Piece",
    stock: 60,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 20 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 }
    ],
    colors: ["#000000", "#DC2626", "#FFFFFF"],
    fabric: "100% Cotton Jersey",
    fit: "Standard Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Everyday staple cotton crewneck featuring embroidered Nike Futura logo chest print."
  },
  {
    category: "Men's Wear",
    subCategory: "T-Shirts & Polos",
    brand: "Adidas",
    name: "Adidas Essentials 3-Stripes Performance Polo",
    price: 1999,
    discount: 25,
    unit: "1 Piece",
    stock: 45,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 10 }
    ],
    colors: ["#1E3A5F", "#FFFFFF", "#000000"],
    fabric: "Recycled Polyester Pique",
    fit: "Regular Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-5645f0611c08?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Moisture-absorbing Aeroready polo shirt detailed with classic shoulder 3-Stripes."
  },
  {
    category: "Men's Wear",
    subCategory: "T-Shirts & Polos",
    brand: "Puma",
    name: "Puma Classic Cat Logo Graphic Tee",
    price: 1199,
    discount: 30,
    unit: "1 Piece",
    stock: 55,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 20 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 }
    ],
    colors: ["#111111", "#E11D48"],
    fabric: "100% BCI Cotton",
    fit: "Regular Fit",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Bold athletic graphic tee constructed from sustainable Better Cotton Initiative soft jersey."
  },
  {
    category: "Men's Wear",
    subCategory: "T-Shirts & Polos",
    brand: "Under Armour",
    name: "Under Armour Tech 2.0 Short Sleeve Tee",
    price: 1699,
    discount: 20,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "M", stock: 15 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: ["#2563EB", "#64748B"],
    fabric: "UA Tech Quick-Dry Fabric",
    fit: "Loose Athletic Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra-soft workout shirt engineered with anti-odor technology and rapid moisture wicking."
  },
  {
    category: "Men's Wear",
    subCategory: "T-Shirts & Polos",
    brand: "Lacoste",
    name: "Lacoste Classic Fit L1212 Pique Polo",
    price: 5999,
    discount: 10,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 10 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 5 }
    ],
    colors: ["#059669", "#FFFFFF", "#1E3A5F"],
    fabric: "100% Petit Pique Cotton",
    fit: "Classic Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-5645f0611c08?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Original 1933 French design polo shirt featuring the iconic green crocodile chest applique."
  },
  {
    category: "Men's Wear",
    subCategory: "T-Shirts & Polos",
    brand: "Superdry",
    name: "Superdry Vintage Logo Tri Color T-Shirt",
    price: 2499,
    discount: 35,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 12 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 7 }
    ],
    colors: ["#D97706", "#1E293B"],
    fabric: "Organic Cotton Blend",
    fit: "Slim Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Retro American graphic print T-shirt combined with Japanese typography inspired accents."
  },

  // ─────────────────────────────────────────────────────────────
  // 3. MEN'S WEAR - JEANS & TROUSERS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Men's Wear",
    subCategory: "Jeans & Trousers",
    brand: "Levi's",
    name: "Levi's 511 Slim Fit Stretch Jeans",
    price: 3499,
    discount: 25,
    unit: "1 Piece",
    stock: 45,
    sizes: [
      { size: "30", stock: 10 },
      { size: "32", stock: 15 },
      { size: "34", stock: 12 },
      { size: "36", stock: 8 }
    ],
    colors: ["#1E3A5F", "#0F172A"],
    fabric: "99% Cotton, 1% Elastane",
    fit: "Slim Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Modern slim-cut denim with extra room to move and classic 5-pocket styling."
  },
  {
    category: "Men's Wear",
    subCategory: "Jeans & Trousers",
    brand: "Wrangler",
    name: "Wrangler Rugged Wear Regular Fit Denim",
    price: 2799,
    discount: 30,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "30", stock: 8 },
      { size: "32", stock: 14 },
      { size: "34", stock: 10 },
      { size: "36", stock: 8 }
    ],
    colors: ["#2563EB"],
    fabric: "Heavyweight Cotton Denim",
    fit: "Regular Fit",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Durable workwear denim pants built with U-shape comfort crotch construction."
  },
  {
    category: "Men's Wear",
    subCategory: "Jeans & Trousers",
    brand: "Pepe Jeans",
    name: "Pepe Jeans Cash Mid-Rise Tapered Fit Jeans",
    price: 3299,
    discount: 20,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "30", stock: 7 },
      { size: "32", stock: 12 },
      { size: "34", stock: 10 },
      { size: "36", stock: 6 }
    ],
    colors: ["#475569"],
    fabric: "Washed Stretch Denim",
    fit: "Tapered Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Urban distressed light-wash denim jeans finished with signature leather back waist patch."
  },
  {
    category: "Men's Wear",
    subCategory: "Jeans & Trousers",
    brand: "Peter England",
    name: "Peter England Slim Fit Chino Trousers",
    price: 1999,
    discount: 35,
    unit: "1 Piece",
    stock: 50,
    sizes: [
      { size: "30", stock: 12 },
      { size: "32", stock: 18 },
      { size: "34", stock: 12 },
      { size: "36", stock: 8 }
    ],
    colors: ["#D4B896", "#1E293B", "#475569"],
    fabric: "Stretch Twill Cotton",
    fit: "Slim Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Versatile flat-front stretch chinos suitable for smart-casual Fridays and weekend outings."
  },
  {
    category: "Men's Wear",
    subCategory: "Jeans & Trousers",
    brand: "Dockers",
    name: "Dockers Alpha Khaki Flat-Front Pants",
    price: 2999,
    discount: 15,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "30", stock: 6 },
      { size: "32", stock: 10 },
      { size: "34", stock: 8 },
      { size: "36", stock: 6 }
    ],
    colors: ["#B45309"],
    fabric: "100% Cotton Twill",
    fit: "Straight Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Clean tailored khaki trousers with flexible waistband technology for all-day mobility."
  },
  {
    category: "Men's Wear",
    subCategory: "Jeans & Trousers",
    brand: "Jack & Jones",
    name: "Jack & Jones Anti-Fit Cargo Joggers",
    price: 2499,
    discount: 40,
    unit: "1 Piece",
    stock: 38,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 8 }
    ],
    colors: ["#334155", "#064E3B"],
    fabric: "Ripstop Cotton Stretch",
    fit: "Cargo Tapered Jogger",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Streetwear utility cargo trousers equipped with multiple flap pockets and cuffed ankles."
  },

  // ─────────────────────────────────────────────────────────────
  // 4. MEN'S WEAR - JACKETS & BLAZERS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Men's Wear",
    subCategory: "Jackets & Blazers",
    brand: "Zara",
    name: "Zara Faux Leather Biker Jacket",
    price: 5990,
    discount: 20,
    unit: "1 Piece",
    stock: 25,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 5 }
    ],
    colors: ["#000000"],
    fabric: "100% Polyurethane Faux Leather",
    fit: "Biker Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Edgy asymmetric zipper motorcycle jacket with silver hardware detailing and notched lapels."
  },
  {
    category: "Men's Wear",
    subCategory: "Jackets & Blazers",
    brand: "H&M",
    name: "H&M Padded Hooded Winter Buffer Jacket",
    price: 3999,
    discount: 30,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "S", stock: 7 },
      { size: "M", stock: 12 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 6 }
    ],
    colors: ["#0F172A", "#D97706"],
    fabric: "Water-Repellent Polyester Shell",
    fit: "Regular Fit Puffer",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Insulated thermal puffer jacket featuring detachable drawstring hood and fleece-lined pockets."
  },
  {
    category: "Men's Wear",
    subCategory: "Jackets & Blazers",
    brand: "Park Avenue",
    name: "Park Avenue Solid Slim Fit Single Breasted Blazer",
    price: 6999,
    discount: 25,
    unit: "1 Piece",
    stock: 20,
    sizes: [
      { size: "38", stock: 4 },
      { size: "40", stock: 8 },
      { size: "42", stock: 5 },
      { size: "44", stock: 3 }
    ],
    colors: ["#1E3A5F", "#334155"],
    fabric: "Poly-Wool Premium Blend",
    fit: "Slim Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sophisticated navy single-breasted blazer with notch lapel collar and dual side vents."
  },
  {
    category: "Men's Wear",
    subCategory: "Jackets & Blazers",
    brand: "Woodland",
    name: "Woodland Heavy-Duty Outdoor Parka Jacket",
    price: 7495,
    discount: 35,
    unit: "1 Piece",
    stock: 18,
    sizes: [
      { size: "M", stock: 6 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 }
    ],
    colors: ["#15803D", "#78350F"],
    fabric: "Windproof Canvas & Fleece Interior",
    fit: "Relaxed Outdoor Fit",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Rugged expedition winter parka with faux-fur lined hood and multi-functional chest utility pockets."
  },
  {
    category: "Men's Wear",
    subCategory: "Jackets & Blazers",
    brand: "Columbia",
    name: "Columbia Steens Mountain Full Zip Fleece",
    price: 3299,
    discount: 15,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 10 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 5 }
    ],
    colors: ["#1E293B"],
    fabric: "100% MTR Filament Fleece",
    fit: "Regular Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Cozy mid-layer outdoor fleece jacket engineered for lightweight insulation and breathability."
  },
  {
    category: "Men's Wear",
    subCategory: "Jackets & Blazers",
    brand: "Louis Philippe",
    name: "Louis Philippe Italian Knit Dinner Blazer",
    price: 8999,
    discount: 20,
    unit: "1 Piece",
    stock: 15,
    sizes: [
      { size: "38", stock: 3 },
      { size: "40", stock: 6 },
      { size: "42", stock: 4 },
      { size: "44", stock: 2 }
    ],
    colors: ["#020617"],
    fabric: "Textured Italian Knit Cotton",
    fit: "Tailored Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra-luxurious evening dinner jacket crafted from soft stretch Italian knit fabric."
  },

  // ─────────────────────────────────────────────────────────────
  // 5. WOMEN'S WEAR - DRESSES & GOWNS (7 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "Mango",
    name: "Mango Floral Print Satin Wrap Dress",
    price: 4590,
    discount: 25,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 10 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 }
    ],
    colors: ["#BE123C", "#F472B6"],
    fabric: "100% Recycled Satin Polyester",
    fit: "Wrap Silhouette",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Flowing satin wrap dress decorated with vibrant botanical floral prints and V-neckline."
  },
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "Zara",
    name: "Zara A-Line Midi Cocktail Dress",
    price: 3990,
    discount: 20,
    unit: "1 Piece",
    stock: 0, // FULLY OUT OF STOCK PRODUCT FOR TESTING
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 }
    ],
    colors: ["#000000"],
    fabric: "Structured Crepe Fabric",
    fit: "A-Line Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Chic little black midi dress featuring tailored waist pleats and concealed back zip."
  },
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "Forever 21",
    name: "Forever 21 Velvet Bodycon Evening Dress",
    price: 2299,
    discount: 30,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 5 }
    ],
    colors: ["#881337", "#1E1B4B"],
    fabric: "Stretch Plush Velvet",
    fit: "Bodycon Fit",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Glamorous night-out velvet dress with sweetheart neckline and ruched side seam."
  },
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "Vero Moda",
    name: "Vero Moda Tiered Cotton Sundress",
    price: 2999,
    discount: 35,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "XS", stock: 4 },
      { size: "S", stock: 10 },
      { size: "M", stock: 10 },
      { size: "L", stock: 6 }
    ],
    colors: ["#FEF08A", "#FFFFFF"],
    fabric: "100% Cotton Slub",
    fit: "Relaxed Tiered Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Breezy sunny-day cotton tiered dress styled with delicate shoulder tie straps."
  },
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "ONLY",
    name: "ONLY Pleated Chiffon Party Gown",
    price: 4999,
    discount: 15,
    unit: "1 Piece",
    stock: 25,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 10 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 3 }
    ],
    colors: ["#0284C7", "#C084FC"],
    fabric: "Georgette Chiffon",
    fit: "Maxi Silhouette",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Floor-length accordion pleated gown crafted from sheer lightweight georgette over satin lining."
  },
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "Cover Story",
    name: "Cover Story High-Low Asymmetric Midi Dress",
    price: 3490,
    discount: 40,
    unit: "1 Piece",
    stock: 28,
    sizes: [
      { size: "S", stock: 7 },
      { size: "M", stock: 11 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 3 }
    ],
    colors: ["#059669"],
    fabric: "Fluid Rayon Viscose",
    fit: "Asymmetric Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Contemporary high-low hem midi dress featuring ruffled cap sleeves and cinched elastic waist."
  },
  {
    category: "Women's Wear",
    subCategory: "Dresses & Gowns",
    brand: "Biba",
    name: "Biba Silk Blend Printed Anarkali Dress",
    price: 5499,
    discount: 20,
    unit: "1 Piece",
    stock: 22,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 3 }
    ],
    colors: ["#7E22CE", "#B45309"],
    fabric: "Art Silk & Gold Foil Print",
    fit: "Anarkali Flare",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Festive Indo-western Anarkali gown enriched with intricate metallic print work."
  },

  // ─────────────────────────────────────────────────────────────
  // 6. WOMEN'S WEAR - TOPS & TEES (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Women's Wear",
    subCategory: "Tops & Tees",
    brand: "H&M",
    name: "H&M Ribbed Cotton Crop Top",
    price: 799,
    discount: 20,
    unit: "1 Piece",
    stock: 70,
    sizes: [
      { size: "XS", stock: 15 },
      { size: "S", stock: 25 },
      { size: "M", stock: 20 },
      { size: "L", stock: 10 }
    ],
    colors: ["#FFFFFF", "#000000", "#F472B6"],
    fabric: "Stretch Ribbed Cotton",
    fit: "Fitted Crop",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Soft ribbed jersey crop top with scoop neck collar, ideal for casual layering."
  },
  {
    category: "Women's Wear",
    subCategory: "Tops & Tees",
    brand: "Levi's",
    name: "Levi's Graphic Perfect T-Shirt",
    price: 1499,
    discount: 25,
    unit: "1 Piece",
    stock: 50,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["#FFFFFF", "#DC2626"],
    fabric: "100% Cotton Jersey",
    fit: "Standard Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic Levi's housemark batwing logo screenprinted across the chest of a soft crewneck."
  },
  {
    category: "Women's Wear",
    subCategory: "Tops & Tees",
    brand: "Tommy Hilfiger",
    name: "Tommy Hilfiger Embroidered Logo Polo Top",
    price: 2999,
    discount: 30,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 10 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 }
    ],
    colors: ["#1E3A5F", "#FFFFFF"],
    fabric: "Cotton Pique Stretch",
    fit: "Slim Fit Polo",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1625910513413-5645f0611c08?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Preppy short-sleeve pique polo tailored with signature flag embroidery."
  },
  {
    category: "Women's Wear",
    subCategory: "Tops & Tees",
    brand: "Vero Moda",
    name: "Vero Moda Satin Button-Down Blouse",
    price: 2499,
    discount: 35,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 3 }
    ],
    colors: ["#0284C7", "#059669"],
    fabric: "Smooth Satin Polyester",
    fit: "Relaxed Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lustrous satin button-up top featuring point collar and buttoned cuffs."
  },
  {
    category: "Women's Wear",
    subCategory: "Tops & Tees",
    brand: "Zara",
    name: "Zara Puff Sleeve Floral Blouse",
    price: 2790,
    discount: 15,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "XS", stock: 6 },
      { size: "S", stock: 14 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 }
    ],
    colors: ["#EC4899"],
    fabric: "Chiffon Viscose",
    fit: "Puff Sleeve Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Dramatic elasticated puff sleeve blouse with micro floral print and square neckline."
  },
  {
    category: "Women's Wear",
    subCategory: "Tops & Tees",
    brand: "Roadster",
    name: "Roadster Casual Boxy Cotton Tee",
    price: 699,
    discount: 50,
    unit: "1 Piece",
    stock: 65,
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: ["#64748B", "#F59E0B"],
    fabric: "100% Combed Cotton",
    fit: "Boxy Oversized",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra-comfortable relaxed boxy graphic tee for off-duty lounge weekends."
  },

  // ─────────────────────────────────────────────────────────────
  // 7. WOMEN'S WEAR - ETHNIC WEAR & KURTIS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Women's Wear",
    subCategory: "Ethnic Wear & Kurtis",
    brand: "W for Woman",
    name: "W for Woman Geometric Print Straight Kurta",
    price: 1999,
    discount: 30,
    unit: "1 Piece",
    stock: 45,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["#0284C7", "#F59E0B"],
    fabric: "100% Viscose Rayon",
    fit: "Straight Cut",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Modern knee-length straight kurta decorated with contemporary geometric block prints."
  },
  {
    category: "Women's Wear",
    subCategory: "Ethnic Wear & Kurtis",
    brand: "Biba",
    name: "Biba Chanderi Silk Kurta with Dupatta Set",
    price: 4995,
    discount: 25,
    unit: "1 Set",
    stock: 25,
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 10 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 4 }
    ],
    colors: ["#059669", "#D97706"],
    fabric: "Chanderi Silk Blend",
    fit: "Regular Ethnic Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "3-piece ethnic set comprising woven Chanderi kurta, matching pants, and sheer organza dupatta."
  },
  {
    category: "Women's Wear",
    subCategory: "Ethnic Wear & Kurtis",
    brand: "Aurelia",
    name: "Aurelia Embroidered A-Line Ethnic Kurti",
    price: 1599,
    discount: 40,
    unit: "1 Piece",
    stock: 50,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["#BE123C"],
    fabric: "Cotton Jacquard",
    fit: "A-Line Flare",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Daily-wear flared A-line kurti embellished with delicate neck thread embroidery."
  },
  {
    category: "Women's Wear",
    subCategory: "Ethnic Wear & Kurtis",
    brand: "Libas",
    name: "Libas Cotton Printed Anarkali Kurta Set",
    price: 2799,
    discount: 35,
    unit: "1 Set",
    stock: 30,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 }
    ],
    colors: ["#4C1D95", "#FBBF24"],
    fabric: "100% Pure Cotton",
    fit: "Anarkali Cut",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Breathable flared cotton Anarkali suit paired with printed trousers and chiffon stole."
  },
  {
    category: "Women's Wear",
    subCategory: "Ethnic Wear & Kurtis",
    brand: "FabIndia",
    name: "FabIndia Handloom Tussar Silk Saree",
    price: 8990,
    discount: 15,
    unit: "1 Piece",
    stock: 15,
    sizes: [], // SAREE NO SIZES NEEDED
    colors: ["#D97706", "#991B1B"],
    fabric: "100% Pure Tussar Silk",
    fit: "Standard 6.3m",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Authentic hand-woven pure Tussar silk saree featuring traditional Zari border motifs."
  },
  {
    category: "Women's Wear",
    subCategory: "Ethnic Wear & Kurtis",
    brand: "Manyavar Mohey",
    name: "Manyavar Mohey Embroidered Bridal Lehenga Gown",
    price: 14999,
    discount: 20,
    unit: "1 Set",
    stock: 10,
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 5 },
      { size: "L", stock: 3 }
    ],
    colors: ["#991B1B", "#D4AF37"],
    fabric: "Velvet & Net Silk",
    fit: "Royal Bridal Lehenga",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Opulent crimson velvet lehenga intricately detailed with Zardozi and Dori embroidery."
  },

  // ─────────────────────────────────────────────────────────────
  // 8. WOMEN'S WEAR - JEANS & SKIRTS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Women's Wear",
    subCategory: "Jeans & Skirts",
    brand: "Levi's",
    name: "Levi's 721 High Rise Shotgun Skinny Jeans",
    price: 3799,
    discount: 25,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "26", stock: 8 },
      { size: "28", stock: 14 },
      { size: "30", stock: 12 },
      { size: "32", stock: 6 }
    ],
    colors: ["#1E3A5F", "#334155"],
    fabric: "Levi's Sculpt Stretch Denim",
    fit: "High Rise Skinny",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Flattering high-rise waist denim built with stretch technology to hold and lift."
  },
  {
    category: "Women's Wear",
    subCategory: "Jeans & Skirts",
    brand: "Zara",
    name: "Zara Faux Leather Pleated Midi Skirt",
    price: 3590,
    discount: 20,
    unit: "1 Piece",
    stock: 30,
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 10 },
      { size: "M", stock: 10 },
      { size: "L", stock: 5 }
    ],
    colors: ["#000000", "#78350F"],
    fabric: "Soft Synthetic Leather",
    fit: "High-Waist Pleated",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Statement pleated leather-look skirt with concealed side zipper and comfortable lining."
  },
  {
    category: "Women's Wear",
    subCategory: "Jeans & Skirts",
    brand: "H&M",
    name: "H&M Wide Leg High Waist Denim Trousers",
    price: 2299,
    discount: 30,
    unit: "1 Piece",
    stock: 45,
    sizes: [
      { size: "26", stock: 10 },
      { size: "28", stock: 15 },
      { size: "30", stock: 12 },
      { size: "32", stock: 8 }
    ],
    colors: ["#38BDF8"],
    fabric: "100% Rigid Cotton Denim",
    fit: "Wide Leg Loose",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Retro 90s-inspired wide leg light wash jeans with clean hem finishes."
  },
  {
    category: "Women's Wear",
    subCategory: "Jeans & Skirts",
    brand: "Mango",
    name: "Mango Floral A-Line Summer Skirt",
    price: 2790,
    discount: 35,
    unit: "1 Piece",
    stock: 25,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 10 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 3 }
    ],
    colors: ["#EF4444"],
    fabric: "Viscose Weave",
    fit: "A-Line Midi",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Flowy floral printed summer skirt featuring front button closure down the skirt length."
  },
  {
    category: "Women's Wear",
    subCategory: "Jeans & Skirts",
    brand: "Only",
    name: "Only Distressed Boyfriend Fit Jeans",
    price: 2999,
    discount: 40,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "26", stock: 8 },
      { size: "28", stock: 12 },
      { size: "30", stock: 10 },
      { size: "32", stock: 5 }
    ],
    colors: ["#64748B"],
    fabric: "Cotton Denim Blend",
    fit: "Boyfriend Relaxed",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Casual relaxed boyfriend jeans designed with subtle knee distressing and raw hem."
  },
  {
    category: "Women's Wear",
    subCategory: "Jeans & Skirts",
    brand: "Vero Moda",
    name: "Vero Moda Paperbag Waist Belted Trousers",
    price: 2499,
    discount: 25,
    unit: "1 Piece",
    stock: 32,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 }
    ],
    colors: ["#D4B896", "#0284C7"],
    fabric: "Twill Viscose",
    fit: "Tapered Paperbag",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "High-rise paperbag waist pants fitted with self-fabric waist tie belt and slant pockets."
  },

  // ─────────────────────────────────────────────────────────────
  // 9. FOOTWEAR - SNEAKERS (7 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Nike",
    name: "Nike Air Force 1 '07 LV8 Sneakers",
    price: 9695,
    discount: 10,
    unit: "1 Pair",
    stock: 0, // FULLY OUT OF STOCK PRODUCT FOR TESTING
    sizes: [
      { size: "UK 6", stock: 0 },
      { size: "UK 7", stock: 0 },
      { size: "UK 8", stock: 0 },
      { size: "UK 9", stock: 0 },
      { size: "UK 10", stock: 0 }
    ],
    colors: ["#FFFFFF"],
    fabric: "100% Genuine Crisp Leather",
    fit: "Low Top Classic",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Legendary basketball original leather sneaker with encapsulated Nike Air cushioning."
  },
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Adidas",
    name: "Adidas Originals Stan Smith Leather Sneakers",
    price: 8599,
    discount: 20,
    unit: "1 Pair",
    stock: 35,
    sizes: [
      { size: "UK 6", stock: 5 },
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 12 },
      { size: "UK 9", stock: 8 }
    ],
    colors: ["#FFFFFF", "#059669"],
    fabric: "Primegreen Recycled Synthetic Leather",
    fit: "Regular Low Top",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Minimalist court sneaker featuring perforated 3-Stripes and green heel tab accent."
  },
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Puma",
    name: "Puma RS-X Reinvent Chunky Retro Sneakers",
    price: 7999,
    discount: 30,
    unit: "1 Pair",
    stock: 28,
    sizes: [
      { size: "UK 6", stock: 4 },
      { size: "UK 7", stock: 8 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 6 }
    ],
    colors: ["#38BDF8", "#EC4899", "#FFFFFF"],
    fabric: "Mesh & Suede Overlay",
    fit: "Chunky Midsole",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Futuristic 80s Running System cushioning technology matched with bold color-blocked panels."
  },
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Converse",
    name: "Converse Chuck Taylor All Star High Tops",
    price: 4999,
    discount: 15,
    unit: "1 Pair",
    stock: 45,
    sizes: [
      { size: "UK 5", stock: 8 },
      { size: "UK 6", stock: 12 },
      { size: "UK 7", stock: 15 },
      { size: "UK 8", stock: 10 }
    ],
    colors: ["#000000", "#FFFFFF"],
    fabric: "Durable Canvas Upper",
    fit: "High Top Silhouette",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Unmistakable classic canvas high-top sneakers with iconic star ankle emblem."
  },
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "New Balance",
    name: "New Balance 574 Core Heritage Sneakers",
    price: 8999,
    discount: 25,
    unit: "1 Pair",
    stock: 30,
    sizes: [
      { size: "UK 7", stock: 8 },
      { size: "UK 8", stock: 12 },
      { size: "UK 9", stock: 7 },
      { size: "UK 10", stock: 3 }
    ],
    colors: ["#475569", "#1E293B"],
    fabric: "Premium Suede & Mesh",
    fit: "ENCAP Midsole Cushioning",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Timeless lifestyle runner built with signature ENCAP midsole foam for supreme durability."
  },
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Vans",
    name: "Vans Old Skool Classic Skate Shoes",
    price: 4599,
    discount: 20,
    unit: "1 Pair",
    stock: 40,
    sizes: [
      { size: "UK 6", stock: 8 },
      { size: "UK 7", stock: 12 },
      { size: "UK 8", stock: 12 },
      { size: "UK 9", stock: 8 }
    ],
    colors: ["#000000", "#FFFFFF"],
    fabric: "Suede & Canvas Combo",
    fit: "Low Top Skate",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Iconic side-stripe canvas skate shoe equipped with re-enforced toe caps and waffle rubber outsoles."
  },
  {
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Reebok",
    name: "Reebok Club C 85 Vintage Sneakers",
    price: 6999,
    discount: 35,
    unit: "1 Pair",
    stock: 25,
    sizes: [
      { size: "UK 6", stock: 5 },
      { size: "UK 7", stock: 8 },
      { size: "UK 8", stock: 8 },
      { size: "UK 9", stock: 4 }
    ],
    colors: ["#F8FAFC", "#15803D"],
    fabric: "Soft Garment Leather",
    fit: "Retro Tennis Fit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Clean retro tennis court sneaker constructed with ultra-soft garment leather upper."
  },

  // ─────────────────────────────────────────────────────────────
  // 10. FOOTWEAR - SPORTS & RUNNING SHOES (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Footwear",
    subCategory: "Sports & Running Shoes",
    brand: "Nike",
    name: "Nike Pegasus 40 Road Running Shoes",
    price: 11895,
    discount: 15,
    unit: "1 Pair",
    stock: 35,
    sizes: [
      { size: "UK 6", stock: 5 },
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 0 }, // OUT OF STOCK SIZE FOR TESTING
      { size: "UK 9", stock: 12 },
      { size: "UK 10", stock: 8 }
    ],
    colors: ["#0284C7", "#000000"],
    fabric: "Engineered Mesh & React Foam",
    fit: "Neutral Runner",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Springy road running shoes equipped with dual Zoom Air units and responsive React foam."
  },
  {
    category: "Footwear",
    subCategory: "Sports & Running Shoes",
    brand: "Adidas",
    name: "Adidas Ultraboost Light Performance Running Shoes",
    price: 13999,
    discount: 25,
    unit: "1 Pair",
    stock: 22,
    sizes: [
      { size: "UK 7", stock: 6 },
      { size: "UK 8", stock: 8 },
      { size: "UK 9", stock: 5 },
      { size: "UK 10", stock: 3 }
    ],
    colors: ["#000000", "#DC2626"],
    fabric: "Primeknit+ Upper & Light BOOST",
    fit: "Sock-like Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lightest Ultraboost ever made delivering epic energy return over long distance runs."
  },
  {
    category: "Footwear",
    subCategory: "Sports & Running Shoes",
    brand: "Asics",
    name: "Asics GEL-Kayano 30 Stability Running Shoes",
    price: 12999,
    discount: 20,
    unit: "1 Pair",
    stock: 25,
    sizes: [
      { size: "UK 7", stock: 6 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 6 },
      { size: "UK 10", stock: 3 }
    ],
    colors: ["#2563EB", "#000000"],
    fabric: "Stretch Knit & PureGEL Tech",
    fit: "Maximum Stability",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Advanced 4D GUIDANCE SYSTEM offers adaptive stability and plush PureGEL cushioning."
  },
  {
    category: "Footwear",
    subCategory: "Sports & Running Shoes",
    brand: "Puma",
    name: "Puma Velocity Nitro 2 Cushioning Shoes",
    price: 8999,
    discount: 30,
    unit: "1 Pair",
    stock: 30,
    sizes: [
      { size: "UK 6", stock: 6 },
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 9 },
      { size: "UK 9", stock: 5 }
    ],
    colors: ["#16A34A", "#000000"],
    fabric: "NITRO Foam & PUMAGRIP Rubber",
    fit: "Neutral Trainer",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    description: "All-in-one neutral running shoe with nitrogen-injected foam for high responsiveness."
  },
  {
    category: "Footwear",
    subCategory: "Sports & Running Shoes",
    brand: "Skechers",
    name: "Skechers Go Run Persistence Sports Shoes",
    price: 6499,
    discount: 40,
    unit: "1 Pair",
    stock: 35,
    sizes: [
      { size: "UK 6", stock: 8 },
      { size: "UK 7", stock: 12 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 5 }
    ],
    colors: ["#9333EA", "#000000"],
    fabric: "Arch Fit Insole & Carbon Plate",
    fit: "Cushioned Athletic",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Podiatrist-certified Arch Fit support system paired with carbon-infused forefoot plate."
  },
  {
    category: "Footwear",
    subCategory: "Sports & Running Shoes",
    brand: "Under Armour",
    name: "Under Armour Charged Assert 9 Running Shoes",
    price: 5999,
    discount: 25,
    unit: "1 Pair",
    stock: 40,
    sizes: [
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 15 },
      { size: "UK 9", stock: 10 },
      { size: "UK 10", stock: 5 }
    ],
    colors: ["#334155", "#000000"],
    fabric: "Mesh Upper & Charged Cushioning",
    fit: "Regular Sport",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lightweight mesh upper with 3-color digital print delivers complete breathability."
  },

  // ─────────────────────────────────────────────────────────────
  // 11. FOOTWEAR - FORMAL SHOES (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Footwear",
    subCategory: "Formal Shoes",
    brand: "Clarks",
    name: "Clarks Tilden Cap Genuine Leather Oxford Shoes",
    price: 6999,
    discount: 20,
    unit: "1 Pair",
    stock: 30,
    sizes: [
      { size: "UK 6", stock: 5 },
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 5 }
    ],
    colors: ["#000000", "#78350F"],
    fabric: "100% Full Grain Leather",
    fit: "Cap Toe Oxford",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic cap-toe leather dress shoe featuring OrthoLite cushioned footbed and discreet gore elastic stretch."
  },
  {
    category: "Footwear",
    subCategory: "Formal Shoes",
    brand: "Hush Puppies",
    name: "Hush Puppies Strategy Waterproof Leather Derby",
    price: 5499,
    discount: 30,
    unit: "1 Pair",
    stock: 35,
    sizes: [
      { size: "UK 6", stock: 6 },
      { size: "UK 7", stock: 12 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 7 }
    ],
    colors: ["#451A03"],
    fabric: "Waterproof Leather Upper",
    fit: "Comfort Derby",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Weather-proof leather derby built with Bounce technology footbed for high energy return."
  },
  {
    category: "Footwear",
    subCategory: "Formal Shoes",
    brand: "Red Tape",
    name: "Red Tape Handcrafted Leather Brogues",
    price: 3499,
    discount: 40,
    unit: "1 Pair",
    stock: 45,
    sizes: [
      { size: "UK 6", stock: 10 },
      { size: "UK 7", stock: 15 },
      { size: "UK 8", stock: 12 },
      { size: "UK 9", stock: 8 }
    ],
    colors: ["#78350F"],
    fabric: "Genuine Burnished Leather",
    fit: "Brogue Wingtip",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Intricately punched wingtip formal shoes finished with hand-burnished tan shading."
  },
  {
    category: "Footwear",
    subCategory: "Formal Shoes",
    brand: "Louis Philippe",
    name: "Louis Philippe Italian Calfskin Monk Strap Shoes",
    price: 8999,
    discount: 15,
    unit: "1 Pair",
    stock: 20,
    sizes: [
      { size: "UK 7", stock: 6 },
      { size: "UK 8", stock: 8 },
      { size: "UK 9", stock: 4 },
      { size: "UK 10", stock: 2 }
    ],
    colors: ["#000000"],
    fabric: "Italian Imported Calfskin",
    fit: "Double Monk Strap",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "High-fashion double buckle monk strap shoes handcrafted from supple Italian calfskin."
  },
  {
    category: "Footwear",
    subCategory: "Formal Shoes",
    brand: "Steve Madden",
    name: "Steve Madden Cognac Leather Dress Loafers",
    price: 7999,
    discount: 25,
    unit: "1 Pair",
    stock: 25,
    sizes: [
      { size: "UK 6", stock: 5 },
      { size: "UK 7", stock: 8 },
      { size: "UK 8", stock: 8 },
      { size: "UK 9", stock: 4 }
    ],
    colors: ["#92400E"],
    fabric: "Smooth Leather & Horsebit Buckle",
    fit: "Slip-On Loafer",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sleek slip-on dress loafer topped with shiny metallic horsebit detail."
  },
  {
    category: "Footwear",
    subCategory: "Formal Shoes",
    brand: "Woodland",
    name: "Woodland Classic Rugged Leather Derby",
    price: 4995,
    discount: 20,
    unit: "1 Pair",
    stock: 30,
    sizes: [
      { size: "UK 6", stock: 6 },
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 9 },
      { size: "UK 9", stock: 5 }
    ],
    colors: ["#451A03"],
    fabric: "Nubuck Leather Upper",
    fit: "Heavy Duty Sole",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tough formal-casual hybrid derby shoe with oil-resistant grooved rubber sole."
  },

  // ─────────────────────────────────────────────────────────────
  // 12. FOOTWEAR - CASUAL SHOES & SANDALS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Footwear",
    subCategory: "Casual Shoes & Sandals",
    brand: "Crocs",
    name: "Crocs Classic Clog Water-Resistant Slip-On",
    price: 2995,
    discount: 15,
    unit: "1 Pair",
    stock: 60,
    sizes: [
      { size: "UK 6", stock: 12 },
      { size: "UK 7", stock: 20 },
      { size: "UK 8", stock: 18 },
      { size: "UK 9", stock: 10 }
    ],
    colors: ["#0284C7", "#000000", "#16A34A"],
    fabric: "100% Croslite Foam",
    fit: "Roomy Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Lightweight water-friendly clogs featuring pivoting heel strap and ventilation ports."
  },
  {
    category: "Footwear",
    subCategory: "Casual Shoes & Sandals",
    brand: "Birkenstock",
    name: "Birkenstock Arizona Unisex Leather Sandals",
    price: 7990,
    discount: 10,
    unit: "1 Pair",
    stock: 30,
    sizes: [
      { size: "UK 6", stock: 5 },
      { size: "UK 7", stock: 10 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 5 }
    ],
    colors: ["#78350F", "#000000"],
    fabric: "Birko-Flor & Cork Footbed",
    fit: "Anatomic Footbed",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Iconic two-strap sandal engineered with anatomical cork-latex footbed support."
  },
  {
    category: "Footwear",
    subCategory: "Casual Shoes & Sandals",
    brand: "Woodland",
    name: "Woodland Rugged Outdoor Trekking Sandals",
    price: 3495,
    discount: 30,
    unit: "1 Pair",
    stock: 40,
    sizes: [
      { size: "UK 6", stock: 8 },
      { size: "UK 7", stock: 15 },
      { size: "UK 8", stock: 12 },
      { size: "UK 9", stock: 5 }
    ],
    colors: ["#3F6212", "#451A03"],
    fabric: "Suede Leather & Rubber Outsole",
    fit: "Adjustable Straps",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Heavy-duty outdoor trail sandals with Velcro adjustment and anti-skid lugged soles."
  },
  {
    category: "Footwear",
    subCategory: "Casual Shoes & Sandals",
    brand: "Bata",
    name: "Bata Flexible Canvas Slip-On Loafers",
    price: 1299,
    discount: 40,
    unit: "1 Pair",
    stock: 50,
    sizes: [
      { size: "UK 6", stock: 10 },
      { size: "UK 7", stock: 18 },
      { size: "UK 8", stock: 14 },
      { size: "UK 9", stock: 8 }
    ],
    colors: ["#1E293B", "#64748B"],
    fabric: "Breathable Canvas Upper",
    fit: "Slip-On Casual",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Everyday easy-wear canvas loafer featuring elastic gore side panels for quick entry."
  },
  {
    category: "Footwear",
    subCategory: "Casual Shoes & Sandals",
    brand: "Sparx",
    name: "Sparx Comfortable Dual-Density Sports Slides",
    price: 699,
    discount: 25,
    unit: "1 Pair",
    stock: 75,
    sizes: [
      { size: "UK 6", stock: 15 },
      { size: "UK 7", stock: 25 },
      { size: "UK 8", stock: 20 },
      { size: "UK 9", stock: 15 }
    ],
    colors: ["#000000", "#DC2626"],
    fabric: "EVA Foam Cushioning",
    fit: "Slide Sandal",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra-soft post-workout slides with textured footbed for gentle acupressure massage."
  },
  {
    category: "Footwear",
    subCategory: "Casual Shoes & Sandals",
    brand: "Red Chief",
    name: "Red Chief Genuine Leather Casual Slip-On Shoes",
    price: 3195,
    discount: 35,
    unit: "1 Pair",
    stock: 35,
    sizes: [
      { size: "UK 6", stock: 7 },
      { size: "UK 7", stock: 12 },
      { size: "UK 8", stock: 10 },
      { size: "UK 9", stock: 6 }
    ],
    colors: ["#78350F"],
    fabric: "Rust Real Leather",
    fit: "Casual Comfort",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Soft genuine leather casual slip-on shoes with shock-absorbing PU soles."
  },

  // ─────────────────────────────────────────────────────────────
  // 13. ACCESSORIES & WATCHES - WATCHES (4 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Accessories & Watches",
    subCategory: "Watches",
    brand: "Fossil",
    name: "Fossil Grant Chronograph Dark Brown Leather Watch",
    price: 11995,
    discount: 25,
    unit: "1 Piece",
    stock: 30,
    sizes: [], // NO SIZES FOR WATCHES
    colors: ["#78350F", "#000000"],
    fabric: "Stainless Steel & Genuine Leather",
    fit: "44mm Case",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Vintage-inspired Roman numeral dial chronograph watch paired with dark brown leather strap."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Watches",
    brand: "Casio",
    name: "Casio G-Shock GA-2100 Octagon Tough Solar Watch",
    price: 9995,
    discount: 15,
    unit: "1 Piece",
    stock: 40,
    sizes: [],
    colors: ["#000000"],
    fabric: "Carbon Core Guard & Resin",
    fit: "45.4mm Case",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra-slim 'CasiOak' octagonal bezel watch with 200m water resistance and shock structure."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Watches",
    brand: "Titan",
    name: "Titan Neo Analog Black Dial Stainless Steel Watch",
    price: 3995,
    discount: 30,
    unit: "1 Piece",
    stock: 50,
    sizes: [],
    colors: ["#000000"],
    fabric: "100% Stainless Steel",
    fit: "42mm Case",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sleek minimalist dress watch featuring black dial with silver indices and metal mesh strap."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Watches",
    brand: "Tommy Hilfiger",
    name: "Tommy Hilfiger Multifunction Blue Dial Steel Watch",
    price: 13995,
    discount: 20,
    unit: "1 Piece",
    stock: 25,
    sizes: [],
    colors: ["#1E3A5F"],
    fabric: "Ion-Plated Blue Steel",
    fit: "46mm Case",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Bold sport chronograph watch with deep navy sunray dial and sub-dials."
  },

  // ─────────────────────────────────────────────────────────────
  // 14. ACCESSORIES & WATCHES - SUNGLASSES & EYEWEAR (4 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Accessories & Watches",
    subCategory: "Sunglasses & Eyewear",
    brand: "Ray-Ban",
    name: "Ray-Ban Aviator Classic Gold Frame Sunglasses",
    price: 8590,
    discount: 15,
    unit: "1 Piece",
    stock: 40,
    sizes: [],
    colors: ["#D4B896"],
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
    subCategory: "Sunglasses & Eyewear",
    brand: "Oakley",
    name: "Oakley Holbrook Matte Black Prizm Polarized Sunglasses",
    price: 9790,
    discount: 20,
    unit: "1 Piece",
    stock: 30,
    sizes: [],
    colors: ["#000000"],
    fabric: "O Matter Frame & Prizm Lens",
    fit: "Standard Fit",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Iconic American frame design fused with Oakley Prizm optical polarization technology."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Sunglasses & Eyewear",
    brand: "Fastrack",
    name: "Fastrack Gradient Square UV Protection Sunglasses",
    price: 1599,
    discount: 35,
    unit: "1 Piece",
    stock: 60,
    sizes: [],
    colors: ["#475569"],
    fabric: "Polycarbonate Lightweight",
    fit: "Free Size",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Trendy oversized square sunglasses featuring gradient smoke lenses."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Sunglasses & Eyewear",
    brand: "Police",
    name: "Police Polarized Aviator Metal Sunglasses",
    price: 7490,
    discount: 25,
    unit: "1 Piece",
    stock: 25,
    sizes: [],
    colors: ["#000000"],
    fabric: "Monel Metal Frame",
    fit: "60mm Large",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Urban Italian designer aviator sunglasses with blue mirrored polarized lenses."
  },

  // ─────────────────────────────────────────────────────────────
  // 15. ACCESSORIES & WATCHES - BAGS & BACKPACKS (4 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Accessories & Watches",
    subCategory: "Bags & Backpacks",
    brand: "Tommy Hilfiger",
    name: "Tommy Hilfiger Campus Laptop Backpack 24L",
    price: 3499,
    discount: 40,
    unit: "1 Piece",
    stock: 50,
    sizes: [],
    colors: ["#1E3A5F", "#EF4444"],
    fabric: "Water Resistant Canvas",
    fit: "24 Liter",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Spacious 15.6-inch laptop padded compartment backpack styled with signature flag crest."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Bags & Backpacks",
    brand: "Wildcraft",
    name: "Wildcraft Travel Workpack 30L Waterproof Backpack",
    price: 2199,
    discount: 45,
    unit: "1 Piece",
    stock: 75,
    sizes: [],
    colors: ["#000000", "#64748B"],
    fabric: "Ripstop Polyester",
    fit: "30 Liter",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ergonomic airmesh padded back panel backpack built for work, commute, and weekend travel."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Bags & Backpacks",
    brand: "Fossil",
    name: "Fossil Buckner Genuine Leather Crossbody Messenger Bag",
    price: 8995,
    discount: 25,
    unit: "1 Piece",
    stock: 20,
    sizes: [],
    colors: ["#78350F"],
    fabric: "100% Cognac Leather",
    fit: "Medium Crossbody",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Handsome vintage cognac leather crossbody messenger bag with brass hardware closures."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Bags & Backpacks",
    brand: "Lavie",
    name: "Lavie Women's Structured Faux Leather Tote Bag",
    price: 2499,
    discount: 50,
    unit: "1 Piece",
    stock: 45,
    sizes: [],
    colors: ["#E11D48", "#000000"],
    fabric: "Saffiano Faux Leather",
    fit: "Large Shoulder Tote",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Chic structured handbag featuring dual shoulder straps and organized inner zip compartments."
  },

  // ─────────────────────────────────────────────────────────────
  // 16. ACCESSORIES & WATCHES - BELTS & WALLETS (3 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Accessories & Watches",
    subCategory: "Belts & Wallets",
    brand: "Levi's",
    name: "Levi's Genuine Reversible Leather Belt",
    price: 1499,
    discount: 30,
    unit: "1 Piece",
    stock: 60,
    sizes: [
      { size: "32", stock: 15 },
      { size: "34", stock: 20 },
      { size: "36", stock: 15 },
      { size: "38", stock: 10 }
    ],
    colors: ["#000000", "#78350F"],
    fabric: "100% Top Grain Leather",
    fit: "Reversible Buckle",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb8ec5522?auto=format&fit=crop&w=800&q=80"
    ],
    description: "2-in-1 reversible leather belt with twist harness buckle (Black to Brown)."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Belts & Wallets",
    brand: "Tommy Hilfiger",
    name: "Tommy Hilfiger Extra Capacity Leather Bifold Wallet",
    price: 2199,
    discount: 25,
    unit: "1 Piece",
    stock: 50,
    sizes: [],
    colors: ["#000000", "#1E3A5F"],
    fabric: "Soft Cowhide Leather",
    fit: "Standard Bifold",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic men's bifold wallet featuring 8 card slots, currency bill compartment, and removable ID passcase."
  },
  {
    category: "Accessories & Watches",
    subCategory: "Belts & Wallets",
    brand: "Wildhorn",
    name: "Wildhorn Handcrafted Full Grain Brown Leather Wallet",
    price: 999,
    discount: 60,
    unit: "1 Piece",
    stock: 80,
    sizes: [],
    colors: ["#78350F"],
    fabric: "Full Grain Italian Leather",
    fit: "RFID Blocking Bifold",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    description: "RFID-blocking handcrafted real leather wallet equipped with coin pocket and gift box packaging."
  },

  // ─────────────────────────────────────────────────────────────
  // 17. KIDS' WEAR - BOYS CLOTHING (5 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Kids' Wear",
    subCategory: "Boys Clothing",
    brand: "U.S. Polo Assn.",
    name: "U.S. Polo Assn. Kids Striped Cotton Polo Tee",
    price: 1299,
    discount: 30,
    unit: "1 Piece",
    stock: 45,
    sizes: [
      { size: "2-3Y", stock: 10 },
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 12 },
      { size: "8-9Y", stock: 8 }
    ],
    colors: ["#1E3A5F", "#DC2626"],
    fabric: "100% Pique Cotton",
    fit: "Kids Fit",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic boys polo shirt detailed with colorful chest stripes and signature logo embroidery."
  },
  {
    category: "Kids' Wear",
    subCategory: "Boys Clothing",
    brand: "Mothercare",
    name: "Mothercare Boys Graphic Printed Cotton T-Shirt",
    price: 799,
    discount: 25,
    unit: "1 Piece",
    stock: 50,
    sizes: [
      { size: "2-3Y", stock: 12 },
      { size: "4-5Y", stock: 18 },
      { size: "6-7Y", stock: 12 },
      { size: "8-9Y", stock: 8 }
    ],
    colors: ["#0284C7"],
    fabric: "Soft Organic Cotton",
    fit: "Regular Kids",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Fun dinosaur printed crewneck T-shirt crafted from hypoallergenic soft organic cotton."
  },
  {
    category: "Kids' Wear",
    subCategory: "Boys Clothing",
    brand: "Allen Solly Junior",
    name: "Allen Solly Junior Slim Fit Chino Shorts",
    price: 1099,
    discount: 35,
    unit: "1 Piece",
    stock: 40,
    sizes: [
      { size: "4-5Y", stock: 10 },
      { size: "6-7Y", stock: 15 },
      { size: "8-9Y", stock: 10 },
      { size: "10-11Y", stock: 5 }
    ],
    colors: ["#D4B896", "#1E3A5F"],
    fabric: "Cotton Twill Stretch",
    fit: "Comfort Shorts",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Smart summer chino shorts for boys with inner adjustable button elastic waist."
  },
  {
    category: "Kids' Wear",
    subCategory: "Boys Clothing",
    brand: "Puma Kids",
    name: "Puma Kids Hooded Fleece Tracksuit Set",
    price: 2499,
    discount: 20,
    unit: "1 Set",
    stock: 30,
    sizes: [
      { size: "4-5Y", stock: 8 },
      { size: "6-7Y", stock: 12 },
      { size: "8-9Y", stock: 6 },
      { size: "10-11Y", stock: 4 }
    ],
    colors: ["#000000", "#DC2626"],
    fabric: "Cotton Polyester Fleece",
    fit: "Active Set",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Warm 2-piece athletic tracksuit featuring zip hoodie jacket and elastic waistband sweatpants."
  },
  {
    category: "Kids' Wear",
    subCategory: "Boys Clothing",
    brand: "Gini & Jony",
    name: "Gini & Jony Denim Button-Down Casual Shirt",
    price: 1399,
    discount: 40,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "4-5Y", stock: 8 },
      { size: "6-7Y", stock: 12 },
      { size: "8-9Y", stock: 10 },
      { size: "10-11Y", stock: 5 }
    ],
    colors: ["#2563EB"],
    fabric: "Soft Lightweight Denim",
    fit: "Regular Kids",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Stylish washed denim shirt with contrast stitching for little gentlemen."
  },

  // ─────────────────────────────────────────────────────────────
  // 18. KIDS' WEAR - GIRLS CLOTHING (5 items)
  // ─────────────────────────────────────────────────────────────
  {
    category: "Kids' Wear",
    subCategory: "Girls Clothing",
    brand: "Mothercare",
    name: "Mothercare Girls Floral Print Party Dress",
    price: 1899,
    discount: 30,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "2-3Y", stock: 8 },
      { size: "4-5Y", stock: 12 },
      { size: "6-7Y", stock: 10 },
      { size: "8-9Y", stock: 5 }
    ],
    colors: ["#F472B6", "#FFFFFF"],
    fabric: "Cotton Sateen & Tulle",
    fit: "Fit & Flare",
    tags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Adorable floral sateen party dress finished with a big back bow sash."
  },
  {
    category: "Kids' Wear",
    subCategory: "Girls Clothing",
    brand: "H&M Kids",
    name: "H&M Kids Sparkly Tulle Princess Skirt",
    price: 999,
    discount: 20,
    unit: "1 Piece",
    stock: 45,
    sizes: [
      { size: "2-3Y", stock: 10 },
      { size: "4-5Y", stock: 15 },
      { size: "6-7Y", stock: 12 },
      { size: "8-9Y", stock: 8 }
    ],
    colors: ["#EC4899", "#C084FC"],
    fabric: "Glitter Tulle & Satin Lining",
    fit: "Elastic Waist Flared",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Whimsical glitter-infused multi-layer tulle tutu skirt with comfortable shiny waistband."
  },
  {
    category: "Kids' Wear",
    subCategory: "Girls Clothing",
    brand: "United Colors of Benetton",
    name: "United Colors of Benetton Girls Cotton Top & Short Set",
    price: 1599,
    discount: 35,
    unit: "1 Set",
    stock: 40,
    sizes: [
      { size: "4-5Y", stock: 10 },
      { size: "6-7Y", stock: 15 },
      { size: "8-9Y", stock: 10 },
      { size: "10-11Y", stock: 5 }
    ],
    colors: ["#F59E0B", "#10B981"],
    fabric: "100% Combed Cotton",
    fit: "Casual Set",
    tags: ["sale"],
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Bright 2-piece summer set consisting of printed cotton top and matching drawstring shorts."
  },
  {
    category: "Kids' Wear",
    subCategory: "Girls Clothing",
    brand: "Marks & Spencer",
    name: "Marks & Spencer Girls Denim Jumpsuit",
    price: 2199,
    discount: 25,
    unit: "1 Piece",
    stock: 25,
    sizes: [
      { size: "4-5Y", stock: 5 },
      { size: "6-7Y", stock: 10 },
      { size: "8-9Y", stock: 6 },
      { size: "10-11Y", stock: 4 }
    ],
    colors: ["#38BDF8"],
    fabric: "Soft Chambray Cotton Denim",
    fit: "Relaxed Jumpsuit",
    tags: ["new-arrival"],
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Charming lightweight denim dungaree jumpsuit featuring front buttons and elasticated ankle cuffs."
  },
  {
    category: "Kids' Wear",
    subCategory: "Girls Clothing",
    brand: "Gini & Jony",
    name: "Gini & Jony Printed Cotton A-Line Frock",
    price: 1199,
    discount: 40,
    unit: "1 Piece",
    stock: 35,
    sizes: [
      { size: "2-3Y", stock: 8 },
      { size: "4-5Y", stock: 12 },
      { size: "6-7Y", stock: 10 },
      { size: "8-9Y", stock: 5 }
    ],
    colors: ["#EF4444"],
    fabric: "100% Breathable Cotton",
    fit: "A-Line Frock",
    tags: ["trending"],
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Playful everyday printed cotton frock designed with flutter sleeves and round neck."
  }
];
