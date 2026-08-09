import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoClose, IoChatbubbleEllipsesSharp, IoRefreshOutline, IoBagAddOutline } from 'react-icons/io5';
import { FaRobot, FaPhoneAlt, FaTruck, FaUndo, FaTag, FaShoePrints } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import chatbotIcon from '../assets/chatbot_icon.png';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';

const Chatbot = () => {
    const user = useSelector(state => state.user);
    const userName = user?.name || '';
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

    // Check if Cart Drawer overlay is active in DOM
    useEffect(() => {
        const checkCartDrawer = () => {
            const cartModal = document.querySelector('section.fixed.top-0.bottom-0.right-0.left-0');
            setIsCartDrawerOpen(!!cartModal);
        };
        checkCartDrawer();
        const interval = setInterval(checkCartDrawer, 300);
        return () => clearInterval(interval);
    }, []);

    const pathname = (location.pathname || '').toLowerCase();

    // Hide chatbot on checkout, cart, payment, tracking, profile, admin, and auth pages
    const isHiddenPath = 
        pathname.includes('/checkout') ||
        pathname.includes('/cart') ||
        pathname.includes('/order-tracking') ||
        pathname.includes('/order-success') ||
        pathname.includes('/success') ||
        pathname.includes('/cancel') ||
        pathname.includes('/dashboard') ||
        pathname.includes('/login') ||
        pathname.includes('/register') ||
        pathname.includes('/forgot-password') ||
        pathname.includes('/reset-password') ||
        pathname.includes('/otp-verification') ||
        pathname.includes('/user');
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: `😊 Hello${userName ? ` ${userName}` : ''}! Welcome to FlashFit! I'm here to help you with anything you need.\n\n` +
                `Are you looking for some new fashion inspiration, or do you have a specific question about our products or services?\n\n` +
                `You can ask me about:\n` +
                `* **Products**: Get recommendations on our latest collections (Shoes, Dresses, Tops & More)\n` +
                `* **Orders**: Track your order status or get help with returns/exchanges\n` +
                `* **Shipping**: Get info on our delivery options and timelines\n\n` +
                `What's on your mind? 🤔`,
            products: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const chatEndRef = useRef(null);
    const navigate = useNavigate();
    const { fetchCartItem } = useGlobalContext();

    // Update greeting if user logs in dynamically
    useEffect(() => {
        if (userName && messages.length === 1 && messages[0].sender === 'bot') {
            setMessages([
                {
                    sender: 'bot',
                    text: `😊 Hello ${userName}! Welcome to FlashFit! I'm here to help you with anything you need.\n\n` +
                        `Are you looking for some new fashion inspiration, or do you have a specific question about our products or services?\n\n` +
                        `You can ask me about:\n` +
                        `* **Products**: Get recommendations on our latest collections (Shoes, Dresses, Tops & More)\n` +
                        `* **Orders**: Track your order status or get help with returns/exchanges\n` +
                        `* **Shipping**: Get info on our delivery options and timelines\n\n` +
                        `What's on your mind? 🤔`,
                    products: []
                }
            ]);
        }
    }, [userName]);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setHasUnread(false);
        }
    }, [messages, isOpen]);

    // Quick suggestion chips
    const suggestions = [
        { label: '📞 Customer Support', query: 'What is customer support number?' },
        { label: '👟 Find Shoes', query: 'Show me popular shoes' },
        { label: '👗 Find Dresses', query: 'Show me popular dresses for women' },
        { label: '🚚 Delivery & Shipping', query: 'What is the shipping and delivery policy?' }
    ];

    const sendMessage = async (textToSend) => {
        const query = textToSend || input.trim();
        if (!query || loading) return;

        const userMsg = { sender: 'user', text: query, products: [] };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.chatbot,
                data: {
                    message: query,
                    history: messages,
                    userName: userName
                }
            });

            if (response.data?.success) {
                const botMsg = {
                    sender: 'bot',
                    text: response.data.message || "I'm here to help!",
                    products: response.data.products || []
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: "Sorry, I couldn't process that right now. Please try asking again!",
                    products: []
                }]);
            }
        } catch (error) {
            console.error('Chatbot API Error:', error);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "📞 Our Customer Care is available at **+91 1800-123-4567** (Mon-Sat 9AM-8PM) or email **support@flashfit.app**!",
                products: []
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: { productId }
            });
            if (response.data.success) {
                toast.success("Added to cart! 🛒");
                fetchCartItem();
            }
        } catch (err) {
            toast.error("Please login to add items to cart!");
        }
    };

    const resetChat = () => {
        setMessages([
            {
                sender: 'bot',
                text: "Chat history cleared! How can I assist you with FlashFit today? 🛍️",
                products: []
            }
        ]);
    };

    // Simple renderer for bold formatting & bullet points
    const renderFormattedText = (text) => {
        if (!text) return null;
        const lines = text.split('\n');
        return lines.map((line, lIdx) => {
            // Check for bold text **text**
            const parts = line.split(/(\*\*.*?\*\*)/g);
            const formattedLine = parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            return (
                <span key={lIdx} className="block min-h-[1.2em] mb-1">
                    {formattedLine}
                </span>
            );
        });
    };

    if (isHiddenPath || isCartDrawerOpen) return null;

    return (
        <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end">
            {/* Expanded Chatbot Modal */}
            {isOpen && (
                <div className="w-[360px] sm:w-[420px] h-[540px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 mb-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-4 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-white/20 p-1 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                <img src={chatbotIcon} alt="AI Assistant" className="w-full h-full object-contain" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base tracking-wide flex items-center gap-1.5 leading-tight">
                                    FlashFit AI <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">Groq Powered</span>
                                </h3>
                                <p className="text-xs text-orange-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span> Online • 24/7 Support
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={resetChat}
                                title="Reset Conversation"
                                className="p-2 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-colors"
                            >
                                <IoRefreshOutline className="text-lg" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close Chat"
                                className="p-2 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-colors"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="bg-orange-50/60 p-2.5 border-b border-orange-100 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(s.query)}
                                className="whitespace-nowrap text-xs font-semibold bg-white hover:bg-orange-600 hover:text-white text-gray-700 px-3 py-1.5 rounded-full border border-orange-200/80 shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Message Container */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-end gap-2 max-w-[88%]">
                                    {msg.sender === 'bot' && (
                                        <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 mb-1">
                                            <img src={chatbotIcon} alt="Bot" className="w-5 h-5 object-contain" />
                                        </div>
                                    )}

                                    <div
                                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-br-none font-medium'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                                        }`}
                                    >
                                        {renderFormattedText(msg.text)}
                                    </div>
                                </div>

                                {/* Render Product Cards if matching products returned */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="w-full mt-3 grid grid-cols-2 gap-2 pl-9">
                                        {msg.products.map(product => (
                                            <div
                                                key={product._id}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate(`/product/${product._id}`);
                                                }}
                                                className="bg-white rounded-xl border border-gray-200 p-2 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                                            >
                                                <div className="relative w-full h-24 bg-gray-50 rounded-lg overflow-hidden mb-2">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                                    )}
                                                    {product.discount > 0 && (
                                                        <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            {product.discount}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div>
                                                            <span className="text-xs font-extrabold text-gray-900">₹{product.price}</span>
                                                            {product.original_price > product.price && (
                                                                <span className="text-[10px] text-gray-400 line-through ml-1">₹{product.original_price}</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, product._id)}
                                                            title="Add to Cart"
                                                            className="p-1.5 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <IoBagAddOutline className="text-sm" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading Typing Indicator */}
                        {loading && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs pl-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                    <img src={chatbotIcon} alt="Bot" className="w-4 h-4 object-contain animate-spin" />
                                </div>
                                <span className="flex items-center gap-1 font-medium bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-xs">
                                    FlashFit AI is thinking
                                    <span className="flex gap-0.5 ml-1">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </span>
                                </span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about products, orders, or support..."
                            className="flex-1 bg-slate-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={`p-2.5 rounded-full text-white transition-all shadow-md flex items-center justify-center shrink-0 ${
                                input.trim() && !loading
                                    ? 'bg-orange-600 hover:bg-orange-500 cursor-pointer shadow-orange-200'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <IoSend className="text-base" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Chat Trigger Button (Apple-Style Glassmorphism Effect) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group p-3 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.28)',
                    backdropFilter: 'blur(10px) saturate(100%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(100%)',
                    border: '1.5px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 35px 0 rgba(255, 77, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.5)'
                }}
                title="FlashFit AI Assistant"
            >
                {/* Apple Glass Radiant Aura Pulse Ring */}
                <span
                    className="absolute -inset-1.5 rounded-full animate-ping opacity-70 group-hover:opacity-100 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 77, 0, 0.45), rgba(233, 69, 96, 0.45), rgba(255, 255, 255, 0.7))',
                        filter: 'blur(4px)'
                    }}
                ></span>

                <img
                    src={chatbotIcon}
                    alt="AI Chatbot Icon"
                    className="w-10 h-10 object-contain drop-shadow-md relative z-10"
                />

                {/* Unread Badge */}
                {hasUnread && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-white z-20 animate-bounce">
                        1
                    </span>
                )}

                {/* Hover Tooltip */}
                {!isOpen && (
                    <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1">
                        Need Help? Chat with AI 🤖
                    </span>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
