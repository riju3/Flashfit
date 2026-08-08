import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import { FiTruck, FiShoppingBag } from 'react-icons/fi'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderDetails = location?.state?.orderDetails

  useEffect(() => {
    // Automatically redirect to tracking page after 3.5 seconds if orderDetails exists
    const timer = setTimeout(() => {
      if (orderDetails?._id) {
        navigate(`/order-tracking/${orderDetails._id}`)
      } else {
        navigate('/dashboard/myorders')
      }
    }, 3500)

    return () => clearTimeout(timer)
  }, [orderDetails, navigate])

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-50/50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-100 max-w-md w-full text-center transform animate-bounce-short">
        {/* Animated Check Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <FaCheckCircle className="text-green-500 text-6xl animate-scale-in" />
          </div>
          <div className="absolute -top-2 -right-2 text-2xl">🎉</div>
          <div className="absolute -bottom-2 -left-2 text-2xl">✨</div>
        </div>

        <h1 className="text-2xl font-black text-fashion-dark mb-2">Order Confirmed!</h1>
        <p className="text-sm text-fashion-gray mb-6">
          Thank you for shopping with FlashFit! Your order has been placed successfully.
        </p>

        <div className="bg-orange-50/60 p-4 rounded-2xl mb-6 border border-orange-100 text-left">
          <div className="flex justify-between items-center text-xs text-fashion-gray mb-1">
            <span>Order Reference</span>
            <span className="font-mono font-bold text-fashion-dark">{orderDetails?._id?.slice(-8)?.toUpperCase() || 'FF-' + Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-fashion-gray">
            <span>Estimated Delivery</span>
            <span className="font-bold text-green-600">⚡ 15 Minute Express Delivery</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (orderDetails?._id) {
                navigate(`/order-tracking/${orderDetails._id}`)
              } else {
                navigate('/dashboard/myorders')
              }
            }}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <FiTruck size={18} /> Track Your Order Now
          </button>

          <Link
            to="/"
            className="block text-xs font-semibold text-fashion-gray hover:text-orange-500 transition-colors py-2"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 mt-4 animate-pulse">
          Redirecting to live order tracking in 3 seconds...
        </p>
      </div>
    </div>
  )
}

export default OrderSuccess
