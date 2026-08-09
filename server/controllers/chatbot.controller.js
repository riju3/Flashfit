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
                `* **Products**: Get recommendations on our latest collections (Shoes, Dresses, Tops & More)\n` +
                `* **Orders**: Track your order status or get help with returns/exchanges\n` +
                `* **Shipping**: Get info on our delivery options and timelines\n\n` +
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

        // 4. Direct Handler for Shipping & Delivery Information
        const isShippingQuery = /ship|delivery|track|order status|timeline|when will i get/i.test(queryText);
        if (isShippingQuery) {
            const shippingText = `🚚 **Shipping & Delivery Information**:\n\n` +
                `• **Free Standard Delivery**: On all orders over ₹499.\n` +
                `• **Delivery Timelines**: 3-5 business days across India.\n` +
                `• **Order Tracking**: You can view real-time order tracking under **My Profile → My Orders**.\n\n` +
                `For urgent queries, feel free to contact customer care at **${supportPhone}**! 😊`;

            return res.json({
                message: shippingText,
                products: [],
                success: true,
                error: false
            });
        }

        // 5. Search DB for matching products if query looks product-related
        let matchingProducts = [];
        const isProductQuery = /shoe|shirt|dress|t-shirt|pant|jeans|jacket|coat|watch|bag|wallet|sneaker|heel|boot|kid|men|women|fashion|cloth|item|product|buy|price|under|find|recommend|show|look/i.test(queryText);

        if (isProductQuery) {
            const words = queryText
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'under', 'show', 'find', 'give', 'need', 'want', 'some', 'looking'].includes(w));

            let filter = { publish: true };
            if (words.length > 0) {
                const regexes = words.map(w => new RegExp(w, 'i'));
                filter.$or = [
                    { name: { $in: regexes } },
                    { description: { $in: regexes } },
                    { tags: { $in: regexes } },
                    { brand: { $in: regexes } },
                    { category_name: { $in: regexes } }
                ];
            }

            matchingProducts = await ProductModel.find(filter)
                .populate('category subCategory')
                .limit(6)
                .lean();
        }

        // Prepare product context string
        let productContextStr = '';
        if (matchingProducts.length > 0) {
            productContextStr = `\nAVAILABLE PRODUCTS IN STORE MATCHING USER QUERY:\n` +
                matchingProducts.map(p => `- ${p.name} (Brand: ${p.brand || 'FlashFit'}, Price: ₹${p.price}, Stock: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'})`).join('\n');
        }

        let aiReply = '';

        // 6. Call Groq API with live store settings context
        if (groq) {
            try {
                const dynamicSystemPrompt = `
You are "FlashFit AI Assistant", the friendly, expert shopping assistant for FlashFit (online fashion & lifestyle store).
Current User's Name: ${userName || 'Customer'}

REAL STORE CONTACT DETAILS (Fetched from database - use EXACTLY these when asked):
- Customer Support Phone: ${supportPhone}
- Support Email: ${supportEmail}
- Store Address: ${storeAddress}
- Hours: Mon-Sat, 9:00 AM - 8:00 PM IST

POLICIES:
- 7-Day Easy Return & Exchange policy on unworn items.
- Free Shipping on orders over ₹499 (3-5 days delivery).

INSTRUCTIONS:
- Be polite, concise, and helpful. Use emojis!
- When asked for contact or customer care, ALWAYS use phone: ${supportPhone} and email: ${supportEmail}.
- Do NOT talk about coupons or discount codes.
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
                    temperature: 0.7,
                    max_tokens: 500,
                });

                aiReply = chatCompletion.choices[0]?.message?.content || '';
            } catch (groqErr) {
                console.error('⚠️ [Groq API Warning]:', groqErr?.message || groqErr);
            }
        }

        // Fallback response engine if Groq fails or offline
        if (!aiReply) {
            if (/return|exchange|refund|cancel/i.test(queryText)) {
                aiReply = `🔄 **Return & Refund Policy**:\n\n` +
                    `• We offer a **7-Day Easy Return & Exchange** policy!\n` +
                    `• Size exchanges are **100% FREE**.\n\n` +
                    `👉 To start a return: Go to **My Profile -> My Orders** and click on "Return / Exchange".`;
            } else if (matchingProducts.length > 0) {
                aiReply = `Here are some great matching items I found in our FlashFit collection for you! 👇`;
            } else {
                aiReply = `Hello ${userName || ''}! How can I assist you with your shopping at FlashFit today? 😊`;
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
