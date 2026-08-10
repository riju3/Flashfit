import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FaCheck, FaBoxOpen, FaMotorcycle, FaHome, FaTimesCircle, FaStar } from 'react-icons/fa'
import { FiChevronLeft, FiMapPin, FiCreditCard, FiPackage, FiZap, FiClock, FiExternalLink, FiX, FiAlertTriangle, FiCheckCircle, FiHelpCircle, FiTag } from 'react-icons/fi'
import { valideURLConvert } from '../utils/valideURLConvert'
import CustomerSupportModal from '../components/CustomerSupportModal'

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Delivery time is longer than expected",
  "Need to change delivery address or phone number",
  "Found a better price elsewhere",
  "Other"
]

const OrderTracking = () => {
  const { orderId } = useParams()
  const orderList = useSelector(state => state.orders.order)
  const user = useSelector(state => state.user)
  const { fetchOrder } = useGlobalContext()
  const [currentOrder, setCurrentOrder] = useState(null)
  
  const [now, setNow] = useState(Date.now())
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0])
  const [customReason, setCustomReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  // ── Return & Replace State ──
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnType, setReturnType] = useState('REPLACE')
  const [returnReason, setReturnReason] = useState('Size issue / Fit problem')
  const [customReturnReason, setCustomReturnReason] = useState('')
  const [returnComment, setReturnComment] = useState('')
  const [replaceSize, setReplaceSize] = useState('M')
  const [submittingReturn, setSubmittingReturn] = useState(false)

  // ── Review & Rating State (Defaults to 0 Stars) ──
  const [userReview, setUserReview] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [hoverDeliveryRating, setHoverDeliveryRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [openSupportModal, setOpenSupportModal] = useState(false)

  useEffect(() => {
    if (fetchOrder) fetchOrder()
  }, [])

  useEffect(() => {
    if (orderList && orderList.length > 0) {
      if (orderId) {
        const found = orderList.find(o => o._id === orderId || o.orderId === orderId)
        setCurrentOrder(found || orderList[0])
      } else {
        setCurrentOrder(orderList[0])
      }
    }
  }, [orderId, orderList])

  const fetchOrderReview = async (oId) => {
    if (!oId) return
    try {
      const res = await Axios({
        url: `${SummaryApi.getOrderReview.url}/${oId}`,
        method: SummaryApi.getOrderReview.method
      })
      if (res.data?.success && res.data?.data) {
        setUserReview(res.data.data)
      }
    } catch (_) {}
  }

  useEffect(() => {
    if (currentOrder?._id) {
      fetchOrderReview(currentOrder._id)
    }
  }, [currentOrder])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a product rating")
      return
    }
    if (deliveryRating === 0) {
      toast.error("Please select a delivery rating")
      return
    }
    if (!comment.trim()) {
      toast.error("Please write a review comment")
      return
    }

    if (!targetProductId) {
      toast.error("Product information missing")
      return
    }

    try {
      setSubmittingReview(true)
      const res = await Axios({
        ...SummaryApi.addReview,
        data: {
          productId: targetProductId,
          orderId: currentOrder?._id,
          rating,
          deliveryRating,
          comment: comment.trim()
        }
      })
      if (res.data?.success) {
        toast.success("Review submitted successfully!")
        setUserReview(res.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmittingReview(false)
    }
  }

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

  // Order Status Checks (DB status takes precedence if updated by Admin, else fallbacks to live time)
  const dbStatus = currentOrder?.order_status || 'CONFIRMED'
  const isCancelled = dbStatus === 'CANCELLED'
  const isDelivered = dbStatus === 'DELIVERED' || (!isCancelled && elapsedMinutes >= 30)
  const isOutForDelivery = dbStatus === 'OUT_FOR_DELIVERY' || (!isCancelled && !isDelivered && elapsedMinutes >= 10)
  const isPacking = dbStatus === 'PACKING' || (!isCancelled && !isDelivered && !isOutForDelivery && elapsedMinutes >= 5)

  // 7-Day Return / Replacement Window Check
  const deliveryTime = currentOrder?.deliveredAt
    ? new Date(currentOrder.deliveredAt).getTime()
    : (currentOrder?.updatedAt ? new Date(currentOrder.updatedAt).getTime() : orderTimeMs)
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  const isWithin7Days = (now - deliveryTime) <= sevenDaysMs

  const RETURN_REASONS = [
    "Size issue / Fit problem",
    "Defective or Damaged product",
    "Quality not as expected",
    "Different item delivered",
    "Other"
  ]

  const handleReturnSubmit = async (e) => {
    e.preventDefault()
    const finalReason = returnReason === 'Other' ? customReturnReason : returnReason
    if (!finalReason || !finalReason.trim()) {
      toast.error("Please select a reason for return/exchange")
      return
    }

    try {
      setSubmittingReturn(true)
      const res = await Axios({
        ...SummaryApi.returnOrder,
        data: {
          orderId: currentOrder?._id,
          return_type: returnType,
          return_reason: finalReason,
          return_comment: returnComment
        }
      })

      if (res.data?.success) {
        toast.success(res.data.message || "Request submitted successfully!")
        setShowReturnModal(false)
        setCurrentOrder(prev => ({
          ...prev,
          return_status: returnType === 'REPLACE' ? 'REPLACE_REQUESTED' : 'RETURN_REQUESTED',
          return_type: returnType,
          return_reason: finalReason,
          return_comment: returnComment
        }))
        if (fetchOrder) fetchOrder()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmittingReturn(false)
    }
  }

  const expressSteps = [
    {
      title: 'Order Confirmed',
      desc: 'Received & verified at Darkstore',
      icon: FaCheck,
      status: isCancelled ? 'cancelled' : elapsedMinutes >= 5 || isPacking || isOutForDelivery || isDelivered ? 'completed' : 'active',
      time: '0 Min'
    },
    {
      title: 'Packed & Quality Checked',
      desc: 'Items packed in express bag',
      icon: FaBoxOpen,
      status: isCancelled ? 'cancelled' : isPacking ? 'active' : isOutForDelivery || isDelivered ? 'completed' : 'pending',
      time: '5 Mins'
    },
    {
      title: 'Rider Out for Delivery',
      desc: isOutForDelivery ? 'Rider on fast route to your home' : 'Assigned express delivery executive',
      icon: FaMotorcycle,
      status: isCancelled ? 'cancelled' : isOutForDelivery ? 'active' : isDelivered ? 'completed' : 'pending',
      time: '10 Mins'
    },
    {
      title: 'Delivered',
      desc: isDelivered ? 'Package handed over at doorstep' : 'Arriving at your doorstep',
      icon: FaHome,
      status: isCancelled ? 'cancelled' : isDelivered ? 'completed' : 'pending',
      time: '30 Mins'
    }
  ]

  if (currentOrder?.return_status && currentOrder.return_status !== 'NONE') {
    const retStatus = currentOrder.return_status
    const isRejected = retStatus.includes('REJECTED')
    const isApproved = retStatus.includes('APPROVED') || retStatus === 'COMPLETED'

    expressSteps.push({
      title: currentOrder.return_type === 'REPLACE' ? 'Exchange / Replace Status' : 'Return & Refund Status',
      desc: `Status: ${retStatus.replace(/_/g, ' ')}${currentOrder.return_reason ? ` • "${currentOrder.return_reason}"` : ''}`,
      icon: isRejected ? FaTimesCircle : (isApproved ? FaCheck : FaBoxOpen),
      status: isRejected ? 'cancelled' : isApproved ? 'completed' : 'active',
      time: 'Status'
    })
  }

  const product = currentOrder?.product_details
  const address = currentOrder?.delivery_address

  const targetProductId = currentOrder?.productId?._id || currentOrder?.productId || product?._id
  const productUrl = targetProductId ? `/product/${valideURLConvert(product?.name || 'product')}-${targetProductId}` : '#'

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

  const handleCancelOrderSubmit = async (e) => {
    e.preventDefault()
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason
    if (!finalReason || !finalReason.trim()) {
      toast.error("Please specify a reason for cancellation")
      return
    }

    try {
      setCancelling(true)
      const response = await Axios({
        ...SummaryApi.cancelOrder,
        data: {
          orderId: currentOrder?._id,
          cancel_reason: finalReason
        }
      })

      if (response.data.success) {
        toast.success("Order cancelled successfully")
        setShowCancelModal(false)
        setCurrentOrder(prev => ({
          ...prev,
          order_status: 'CANCELLED',
          cancel_reason: finalReason
        }))
        if (fetchOrder) fetchOrder()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setCancelling(false)
    }
  }

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
        {(() => {
          const hasReturnStatus = currentOrder?.return_status && currentOrder.return_status !== 'NONE'

          return (
            <div className={`p-6 rounded-3xl shadow-xl relative overflow-hidden text-white transition-all ${
              hasReturnStatus
                ? 'bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950'
                : isCancelled
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700'
                : isDelivered
                ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600'
            }`}>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
                {isCancelled ? <FaTimesCircle size={180} /> : hasReturnStatus ? <FaBoxOpen size={180} /> : <FaMotorcycle size={180} />}
              </div>

              <div className="relative z-10 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-black/30 px-3 py-1 rounded-full w-fit mb-2">
                    <FiZap size={14} className="text-yellow-300 fill-yellow-300" />
                    {hasReturnStatus
                      ? (currentOrder.return_type === 'REPLACE' ? 'EXCHANGE REQUEST' : 'RETURN & REFUND REQUEST')
                      : isCancelled
                      ? 'ORDER CANCELLED'
                      : isDelivered
                      ? 'DELIVERED SUCCESSFULLY'
                      : isOutForDelivery
                      ? 'RIDER ON THE WAY'
                      : isPacking
                      ? 'PACKING IN PROGRESS'
                      : 'ORDER PLACED'}
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {hasReturnStatus ? (
                      currentOrder.return_status.replace(/_/g, ' ')
                    ) : isCancelled ? (
                      'Order Has Been Cancelled'
                    ) : isDelivered ? (
                      'Delivered in 30 Mins!'
                    ) : (
                      `${String(minLeft).padStart(2, '0')} mins ${String(secLeft).padStart(2, '0')} secs`
                    )}
                  </h1>
                  
                  <p className="text-xs font-semibold text-white/90 mt-1">
                    {hasReturnStatus
                      ? `Reason: "${currentOrder?.return_reason || 'N/A'}"${currentOrder?.return_comment ? ` • Notes: "${currentOrder.return_comment}"` : ''}`
                      : isCancelled
                      ? `Reason: "${currentOrder?.cancel_reason || 'Requested by customer'}"`
                      : isDelivered
                      ? 'Your package has been successfully delivered to your doorstep.'
                      : isOutForDelivery
                      ? 'Rider is speeding on motorcycle to deliver your package'
                      : isPacking
                      ? 'Packing team is packing your fashion item at Darkstore'
                      : 'Order confirmed! Assigning nearest rider...'}
                  </p>
                </div>

                {/* FULL WIDTH STATUS BAR SPANNING 100% ACROSS THE HERO CARD */}
                <div className="w-full bg-white/20 backdrop-blur-md px-4 py-3 sm:px-5 rounded-2xl border border-white/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-white/80 block">STATUS</span>
                    <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isCancelled ? 'bg-red-300' : isDelivered ? 'bg-green-300' : 'bg-yellow-300 animate-ping'
                      }`}></span>
                      {dbStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Return / Exchange Status Pill on the Right Side of Full Width Status Bar */}
                  {hasReturnStatus && (
                    <span className={`text-xs font-black px-3.5 py-1 rounded-full uppercase border shadow-sm ${
                      currentOrder.return_status.includes('REJECTED')
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : currentOrder.return_status.includes('APPROVED') || currentOrder.return_status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {currentOrder.return_status.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Express Live Dynamic Progress Bar */}
              {!isCancelled && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${isDelivered ? 100 : progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-white/80 mt-2">
                    <span>Darkstore (0m)</span>
                    <span>Packing (5m)</span>
                    <span>On Bike (10m)</span>
                    <span>Delivered (30m)</span>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Cancellation Alert if Cancelled */}
        {isCancelled && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3 text-red-800">
            <FiAlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-sm text-red-900">Order Cancelled</h3>
              <p className="font-medium">
                Cancellation Reason: <span className="font-bold italic">"{currentOrder?.cancel_reason || 'Customer requested cancellation'}"</span>
              </p>
              <p className="text-red-700 text-[11px]">If any payment was deducted, refund will process within 24 hours.</p>
            </div>
          </div>
        )}

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
                const isStepCancelled = step.status === 'cancelled'

                return (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 z-10 font-bold transition-all ${
                      isStepCancelled ? 'bg-red-100 text-red-500' :
                      isCompleted ? 'bg-green-500 text-white shadow-md shadow-green-500/20' :
                      isActive ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md shadow-orange-500/20 animate-bounce' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-sm font-extrabold ${isStepCancelled ? 'line-through text-red-400' : isActive || isCompleted ? 'text-fashion-dark' : 'text-gray-400'}`}>
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
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4 w-full overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xs font-extrabold text-fashion-dark uppercase tracking-wider flex items-center gap-2">
                <FiPackage className="text-orange-500" /> Express Order Item
              </h2>
              {targetProductId && (
                <Link
                  to={productUrl}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-full transition-all"
                >
                  View Product Page <FiExternalLink size={11} />
                </Link>
              )}
            </div>

            {product?.name ? (
              <Link
                to={productUrl}
                className="flex gap-3 sm:gap-4 items-center w-full min-w-0 group hover:opacity-95 transition-opacity"
              >
                <img
                  src={product.image?.[0] || '/favicon.png'}
                  alt={product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-gray-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-extrabold text-fashion-dark leading-snug line-clamp-2 break-words group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.size && (
                    <div className="mt-1">
                      <span className="inline-block px-2.5 py-0.5 text-[11px] font-extrabold bg-orange-50 text-orange-600 border border-orange-200 rounded-md">
                        Size: {product.size}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-fashion-gray font-semibold mt-1">
                    Total Amount: <span className="text-orange-600 font-extrabold">{DisplayPriceInRupees(currentOrder?.totalAmt || product.price)}</span>
                  </p>
                </div>
              </Link>
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

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <h2 className="text-xs font-extrabold text-fashion-dark mb-1 uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                <FiCreditCard className="text-green-500" /> Payment & Price Breakdown
              </h2>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-fashion-gray">
                  <span>Payment Status</span>
                  <span className="text-green-600 font-extrabold">{currentOrder?.payment_status || 'PAID / CONFIRMED'}</span>
                </div>

                <div className="flex justify-between text-fashion-gray">
                  <span>Actual Price (Subtotal)</span>
                  <span className="font-bold text-fashion-dark">{DisplayPriceInRupees(currentOrder?.subTotalAmt || currentOrder?.totalAmt || 0)}</span>
                </div>

                {currentOrder?.couponCode ? (
                  <div className="flex justify-between text-green-700 bg-green-50 p-2 rounded-xl border border-green-200 font-bold">
                    <span className="flex items-center gap-1">
                      <FiTag className="text-orange-500" size={13} /> Coupon Applied ({currentOrder.couponCode})
                    </span>
                    <span>- {DisplayPriceInRupees(Math.max(0, (currentOrder?.subTotalAmt || 0) - (currentOrder?.totalAmt || 0)))}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-fashion-gray">
                    <span>Coupon Discount</span>
                    <span className="text-gray-400 font-medium">No Coupon Used</span>
                  </div>
                )}

                <div className="flex justify-between text-fashion-gray">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-extrabold text-fashion-dark">
                  <span>Final Price Paid</span>
                  <span className="text-base text-orange-600 font-black">{DisplayPriceInRupees(currentOrder?.totalAmt || 0)}</span>
                </div>
              </div>
            </div>

            {user?.role !== 'ADMIN' && (
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs font-bold text-fashion-dark flex items-center gap-1.5">
                    <FiHelpCircle className="text-orange-500" /> Need Help With Your Order?
                  </p>
                  <p className="text-[10px] text-fashion-gray">View policy FAQs or contact support</p>
                </div>
                <button
                  onClick={() => setOpenSupportModal(true)}
                  className="py-2 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 font-extrabold text-xs rounded-xl border border-orange-200 transition-all cursor-pointer"
                >
                  Customer Support
                </button>
              </div>
            )}
          </div>

        </div>

        {/* DELIVERED ORDER REVIEW CARD */}
        {isDelivered && !isCancelled && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-extrabold text-fashion-dark flex items-center gap-2">
                <FaStar className="text-amber-400" size={16} /> Rate Your Order & Experience
              </h2>
              <p className="text-[11px] text-fashion-gray mt-0.5">Please rate the product quality and delivery service below.</p>
            </div>

            {userReview ? (
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100/60 pb-2">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-fashion-gray font-bold uppercase">Product Rating</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            size={14}
                            className={star <= userReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-xs font-bold text-fashion-dark ml-1">({userReview.rating}/5)</span>
                      </div>
                    </div>

                    {userReview.deliveryRating && (
                      <div className="border-l border-orange-200 pl-4">
                        <p className="text-[10px] text-fashion-gray font-bold uppercase">Delivery Rating</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={14}
                              className={star <= userReview.deliveryRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="text-xs font-bold text-fashion-dark ml-1">({userReview.deliveryRating}/5)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    <FiCheckCircle size={13} /> Review Published
                  </span>
                </div>

                <p className="text-xs text-fashion-dark font-medium italic">"{userReview.comment}"</p>
                <p className="text-[10px] text-fashion-gray">Thank you! Your feedback helps us improve.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  {/* Product Rating */}
                  <div>
                    <p className="text-xs font-extrabold text-fashion-dark mb-1.5 flex items-center gap-1">
                      <span>1. Product Quality & Fit</span>
                      <span className="text-red-500">*</span>
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <FaStar size={22} className={star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-fashion-dark ml-1.5">
                        {hoverRating || rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Delivery Rating */}
                  <div>
                    <p className="text-xs font-extrabold text-fashion-dark mb-1.5 flex items-center gap-1">
                      <span>2. Express Delivery & Service</span>
                      <span className="text-red-500">*</span>
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverDeliveryRating(star)}
                          onMouseLeave={() => setHoverDeliveryRating(0)}
                          onClick={() => setDeliveryRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <FaStar size={22} className={star <= (hoverDeliveryRating || deliveryRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-fashion-dark ml-1.5">
                        {hoverDeliveryRating || deliveryRating}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-fashion-dark mb-1.5">Your Detailed Feedback:</label>
                  <textarea
                    rows={3}
                    placeholder="Share your experience with product quality, fabric, fitting, and express delivery..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingReview ? 'Publishing Review...' : 'Submit Rating & Review'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 7-DAY EASY RETURN / REPLACEMENT CARD FOR DELIVERED ORDERS */}
        {isDelivered && !isCancelled && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-fashion-dark">
                  7-Day Easy Return & Exchange
                </h3>
                <p className="text-xs text-fashion-gray mt-0.5">
                  {isWithin7Days
                    ? 'Hassle-free 7-day exchange or full money refund guarantee'
                    : 'The 7-day return & replacement window for this order has expired.'}
                </p>
              </div>

              {currentOrder?.return_status && currentOrder.return_status !== 'NONE' ? (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  {currentOrder.return_status.replace(/_/g, ' ')}
                </span>
              ) : isWithin7Days ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setReturnType('REPLACE')
                      setShowReturnModal(true)
                    }}
                    className="flex-1 sm:flex-initial py-2 px-4 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-extrabold text-xs rounded-xl border border-orange-200 transition-all cursor-pointer"
                  >
                    Exchange / Replace
                  </button>
                  <button
                    onClick={() => {
                      setReturnType('RETURN')
                      setShowReturnModal(true)
                    }}
                    className="flex-1 sm:flex-initial py-2 px-4 bg-gray-100 hover:bg-gray-800 hover:text-white text-fashion-dark font-extrabold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer"
                  >
                    Return & Refund
                  </button>
                </div>
              ) : null}
            </div>

            {/* Return / Replace Submitted Alert Banner */}
            {currentOrder?.return_status && currentOrder.return_status !== 'NONE' && (
              <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-2xl text-xs text-orange-900 space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span>Request Type: {currentOrder.return_type || 'RETURN / REPLACE'}</span>
                  <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded-md text-[10px]">
                    {currentOrder.return_status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-fashion-gray">Reason: <span className="font-semibold italic">"{currentOrder.return_reason}"</span></p>
                {currentOrder.return_comment && (
                  <p className="text-orange-900 font-medium">Notes: <span className="font-bold">"{currentOrder.return_comment}"</span></p>
                )}
                <p className="text-[11px] text-gray-500 pt-1">Our pickup executive will arrive within 24-48 hours for item verification.</p>
              </div>
            )}
          </div>
        )}

        {/* CANCEL YOUR ORDER WHITE BOX AT THE VERY BOTTOM */}
        {!isCancelled && !isDelivered && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-fashion-dark">
                  Cancel Your Order
                </h3>
                <p className="text-[11px] text-fashion-gray">Want to change items or address? You can cancel your order now.</p>
              </div>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full sm:w-auto py-2.5 px-6 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl border border-red-200 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiX size={15} /> Cancel Order
              </button>
            </div>

            {/* Faded 2-3 Line Cancellation Policy Details */}
            <div className="text-[11px] text-gray-400 leading-snug space-y-0.5 pt-1 font-medium opacity-80">
              <p>• Orders can be cancelled anytime before doorstep delivery for a 100% full refund.</p>
              <p>• Prepaid refunds for UPI / Cards are processed automatically to your payment source.</p>
              <p>• Need help? Contact FlashFit 24/7 Express Customer Support.</p>
            </div>
          </div>
        )}

      </div>

      {/* RETURN & REPLACEMENT MODAL */}
      {showReturnModal && (
        <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-fashion-dark flex items-center gap-2">
                {returnType === 'REPLACE' ? 'Exchange / Replace Product' : 'Return Product for Full Refund'}
              </h3>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-fashion-charcoal mb-1">Request Type:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnType('REPLACE')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      returnType === 'REPLACE'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-gray-50 text-fashion-dark border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Exchange Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnType('RETURN')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      returnType === 'RETURN'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-gray-50 text-fashion-dark border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Return & Refund
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-charcoal mb-1">Reason for {returnType === 'REPLACE' ? 'Exchange' : 'Return'}:</label>
                <div className="space-y-1.5">
                  {RETURN_REASONS.map((reason, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        returnReason === reason
                          ? 'border-orange-500 bg-orange-50/50 text-orange-900'
                          : 'border-gray-200 text-fashion-dark hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="return_reason"
                        checked={returnReason === reason}
                        onChange={() => setReturnReason(reason)}
                        className="accent-orange-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-charcoal mb-1">Additional Note / Request (Optional):</label>
                <textarea
                  rows={2}
                  placeholder={returnType === 'REPLACE' ? "e.g. Need size M instead of L, or preferred color..." : "Add any specific instructions for pickup..."}
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-fashion-dark text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submittingReturn ? "Submitting..." : `Submit ${returnType === 'REPLACE' ? 'Exchange' : 'Return'}`}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* CANCEL ORDER MODAL */}
      {showCancelModal && (
        <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-fashion-dark flex items-center gap-2">
                <FiAlertTriangle className="text-red-500" /> Cancel Order Confirmation
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
              <p className="text-xs font-bold text-fashion-charcoal">
                Why do you want to cancel this order?
              </p>

              <div className="space-y-2">
                {CANCEL_REASONS.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-red-500 bg-red-50/50 text-red-900'
                        : 'border-gray-200 text-fashion-dark hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-red-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {selectedReason === "Other" && (
                <div>
                  <textarea
                    rows={3}
                    placeholder="Please specify your reason for cancellation..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                  ></textarea>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-fashion-dark text-xs font-bold rounded-xl transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      <CustomerSupportModal isOpen={openSupportModal} onClose={() => setOpenSupportModal(false)} />
    </div>
  )
}

export default OrderTracking
