import React from 'react'
import { FiX, FiShield, FiLock, FiCheckCircle } from 'react-icons/fi'

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-sm">
              <FiShield size={22} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-fashion-dark">Privacy Policy & Terms</h2>
              <p className="text-xs text-fashion-gray">FlashFit commitment to data security and transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-fashion-dark flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-fashion-gray leading-relaxed">
          <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 flex items-center gap-3 text-fashion-dark">
            <FiLock className="text-orange-500 shrink-0" size={20} />
            <p className="text-[11px] font-semibold">
              Your data is 256-bit SSL encrypted. We never share your personal contact details or payment info with unauthorized third parties.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-fashion-dark text-xs uppercase tracking-wider">1. Information We Collect</h3>
            <p>
              When you use FlashFit, we collect basic order information including your name, delivery address, phone number, and account email to fulfill your express 30-minute delivery orders.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-fashion-dark text-xs uppercase tracking-wider">2. Payment & Card Security</h3>
            <p>
              Prepaid UPI and card transactions process through RBI-certified payment gateways. FlashFit does not store debit/credit card numbers or secret UPI PINs on our servers.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-fashion-dark text-xs uppercase tracking-wider">3. Location & Live Tracking</h3>
            <p>
              Live rider tracking utilizes approximate GPS coordinates during active order dispatch only to ensure fast doorstep delivery.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-fashion-dark text-xs uppercase tracking-wider">4. Cookies & Personalization</h3>
            <p>
              We use functional session cookies to remember your shopping cart items and size preferences across browser visits.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Last Updated: August 2026</span>
            <span className="flex items-center gap-1 font-bold text-green-600">
              <FiCheckCircle size={12} /> ISO 27001 Certified Security
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PrivacyPolicyModal
