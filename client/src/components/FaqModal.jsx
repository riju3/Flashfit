import React, { useState } from 'react'
import { FiX, FiHelpCircle, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi'

const FAQS_DATABASE = [
  {
    category: "Orders & Delivery",
    questions: [
      {
        q: "How fast is FlashFit express delivery?",
        a: "All orders placed on FlashFit are dispatched immediately from local darkstores and delivered directly to your doorstep within 30 minutes."
      },
      {
        q: "How can I track my live order status?",
        a: "Go to your My Orders section or click 'Track Order' in the footer to view your rider's real-time location on the map."
      },
      {
        q: "Can I cancel my order after placing it?",
        a: "Yes! Orders can be cancelled anytime before doorstep delivery for a 100% full refund with instant processing."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is FlashFit's return and size exchange policy?",
        a: "We offer a 7-day hassle-free return and exchange window. If a size doesn't fit, request a doorstep exchange in seconds."
      },
      {
        q: "Are return pickup fees charged?",
        a: "No! All return pickups and size exchanges are 100% free of charge."
      }
    ]
  },
  {
    category: "Payments & Refunds",
    questions: [
      {
        q: "What payment methods are supported?",
        a: "We support Instant UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Cash on Delivery (COD)."
      },
      {
        q: "How long does a prepaid refund take?",
        a: "Prepaid refunds process automatically upon cancellation and credit back to your bank account within 24 hours."
      }
    ]
  },
  {
    category: "Quality & Authenticity",
    questions: [
      {
        q: "Are all products 100% original and authentic?",
        a: "Yes! Every fashion apparel and footwear on FlashFit is directly sourced from brand partners with rigorous quality checks."
      }
    ]
  }
]

const FaqModal = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState('0-0')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-sm">
              <FiHelpCircle size={22} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-fashion-dark">FlashFit FAQs & Help Center</h2>
              <p className="text-xs text-fashion-gray">Quick answers to all your shopping questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-fashion-dark flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search questions (e.g. refund, size, delivery)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4 pt-1">
          {FAQS_DATABASE.map((cat, catIdx) => {
            const filteredQuestions = cat.questions.filter(item =>
              item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.a.toLowerCase().includes(searchQuery.toLowerCase())
            )

            if (filteredQuestions.length === 0) return null

            return (
              <div key={catIdx} className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 border-b border-orange-100 pb-1">
                  {cat.category}
                </h3>

                <div className="space-y-2">
                  {filteredQuestions.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`
                    const isOpenFaq = openIndex === key

                    return (
                      <div
                        key={itemIdx}
                        className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50 transition-all hover:border-orange-200"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpenFaq ? null : key)}
                          className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-fashion-dark cursor-pointer"
                        >
                          <span>{item.q}</span>
                          <span className="text-orange-500 shrink-0">
                            {isOpenFaq ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </span>
                        </button>

                        {isOpenFaq && (
                          <div className="px-3.5 pb-3.5 pt-1 text-xs text-fashion-gray leading-relaxed border-t border-gray-100 bg-white">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default FaqModal
