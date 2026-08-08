import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCheck, FaBoxOpen, FaTruck, FaHome, FaClock } from 'react-icons/fa'
import { FiChevronLeft, FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi'

const OrderTracking = () => {
  const { orderId } = useParams()
  const orderList = useSelector(state => state.orders.order)
  const { fetchOrder } = useGlobalContext()
  const [currentOrder, setCurrentOrder] = useState(null)

  useEffect(() => {
    if (fetchOrder) {
      fetchOrder()
    }
  }, [])

  useEffect(() => {
    if (orderList && orderList.length > 0) {
      const found = orderList.find(item => item._id === orderId || item.orderId === orderId)
      if (found) {
        setCurrentOrder(found)
      } else {
        // Fallback to most recent order if ID is dynamic
        setCurrentOrder(orderList[0])
      }
    }
  }, [orderId, orderList])

  const trackingSteps = [
    { title: 'Order Placed', desc: 'Your order has been confirmed', icon: FaCheck, status: 'completed', time: 'Just Now' },
    { title: 'Processing & Packing', desc: 'Preparing item for shipment', icon: FaBoxOpen, status: 'active', time: 'Expected Today' },
    { title: 'Shipped / In Transit', desc: 'Package handoff to courier partner', icon: FaTruck, status: 'pending', time: 'Tomorrow' },
    { title: 'Delivered', desc: 'Package delivered to address', icon: FaHome, status: 'pending', time: 'In 3-5 Days' }
  ]

  const product = currentOrder?.product_details
  const address = currentOrder?.delivery_address

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard/myorders" className="flex items-center gap-1.5 text-sm font-bold text-fashion-dark hover:text-orange-500 transition-colors">
            <FiChevronLeft size={18} /> My Orders
          </Link>
          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
            Live Status: Processing
          </span>
        </div>

        {/* Tracking Header & Progress Stepper Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4 mb-6 gap-2">
            <div>
              <p className="text-xs text-fashion-gray font-medium">Order Reference</p>
              <h1 className="text-lg font-extrabold text-fashion-dark font-mono">
                #{currentOrder?._id ? currentOrder._id.slice(-12).toUpperCase() : (orderId || 'FF-LIVE-ORDER')}
              </h1>
            </div>
            <div>
              <p className="text-xs text-fashion-gray font-medium">Order Date</p>
              <p className="text-sm font-semibold text-fashion-dark">
                {currentOrder?.createdAt ? new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative py-4">
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:md:left-5 before:w-0.5 before:-ml-px before:bg-gradient-to-b before:from-green-500 before:via-orange-400 before:to-gray-200">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = step.status === 'completed'
                const isActive = step.status === 'active'

                return (
                  <div key={index} className="relative flex items-start gap-4 group">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 z-10 font-bold transition-all ${
                      isCompleted ? 'bg-green-500 text-white shadow-md shadow-green-500/20' :
                      isActive ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md shadow-orange-500/20 animate-pulse' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-sm font-bold ${isActive || isCompleted ? 'text-fashion-dark' : 'text-gray-400'}`}>
                          {step.title}
                        </h3>
                        <span className="text-[11px] font-semibold text-fashion-gray flex items-center gap-1">
                          <FaClock size={10} /> {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-fashion-gray mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Product Details & Delivery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Purchased Item Details */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-fashion-dark uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <FiPackage className="text-orange-500" /> Purchased Product
            </h2>

            {product?.name ? (
              <div className="space-y-3">
                <div className="flex gap-4 items-center">
                  <img
                    src={product.image?.[0] || '/favicon.png'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-fashion-dark line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-fashion-gray font-semibold mt-1">
                      Purchased Price: <span className="text-orange-600 font-extrabold">{DisplayPriceInRupees(currentOrder?.totalAmt || product.price)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-fashion-gray">
                <p className="font-bold text-fashion-dark">Order Confirmed</p>
                <p>Total Paid: <span className="font-extrabold text-orange-600">{DisplayPriceInRupees(currentOrder?.totalAmt || 0)}</span></p>
              </div>
            )}
          </div>

          {/* Delivery Address & Payment Info */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-fashion-dark mb-2 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> Delivery Address
              </h2>
              {address ? (
                <div className="text-xs text-fashion-gray space-y-0.5">
                  <p className="font-bold text-fashion-dark">{address.address_line}</p>
                  <p>{address.city}, {address.state} - <span className="font-bold text-fashion-dark">{address.pincode}</span></p>
                  <p className="pt-1 font-semibold text-fashion-dark">Mobile: {address.mobile}</p>
                </div>
              ) : (
                <p className="text-xs text-fashion-gray font-medium">Standard Home Delivery</p>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-fashion-dark mb-1 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
                <FiCreditCard className="text-green-500" /> Payment Info
              </h2>
              <p className="text-xs font-semibold text-fashion-dark">
                Method: <span className="text-green-600 font-bold">{currentOrder?.payment_status || 'VERIFIED / CONFIRMED'}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderTracking
