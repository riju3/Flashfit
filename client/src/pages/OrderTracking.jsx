import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCheck, FaBoxOpen, FaMotorcycle, FaHome } from 'react-icons/fa'
import { FiChevronLeft, FiMapPin, FiCreditCard, FiPackage, FiZap } from 'react-icons/fi'

const OrderTracking = () => {
  const { orderId } = useParams()
  const orderList = useSelector(state => state.orders.order)
  const { fetchOrder } = useGlobalContext()
  const [currentOrder, setCurrentOrder] = useState(null)
  const [minutesLeft, setMinutesLeft] = useState(12)
  const [secondsLeft, setSecondsLeft] = useState(45)

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

  // Simulated 15-min express delivery countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prevSec => {
        if (prevSec > 0) return prevSec - 1
        setMinutesLeft(prevMin => (prevMin > 0 ? prevMin - 1 : 0))
        return 59
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const expressSteps = [
    { title: 'Order Confirmed', desc: 'Received at Darkstore', icon: FaCheck, status: 'completed', time: '0 Min' },
    { title: 'Packed & Ready', desc: 'Quality checked by team', icon: FaBoxOpen, status: 'completed', time: '2 Mins' },
    { title: 'Rider Out for Delivery', desc: 'Rider is on the way to your door 🛵', icon: FaMotorcycle, status: 'active', time: '5 Mins' },
    { title: 'Delivered', desc: 'Arriving at your doorstep', icon: FaHome, status: 'pending', time: '15 Mins' }
  ]

  const product = currentOrder?.product_details
  const address = currentOrder?.delivery_address

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard/myorders" className="flex items-center gap-1.5 text-sm font-bold text-fashion-dark hover:text-orange-500 transition-colors">
            <FiChevronLeft size={18} /> My Orders
          </Link>
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-extrabold flex items-center gap-1">
            <FiZap className="text-orange-600 fill-orange-500" size={13} /> 15 MIN EXPRESS
          </span>
        </div>

        {/* 15 MIN EXPRESS HERO LIVE COUNTDOWN */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
            <FaMotorcycle size={180} />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full w-fit mb-2">
                <FiZap size={14} className="text-yellow-300 fill-yellow-300" /> Arriving Fast
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                {minutesLeft > 0 ? `${minutesLeft} mins ${secondsLeft} secs` : 'Arriving Any Moment!'}
              </h1>
              <p className="text-xs font-semibold text-orange-100 mt-1">
                Your order is currently out for delivery on rider bike 🛵
              </p>
            </div>

            {/* Rider Status Badge */}
            <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-center shrink-0">
              <span className="text-[10px] font-extrabold uppercase text-orange-100 block">Rider Status</span>
              <span className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span> On The Way
              </span>
            </div>
          </div>

          {/* Express Live Progress Line */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
              <div className="bg-white h-full rounded-full transition-all duration-1000 animate-pulse w-[75%]"></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-orange-100 mt-2">
              <span>Dark Store Dispatch</span>
              <span>Near Your Location</span>
              <span>Doorstep</span>
            </div>
          </div>
        </div>

        {/* Express Live Stepper Timeline */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <div>
              <p className="text-xs text-fashion-gray font-medium">Order Reference</p>
              <h2 className="text-base font-extrabold text-fashion-dark font-mono">
                #{currentOrder?._id ? currentOrder._id.slice(-12).toUpperCase() : (orderId || 'FF-LIVE-ORDER')}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-fashion-gray font-medium">Order Type</p>
              <span className="text-xs font-extrabold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                ⚡ FlashFit Express
              </span>
            </div>
          </div>

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

          {/* Delivery & Payment Info */}
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
                <p className="text-xs text-fashion-gray font-medium">Standard Home Delivery</p>
              )}
            </div>

            <div>
              <h2 className="text-xs font-extrabold text-fashion-dark mb-1 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
                <FiCreditCard className="text-green-500" /> Payment Status
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
