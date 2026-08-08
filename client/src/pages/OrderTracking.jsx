import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCheck, FaBoxOpen, FaMotorcycle, FaHome } from 'react-icons/fa'
import { FiChevronLeft, FiMapPin, FiCreditCard, FiPackage, FiZap, FiClock } from 'react-icons/fi'

const OrderTracking = () => {
  const { orderId } = useParams()
  const orderList = useSelector(state => state.orders.order)
  const { fetchOrder } = useGlobalContext()
  const [currentOrder, setCurrentOrder] = useState(null)
  
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (fetchOrder) fetchOrder()
  }, [])

  useEffect(() => {
    if (orderList && orderList.length > 0) {
      const found = orderList.find(item => item._id === orderId || item.orderId === orderId)
      if (found) {
        setCurrentOrder(found)
      } else {
        setCurrentOrder(orderList[0])
      }
    }
  }, [orderId, orderList])

  // Update clock every second for precise real-time countdown calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Order Timestamp Calculation
  const orderTimeMs = currentOrder?.createdAt ? new Date(currentOrder.createdAt).getTime() : now
  const totalDeliveryDurationMs = 30 * 60 * 1000 // 30 Minutes
  const elapsedMs = Math.max(0, now - orderTimeMs)
  const remainingMs = Math.max(0, totalDeliveryDurationMs - elapsedMs)

  const elapsedMinutes = elapsedMs / (60 * 1000)
  const remainingTotalSec = Math.floor(remainingMs / 1000)
  const minLeft = Math.floor(remainingTotalSec / 60)
  const secLeft = remainingTotalSec % 60

  // Progress Bar Percentage (0% to 100%)
  const progressPercentage = Math.min(100, Math.max(5, Math.floor((elapsedMs / totalDeliveryDurationMs) * 100)))

  // Determine Active Stage based on exact elapsed time since order placement
  const isDelivered = elapsedMinutes >= 30
  const isOutForDelivery = elapsedMinutes >= 10 && elapsedMinutes < 30
  const isPacking = elapsedMinutes >= 5 && elapsedMinutes < 10
  const isConfirmed = elapsedMinutes < 5

  const expressSteps = [
    {
      title: 'Order Confirmed',
      desc: 'Received & verified at Darkstore',
      icon: FaCheck,
      status: elapsedMinutes >= 5 ? 'completed' : 'active',
      time: '0 Min'
    },
    {
      title: 'Packed & Quality Checked',
      desc: 'Items packed in express bag',
      icon: FaBoxOpen,
      status: elapsedMinutes >= 10 ? 'completed' : isPacking ? 'active' : 'pending',
      time: '5 Mins'
    },
    {
      title: 'Rider Out for Delivery 🛵',
      desc: isOutForDelivery ? 'Rider on fast route to your home' : 'Assigned express delivery executive',
      icon: FaMotorcycle,
      status: elapsedMinutes >= 30 ? 'completed' : isOutForDelivery ? 'active' : 'pending',
      time: '10 Mins'
    },
    {
      title: 'Delivered',
      desc: isDelivered ? 'Package handed over at doorstep' : 'Arriving at your doorstep',
      icon: FaHome,
      status: isDelivered ? 'completed' : 'pending',
      time: '30 Mins'
    }
  ]

  const product = currentOrder?.product_details
  const address = currentOrder?.delivery_address

  const formattedOrderTime = currentOrder?.createdAt
    ? new Date(currentOrder.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    : new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard/myorders" className="flex items-center gap-1.5 text-sm font-bold text-fashion-dark hover:text-orange-500 transition-colors">
            <FiChevronLeft size={18} /> My Orders
          </Link>
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-extrabold flex items-center gap-1">
            <FiZap className="text-orange-600 fill-orange-500" size={13} /> 30 MIN EXPRESS
          </span>
        </div>

        {/* DYNAMIC REAL-TIME 30 MIN COUNTDOWN HERO */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
            <FaMotorcycle size={180} />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full w-fit mb-2">
                <FiZap size={14} className="text-yellow-300 fill-yellow-300" />
                {isDelivered ? 'Order Delivered!' : isOutForDelivery ? 'Rider On The Way' : isPacking ? 'Packing In Progress' : 'Order Placed'}
              </div>
              
              <h1 className="text-3xl font-black tracking-tight">
                {isDelivered ? (
                  'Delivered in 30 Mins! 🎉'
                ) : (
                  `${String(minLeft).padStart(2, '0')} mins ${String(secLeft).padStart(2, '0')} secs`
                )}
              </h1>
              
              <p className="text-xs font-semibold text-orange-100 mt-1">
                {isDelivered
                  ? 'Your package has been successfully delivered to your doorstep.'
                  : isOutForDelivery
                  ? 'Rider is speeding on motorcycle to deliver your package 🛵'
                  : isPacking
                  ? 'Packing team is packing your fashion item at Darkstore'
                  : 'Order confirmed! Assigning nearest rider...'}
              </p>
            </div>

            {/* Rider / Status Badge */}
            <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-center shrink-0">
              <span className="text-[10px] font-extrabold uppercase text-orange-100 block">Live Status</span>
              <span className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-blue-400' : 'bg-green-400 animate-ping'}`}></span>
                {isDelivered ? 'Delivered' : isOutForDelivery ? 'Out for Delivery' : isPacking ? 'Packing' : 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Express Live Dynamic Progress Bar */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-orange-100 mt-2">
              <span>Darkstore (0m)</span>
              <span>Packing (5m)</span>
              <span>On Bike (10m)</span>
              <span>Delivered (30m)</span>
            </div>
          </div>
        </div>

        {/* Order Info Card with EXACT ORDER TIME */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4 gap-2">
            <div>
              <p className="text-xs text-fashion-gray font-medium">Order Reference</p>
              <h2 className="text-base font-extrabold text-fashion-dark font-mono">
                #{currentOrder?._id ? currentOrder._id.slice(-12).toUpperCase() : (orderId || 'FF-LIVE-ORDER')}
              </h2>
            </div>
            
            {/* EXACT ORDER PLACED TIME */}
            <div className="sm:text-right bg-orange-50/70 p-3 rounded-2xl border border-orange-100">
              <p className="text-xs text-fashion-gray font-bold flex items-center gap-1 sm:justify-end">
                <FiClock className="text-orange-500" size={13} /> Order Placed Time
              </p>
              <p className="text-xs font-black text-fashion-dark mt-0.5">
                {formattedOrderTime}
              </p>
            </div>
          </div>

          {/* Live Dynamic Timeline */}
          <div className="relative py-2">
            <div className="space-y-7 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:-ml-px before:bg-gradient-to-b before:from-green-500 before:via-orange-400 before:to-gray-200">
              {expressSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = step.status === 'completed'
                const isActive = step.status === 'active'

                return (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 z-10 font-bold transition-all ${
                      isCompleted ? 'bg-green-500 text-white shadow-md shadow-green-500/20' :
                      isActive ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md shadow-orange-500/20 animate-bounce' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-sm font-extrabold ${isActive || isCompleted ? 'text-fashion-dark' : 'text-gray-400'}`}>
                          {step.title}
                        </h3>
                        <span className="text-[11px] font-mono font-bold text-fashion-gray">
                          {step.time}
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

        {/* Product Details & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Purchased Product */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xs font-extrabold text-fashion-dark uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <FiPackage className="text-orange-500" /> Express Order Item
            </h2>

            {product?.name ? (
              <div className="flex gap-4 items-center">
                <img
                  src={product.image?.[0] || '/favicon.png'}
                  alt={product.name}
                  className="w-18 h-18 object-cover rounded-2xl border border-gray-100 shadow-sm"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-fashion-dark line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-fashion-gray font-semibold mt-1">
                    Total Amount: <span className="text-orange-600 font-extrabold">{DisplayPriceInRupees(currentOrder?.totalAmt || product.price)}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-fashion-gray space-y-1">
                <p className="font-bold text-fashion-dark">Express Order Confirmed</p>
                <p>Paid Amount: <span className="font-extrabold text-orange-600">{DisplayPriceInRupees(currentOrder?.totalAmt || 0)}</span></p>
              </div>
            )}
          </div>

          {/* Delivery Address & Payment Status */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <h2 className="text-xs font-extrabold text-fashion-dark mb-2 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> Delivery Address
              </h2>
              {address ? (
                <div className="text-xs text-fashion-gray space-y-0.5">
                  <p className="font-bold text-fashion-dark">{address.address_line}</p>
                  <p>{address.city}, {address.state} - <span className="font-bold text-fashion-dark">{address.pincode}</span></p>
                  <p className="pt-1 font-semibold text-fashion-dark">Mobile: {address.mobile}</p>
                </div>
              ) : (
                <p className="text-xs text-fashion-gray font-medium">Standard Express Delivery</p>
              )}
            </div>

            <div>
              <h2 className="text-xs font-extrabold text-fashion-dark mb-1 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
                <FiCreditCard className="text-green-500" /> Payment Details
              </h2>
              <p className="text-xs font-semibold text-fashion-dark">
                Status: <span className="text-green-600 font-bold">{currentOrder?.payment_status || 'PAID / CONFIRMED'}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderTracking
