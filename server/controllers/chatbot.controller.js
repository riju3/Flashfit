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
                `* **Products**: Get recommendations on our latest collections (Shoes, Shirts, Hoodies & More)\n` +
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

        // 5. Strict Product Discovery Engine
        let targetType = null;
        let targetColor = null;

        // Detect target product category/type
        if (/dress/i.test(queryText)) targetType = 'dress';
        else if (/hoodie|sweatshirt/i.test(queryText)) targetType = 'hoodie';
        else if (/t-shirt|tshirt|tee/i.test(queryText)) targetType = 't-shirt';
        else if (/shirt/i.test(queryText)) targetType = 'shirt';
        else if (/shoe|sneaker|footwear|heel|boot/i.test(queryText)) targetType = 'shoe';
        else if (/bag|tote|handbag|backpack/i.test(queryText)) targetType = 'bag';
        else if (/watch/i.test(queryText)) targetType = 'watch';
        else if (/jeans|pant|trouser/i.test(queryText)) targetType = 'jeans';
        else if (/jacket|coat/i.test(queryText)) targetType = 'jacket';

        // Detect target color
        const colorMatch = queryText.match(/\b(red|blue|black|white|green|yellow|pink|brown|purple|grey|gray|orange)\b/i);
        if (colorMatch) targetColor = colorMatch[1].toLowerCase();

        let matchingProducts = [];
        const isProductQuery = targetType || /fashion|cloth|item|product|buy|price|under|find|recommend|show|look/i.test(queryText);

        if (isProductQuery) {
            let andConditions = [{ publish: true }];

            if (targetType) {
                const typeRegex = new RegExp(targetType, 'i');
                andConditions.push({
                    $or: [
                        { name: typeRegex },
                        { category_name: typeRegex },
                        { tags: typeRegex },
                        { description: typeRegex }
                    ]
                });
            }

            if (targetColor) {
                const colorRegex = new RegExp(targetColor, 'i');
                andConditions.push({
                    $or: [
                        { name: colorRegex },
                        { tags: colorRegex },
                        { description: colorRegex }
                    ]
                });
            }

            if (!targetType && !targetColor) {
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
                            { brand: { $in: regexes } },
                            { category_name: { $in: regexes } }
                        ]
                    });
                }
            }

            matchingProducts = await ProductModel.find({ $and: andConditions })
                .populate('category subCategory')
                .limit(6)
                .lean();
        }

        // 6. Formulate AI Response or fallback if products found/not found
        let productContextStr = '';
        if (matchingProducts.length > 0) {
            productContextStr = `\nEXACT MATCHING PRODUCTS FOUND IN FLASHFIT STORE:\n` +
                matchingProducts.map(p => `- ${p.name} (Brand: ${p.brand || 'FlashFit'}, Price: ₹${p.price}, Stock: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'})`).join('\n');
        } else if (targetType) {
            productContextStr = `\nNO PRODUCTS FOUND FOR TYPE: "${targetType}"${targetColor ? ` IN COLOR: "${targetColor}"` : ''}.\nState politely that we currently do not have ${targetColor ? targetColor + ' ' : ''}${targetType}s in stock. Do NOT suggest unrelated items like bags or watches.`;
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
1. ONLY recommend products listed in the "EXACT MATCHING PRODUCTS FOUND" section.
2. If NO products of the requested category are listed (or if targetType was not found), politely state that we currently do NOT have those items in stock.
3. NEVER suggest unrelated product types (for example, NEVER suggest bags or watches when the user asked for dresses, shirts, or shoes).
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

        // Fallback generator if Groq fails or API offline
        if (!aiReply) {
            if (matchingProducts.length > 0) {
                aiReply = `Here are the matching ${targetColor ? targetColor + ' ' : ''}${targetType || 'items'} I found in our FlashFit collection for you! 👇`;
            } else if (targetType) {
                const requestedItem = `${targetColor ? targetColor + ' ' : ''}${targetType}s`;
                aiReply = `🛍️ I searched our inventory for **${requestedItem}**, but we don't have any in stock right now. Feel free to check out our Shoes, Shirts, or Hoodies collections! 😊`;
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
