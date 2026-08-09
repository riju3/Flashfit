import Groq from 'groq-sdk';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import dotenv from 'dotenv';
dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

// System context provided to AI for store policies and info
const SYSTEM_STORE_CONTEXT = `
You are "FlashFit AI Assistant", the friendly, expert shopping assistant and customer support helper for FlashFit (an online fashion & lifestyle store).

KEY STORE INFORMATION & POLICIES:
1. CUSTOMER SERVICE CONTACT:
   - Toll-Free Phone: +91 1800-123-4567 (Mon-Sat, 9:00 AM - 8:00 PM IST)
   - WhatsApp Support: +91 98765-43210
   - Email: support@flashfit.app / help@flashfit.com
   - Live Chat: Available 24/7 right here!

2. SHIPPING & DELIVERY:
   - Free Standard Shipping on all orders above ₹499.
   - Delivery Time: 3-5 business days across all major Indian cities.
   - Express Delivery available in select metro cities (1-2 days).

3. RETURNS, EXCHANGES & REFUNDS:
   - 7-Day Easy Return & Exchange policy on all unworn items with original tags.
   - Size exchanges are 100% FREE!
   - Refunds are processed to original payment method or FlashFit Wallet within 48 hours of item pickup.
   - How to return: Go to My Profile -> My Orders -> Click "Return / Exchange".

4. OFFERS & COUPONS:
   - Use code "FLASH20" for 20% OFF on your first purchase!
   - Use code "FIT500" for ₹500 OFF on orders above ₹2,999.

5. PAYMENT OPTIONS:
   - Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking.

INSTRUCTIONS:
- Be polite, enthusiastic, concise, and helpful. Use emojis appropriately!
- Format answers cleanly with bullet points or bold text when appropriate.
- If asked for products, summarize top recommended choices based on the product context provided below.
`;

export async function chatbotController(req, res) {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                message: 'Please provide a valid text message',
                error: true,
                success: false
            });
        }

        const queryText = message.toLowerCase().trim();

        // 1. Search DB for matching products if query looks product-related
        let matchingProducts = [];
        const isProductQuery = /shoe|shirt|dress|t-shirt|pant|jeans|jacket|coat|watch|bag|wallet|sneaker|heel|boot|kid|men|women|fashion|cloth|item|product|buy|price|under|find|recommend|show|look/i.test(queryText);

        if (isProductQuery) {
            // Extract potential keywords
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

        // 2. Prepare Product context string for AI model
        let productContextStr = '';
        if (matchingProducts.length > 0) {
            productContextStr = `\nAVAILABLE PRODUCTS IN STORE MATCHING USER QUERY:\n` +
                matchingProducts.map(p => `- ${p.name} (Brand: ${p.brand || 'FlashFit'}, Category: ${p.category_name || 'Fashion'}, Price: ₹${p.price}, Original Price: ₹${p.original_price || p.price}, Stock: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'})`).join('\n');
        }

        let aiReply = '';

        // 3. Call Groq API if API Key is available
        if (groq) {
            try {
                // Build messages array
                const messagesPayload = [
                    {
                        role: 'system',
                        content: `${SYSTEM_STORE_CONTEXT}\n${productContextStr}`
                    }
                ];

                // Append last 4 conversation turns for memory
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

        // 4. Smart Fallback Generator if Groq is not configured or failed
        if (!aiReply) {
            if (/phone|contact|number|call|support|helpdesk|customer service|customer care/i.test(queryText)) {
                aiReply = `📞 **FlashFit Customer Care Contact Info**:\n\n` +
                    `• **Toll-Free Phone**: +91 1800-123-4567\n` +
                    `• **WhatsApp Support**: +91 98765-43210\n` +
                    `• **Email**: support@flashfit.app\n` +
                    `• **Hours**: Mon-Sat (9:00 AM - 8:00 PM IST)\n\n` +
                    `Feel free to ask me any questions about your orders, returns, or product recommendations! 😊`;
            } else if (/return|exchange|refund|cancel/i.test(queryText)) {
                aiReply = `🔄 **Return & Refund Policy**:\n\n` +
                    `• We offer a **7-Day Easy Return & Exchange** policy!\n` +
                    `• Items must be unworn with original tags attached.\n` +
                    `• Size exchanges are **100% FREE**.\n\n` +
                    `👉 To start a return: Go to **My Profile -> My Orders** and click on "Return / Exchange".`;
            } else if (/ship|delivery|track|order status|when will i get/i.test(queryText)) {
                aiReply = `🚚 **Shipping & Delivery Information**:\n\n` +
                    `• **Standard Delivery**: 3-5 business days across India.\n` +
                    `• **Free Shipping**: On all orders over ₹499.\n` +
                    `• **Tracking**: You can track live status under **My Orders** page.`;
            } else if (/coupon|discount|offer|code/i.test(queryText)) {
                aiReply = `🎉 **Current Exclusive Offers**:\n\n` +
                    `1. **FLASH20** - Get 20% OFF on your first purchase!\n` +
                    `2. **FIT500** - Flat ₹500 OFF on orders above ₹2,999.\n\n` +
                    `Apply coupon code at checkout! 🛍️`;
            } else if (matchingProducts.length > 0) {
                aiReply = `Here are some great matching items I found in our FlashFit collection for you! 👇`;
            } else {
                aiReply = `Hi there! I'm your **FlashFit AI Assistant**! 🤖✨\n\n` +
                    `I can help you with:\n` +
                    `• 👟 Finding products, shoes, and clothing\n` +
                    `• 📞 Customer support number & email\n` +
                    `• 📦 Order tracking & delivery times\n` +
                    `• 🔄 Returns, exchanges, and refunds\n` +
                    `• 🏷️ Discounts & coupon codes\n\n` +
                    `How can I assist you today?`;
            }
        }

        // Format product data for frontend response
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
