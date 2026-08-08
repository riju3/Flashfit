import React, { useEffect, useState } from 'react'
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiPhoneCall, FiMail, FiX, FiCheckCircle } from 'react-icons/fi'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const FAQ_LIST = [
  {
    q: "What is the cancellation policy?",
    a: "Orders can be cancelled anytime before doorstep delivery for a 100% full refund. Prepaid refunds automatically credit back to your bank within 24 hours."
  },
  {
    q: "What is the return & exchange policy?",
    a: "We offer a 7-day hassle-free return and size exchange policy from the date of delivery. Items must be unused with original tags intact."
  },
  {
    q: "How fast is express delivery?",
    a: "Our express darkstores dispatch orders immediately, delivering directly to your doorstep within 30 minutes."
  },
  {
    q: "How do prepaid order refunds work?",
    a: "Refunds for UPI, Credit/Debit cards, or NetBanking process instantly upon cancellation and reflect in your account within 24 hours."
  },
  {
    q: "How can I track my live order?",
    a: "You can track your rider in real time by clicking 'Track Order' in the menu or navigating to your My Orders dashboard."
  },
  {
    q: "Are all products 100% original & authentic?",
    a: "Yes! Every fashion product on FlashFit is 100% genuine, sourced directly from verified brand partners, and quality-checked before packing."
  }
]

const CustomerSupportModal = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState(null)
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210')
  const [supportEmail, setSupportEmail] = useState('support@flashfit.com')

  useEffect(() => {
    const fetchSupportContact = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getSettings })
        if (response.data?.success && response.data?.data) {
          if (response.data.data.supportPhone) setSupportPhone(response.data.data.supportPhone)
          if (response.data.data.supportEmail) setSupportEmail(response.data.data.supportEmail)
        }
      } catch (_) {}
    }
    if (isOpen) {
      fetchSupportContact()
    }
  }, [isOpen])

  if (!isOpen) return null

  const cleanPhone = supportPhone.replace(/[^0-9+]/g, '')

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-sm">
              <FiHelpCircle size={22} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-fashion-dark">FlashFit 24/7 Customer Support</h2>
              <p className="text-xs text-fashion-gray">Instant help with orders, returns & cancellations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-fashion-dark flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-2.5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-fashion-dark mb-1">
            Frequently Asked Questions
          </p>

          {FAQ_LIST.map((faq, idx) => {
            const isOpenFaq = openFaq === idx
            return (
              <div
                key={idx}
                className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all bg-gray-50/40 hover:border-orange-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpenFaq ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-fashion-dark cursor-pointer select-none"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <span className="text-orange-500 shrink-0">
                    {isOpenFaq ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </span>
                </button>

                {isOpenFaq && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-fashion-gray leading-relaxed border-t border-gray-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ISSUE NOT LISTED HERE SECTION */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-5 rounded-2xl text-white space-y-3.5 shadow-md">
          <div>
            <h3 className="font-extrabold text-sm">Issue Not Listed Here?</h3>
            <p className="text-xs text-orange-100 mt-0.5">Reach out to our express customer care team directly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* CALL SUPPORT BUTTON */}
            <a
              href={`tel:${cleanPhone}`}
              className="bg-white hover:bg-orange-50 text-fashion-dark p-3 rounded-xl transition-all flex items-center gap-3 shadow-sm group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FiPhoneCall size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Call Support</p>
                <p className="text-xs font-extrabold text-orange-600 truncate">{supportPhone}</p>
              </div>
            </a>

            {/* SEND EMAIL BUTTON */}
            <a
              href={`mailto:${supportEmail}`}
              className="bg-white hover:bg-orange-50 text-fashion-dark p-3 rounded-xl transition-all flex items-center gap-3 shadow-sm group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FiMail size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Send Email</p>
                <p className="text-xs font-extrabold text-amber-600 truncate">{supportEmail}</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CustomerSupportModal
