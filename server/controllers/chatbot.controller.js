import Groq from 'groq-sdk';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import SettingsModel from '../models/settings.model.js';
import dotenv from 'dotenv';
dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

export async function chatbotController(req, res) {
    try {
        const { message, history = [], userName = '' } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                message: 'Please provide a valid text message',
                error: true,
                success: false
            });
        }

        const queryText = message.toLowerCase().trim();

        // 1. Fetch real store settings from MongoDB (Admin-managed settings)
        const storeSettings = await SettingsModel.findOne().lean();
        const supportPhone = storeSettings?.supportPhone || "+91 98765 43210";
        const supportEmail = storeSettings?.supportEmail || "support@flashfit.com";
        const storeAddress = storeSettings?.storeAddress || "42 Fashion Street, Mumbai, MH 400001";

        // 2. Direct Handler for "hi", "hello", "hey", "greetings"
        const isGreeting = /^(hi|hello|hey|hola|greetings|good morning|good evening|good afternoon)(\s+.*)?$/i.test(queryText);
        if (isGreeting) {
            const namePart = userName ? ` ${userName}` : '';
            const welcomeText = `😊 Hello${namePart}! Welcome to FlashFit! I'm here to help you with anything you need.\n\n` +
                `Are you looking for some new fashion inspiration, or do you have a specific question about our products or services?\n\n` +
                `You can ask me about:\n` +
                `* **Products**: Get recommendations on our latest collections (Shoes, Shirts, Dresses, Hoodies & More)\n` +
                `* **Orders**: Track your order status or get help with returns/exchanges\n` +
                `* **Shipping**: Get info on our 30-minute express delivery options\n\n` +
                `What's on your mind? 🤔`;

            return res.json({
                message: welcomeText,
                products: [],
                success: true,
                error: false
            });
        }

        // 3. Direct Handler for Customer Support Query (Using real DB values)
        const isSupportQuery = /customer support|customer care|contact|phone|call|support number|helpdesk/i.test(queryText);
        if (isSupportQuery) {
            const supportText = `📞 Our customer support number is: **${supportPhone}** (Mon-Sat, 9:00 AM - 8:00 PM IST)\n\n` +
                `You can also reach us on:\n` +
                `* **WhatsApp**: ${supportPhone}\n` +
                `* **Email**: ${supportEmail}\n` +
                `* **Store Address**: ${storeAddress}\n` +
                `* **Live Chat**: Available 24/7 right here! 📲\n\n` +
                `Feel free to contact us anytime for assistance! 😊`;

            return res.json({
                message: supportText,
                products: [],
                success: true,
                error: false
            });
        }

        // 4. Direct Handler for 30-Minute Express Delivery & Shipping Information
        const isShippingQuery = /ship|delivery|track|order status|timeline|when will i get|how long/i.test(queryText);
        if (isShippingQuery) {
            const shippingText = `⚡ **FlashFit Express 30-Minute Delivery**:\n\n` +
                `• **Express 30-Min Delivery**: Delivered to your doorstep in just **30 minutes**!\n` +
                `• **Free Express Shipping**: On all orders over ₹499.\n` +
                `• **Real-Time Live Order Tracking**: Track your delivery rider in real time under **My Profile → My Orders**.\n\n` +
                `For any urgent delivery assistance, call customer care at **${supportPhone}**! 🚀`;

            return res.json({
                message: shippingText,
                products: [],
                success: true,
                error: false
            });
        }

        // 5. Advanced Natural Language NLP Constraint & Intent Parser
        let targetType = null;
        let targetColor = null;
        let targetBrand = null;
        let targetSize = null;
        let targetGender = null;
        let maxPrice = null;
        let minPrice = null;
        let targetTag = null;

        // A. Extract Price Constraints (under 999, below 1000, less than 500, between 1000 and 3000, 1k, etc.)
        const maxPriceMatch = queryText.match(/(?:under|below|less than|under rs\.?|under ₹)\s*(\d+)/i) ||
                             queryText.match(/\b(\d+)\s*(?:rs|rupees|inr|\s*under|\s*below)\b/i) ||
                             queryText.match(/under\s*(\d+)k/i);

        if (maxPriceMatch) {
            let val = parseInt(maxPriceMatch[1], 10);
            if (queryText.includes('k') && val < 100) val *= 1000;
            maxPrice = val;
        }

        const minPriceMatch = queryText.match(/(?:above|over|more than|greater than)\s*(\d+)/i);
        if (minPriceMatch) {
            minPrice = parseInt(minPriceMatch[1], 10);
        }

        const rangePriceMatch = queryText.match(/(?:between|from)\s*(\d+)\s*(?:and|to|-)\s*(\d+)/i);
        if (rangePriceMatch) {
            minPrice = parseInt(rangePriceMatch[1], 10);
            maxPrice = parseInt(rangePriceMatch[2], 10);
        }

        // B. Extract Gender Intent
        if (/\b(women|woman|female|ladies|lady|girl|girls)\b/i.test(queryText)) targetGender = 'women';
        else if (/\b(men|man|male|gents|gentlemen|boy|boys)\b/i.test(queryText)) targetGender = 'men';

        // C. Extract Category / Item Type
        if (/dress/i.test(queryText)) targetType = 'dress';
        else if (/hoodie|sweatshirt/i.test(queryText)) targetType = 'hoodie';
        else if (/t-shirt|tshirt|tee/i.test(queryText)) targetType = 't-shirt';
        else if (/shirt/i.test(queryText)) targetType = 'shirt';
        else if (/shoe|sneaker|footwear|heel|boot/i.test(queryText)) targetType = 'shoe';
        else if (/bag|tote|handbag|backpack/i.test(queryText)) targetType = 'bag';
        else if (/watch/i.test(queryText)) targetType = 'watch';
        else if (/jeans|pant|trouser/i.test(queryText)) targetType = 'jeans';
        else if (/jacket|coat/i.test(queryText)) targetType = 'jacket';

        // D. Extract Color
        const colorMatch = queryText.match(/\b(red|blue|black|white|green|yellow|pink|brown|purple|grey|gray|orange|olive|navy)\b/i);
        if (colorMatch) targetColor = colorMatch[1].toLowerCase();

        // E. Extract Brand
        const brandMatch = queryText.match(/\b(woodland|nike|adidas|puma|zara|mango|vans|casio|levis|levi|tommy|polo|raymond|arrow|mufti|forever 21|vero moda|cover story|lavie|roadster|hrx|allen solly)\b/i);
        if (brandMatch) targetBrand = brandMatch[1].toLowerCase();

        // F. Extract Size
        const sizeMatch = queryText.match(/\b(uk\s*\d+|xs|s|m|l|xl|xxl|xxxl)\b/i);
        if (sizeMatch) targetSize = sizeMatch[1].toUpperCase();

        // G. Extract Tag Intent
        if (/trending|popular/i.test(queryText)) targetTag = 'trending';
        else if (/best seller|bestseller/i.test(queryText)) targetTag = 'best-seller';
        else if (/new arrival|latest/i.test(queryText)) targetTag = 'new-arrival';
        else if (/sale|discount/i.test(queryText)) targetTag = 'sale';

        let matchingProducts = [];
        const isProductQuery = targetType || targetBrand || targetColor || targetSize || targetGender || maxPrice !== null || minPrice !== null || targetTag || /fashion|cloth|item|product|buy|price|under|find|recommend|show|look/i.test(queryText);

        if (isProductQuery) {
            let andConditions = [{ publish: true }];

            // Price filtering
            if (maxPrice !== null || minPrice !== null) {
                let priceCond = {};
                if (maxPrice !== null) priceCond.$lte = maxPrice;
                if (minPrice !== null) priceCond.$gte = minPrice;
                andConditions.push({ price: priceCond });
            }

            // Gender filtering
            if (targetGender === 'women') {
                const genderRegex = /women|female|ladies|lady|dress|skirt|heel|tote/i;
                andConditions.push({
                    $or: [
                        { name: genderRegex },
                        { category_name: genderRegex },
                        { description: genderRegex },
                        { tags: genderRegex }
                    ]
                });
            } else if (targetGender === 'men') {
                const genderRegex = /men|male|gents|gentlemen|boy/i;
                andConditions.push({
                    $or: [
                        { name: genderRegex },
                        { category_name: genderRegex },
                        { description: genderRegex },
                        { tags: genderRegex }
                    ]
                });
            }

            // Category/Type filtering
            if (targetType) {
                const typeRegex = new RegExp(targetType, 'i');
                andConditions.push({
                    $or: [
                        { name: typeRegex },
                        { category_name: typeRegex },
                        { tags: typeRegex },
                        { keywords: typeRegex },
                        { description: typeRegex }
                    ]
                });
            }

            // Color filtering (Uses strict word boundary \b to prevent matching substrings like "tiered", "structured", "layered")
            if (targetColor) {
                const colorBoundRegex = new RegExp(`\\b${targetColor}\\b`, 'i');
                andConditions.push({
                    $or: [
                        { color: colorBoundRegex },
                        { colors: colorBoundRegex },
                        { keywords: colorBoundRegex },
                        { name: colorBoundRegex }
                    ]
                });
            }

            // Brand filtering
            if (targetBrand) {
                const brandRegex = new RegExp(targetBrand, 'i');
                andConditions.push({
                    $or: [
                        { brand: brandRegex },
                        { name: brandRegex },
                        { keywords: brandRegex },
                        { description: brandRegex }
                    ]
                });
            }

            // Size filtering
            if (targetSize) {
                const sizeRegex = new RegExp(targetSize, 'i');
                andConditions.push({
                    $or: [
                        { "sizes.size": sizeRegex },
                        { unit: sizeRegex }
                    ]
                });
            }

            // Tag filtering
            if (targetTag) {
                andConditions.push({
                    $or: [
                        { tags: targetTag },
                        { keywords: targetTag }
                    ]
                });
            }

            // General keyword search if no specific attributes detected
            if (!targetType && !targetColor && !targetBrand && !targetSize && !targetGender && maxPrice === null && minPrice === null && !targetTag) {
                const words = queryText
                    .replace(/[^a-zA-Z0-9\s]/g, '')
                    .split(/\s+/)
                    .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'under', 'show', 'find', 'give', 'need', 'want', 'some', 'looking'].includes(w));

                if (words.length > 0) {
                    const regexes = words.map(w => new RegExp(w, 'i'));
                    andConditions.push({
                        $or: [
                            { name: { $in: regexes } },
                            { description: { $in: regexes } },
                            { tags: { $in: regexes } },
                            { keywords: { $in: regexes } },
                            { brand: { $in: regexes } },
                            { category_name: { $in: regexes } }
                        ]
                    });
                }
            }

            matchingProducts = await ProductModel.find({ $and: andConditions })
                .populate('category subCategory')
                .sort({ price: 1 }) // Sort ascending by price so cheaper items show first for 'under X' queries
                .limit(6)
                .lean();
        }

        // 6. Formulate AI Response Summary
        const searchedQuerySummaryParts = [
            targetGender ? `for ${targetGender}` : '',
            targetBrand ? `brand "${targetBrand}"` : '',
            targetColor ? `color "${targetColor}"` : '',
            targetSize ? `size "${targetSize}"` : '',
            maxPrice !== null ? `under ₹${maxPrice}` : '',
            minPrice !== null ? `above ₹${minPrice}` : '',
            targetType ? targetType : 'products'
        ].filter(Boolean);

        const searchedQuerySummary = searchedQuerySummaryParts.length > 0 ? searchedQuerySummaryParts.join(' ') : 'items';

        let productContextStr = '';
        if (matchingProducts.length > 0) {
            productContextStr = `\nEXACT MATCHING PRODUCTS FOUND IN FLASHFIT STORE FOR (${searchedQuerySummary}):\n` +
                matchingProducts.map(p => `- ${p.name} (Brand: ${p.brand || 'FlashFit'}, Color: ${p.color || 'N/A'}, Price: ₹${p.price}, Stock: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'})`).join('\n');
        } else if (targetType || targetBrand || targetColor || maxPrice !== null) {
            productContextStr = `\nNO PRODUCTS FOUND IN STORE MATCHING: "${searchedQuerySummary}".\nState politely that we currently do not have ${searchedQuerySummary} in stock right now. Do NOT recommend unrelated product categories.`;
        }

        let aiReply = '';

        if (groq) {
            try {
                const dynamicSystemPrompt = `
You are "FlashFit AI Assistant", the friendly, expert shopping assistant for FlashFit.
FlashFit is an EXPRESS 30-MINUTE DELIVERY fashion & lifestyle store.
Current User's Name: ${userName || 'Customer'}

REAL STORE CONTACT DETAILS:
- Phone: ${supportPhone}
- Email: ${supportEmail}
- Address: ${storeAddress}
- Delivery Time: Express 30 Minutes!

CRITICAL PRODUCT MATCHING RULES:
1. ONLY recommend products explicitly listed in the "EXACT MATCHING PRODUCTS FOUND" section.
2. If NO products are listed in that section, politely state that we currently do NOT have ${searchedQuerySummary} in stock right now.
3. NEVER suggest unrelated product types (for example, NEVER suggest bags or watches when the user asked for dresses, shirts, shoes, or items under a specific price).
`;

                const messagesPayload = [
                    { role: 'system', content: `${dynamicSystemPrompt}\n${productContextStr}` }
                ];

                const recentHistory = history.slice(-4);
                recentHistory.forEach(h => {
                    if (h.sender === 'user') {
                        messagesPayload.push({ role: 'user', content: h.text });
                    } else if (h.sender === 'bot') {
                        messagesPayload.push({ role: 'assistant', content: h.text });
                    }
                });

                messagesPayload.push({ role: 'user', content: message });

                const chatCompletion = await groq.chat.completions.create({
                    messages: messagesPayload,
                    model: 'llama-3.3-70b-versatile',
                    temperature: 0.5,
                    max_tokens: 400,
                });

                aiReply = chatCompletion.choices[0]?.message?.content || '';
            } catch (groqErr) {
                console.error('⚠️ [Groq API Warning]:', groqErr?.message || groqErr);
            }
        }

        // Fallback generator if Groq fails or offline
        if (!aiReply) {
            if (matchingProducts.length > 0) {
                aiReply = `Here are the matching ${searchedQuerySummary} I found in our FlashFit collection for you! 👇`;
            } else if (targetType || targetBrand || targetColor || maxPrice !== null) {
                aiReply = `🛍️ I searched our inventory for **${searchedQuerySummary}**, but we don't have any matching items in stock right now. Feel free to check our other collections! 😊`;
            } else {
                aiReply = `Hello ${userName || ''}! How can I assist you with your FlashFit shopping today? 😊`;
            }
        }

        const formattedProducts = matchingProducts.map(p => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            original_price: p.original_price || p.price,
            discount: p.discount || 0,
            image: (p.image && p.image.length > 0) ? p.image[0] : '',
            brand: p.brand || 'FlashFit',
            color: p.color || '',
            size_stock: p.size_stock || []
        }));

        return res.json({
            message: aiReply,
            products: formattedProducts,
            success: true,
            error: false
        });

    } catch (error) {
        console.error('❌ [Chatbot Controller Exception]:', error);
        return res.status(500).json({
            message: 'Sorry, I ran into an error processing your request. Please try again!',
            error: true,
            success: false
        });
    }
}
