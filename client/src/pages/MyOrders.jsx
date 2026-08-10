import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FiTruck, FiChevronRight, FiPackage, FiX, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Delivery time is longer than expected",
  "Need to change delivery address or phone number",
  "Found a better price elsewhere",
  "Other"
]

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const { fetchOrder } = useGlobalContext()
  const navigate = useNavigate()

  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null)
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0])
  const [customReason, setCustomReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (fetchOrder) {
      fetchOrder()
    }
  }, [])

  const handleCancelSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOrderToCancel) return

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
          orderId: selectedOrderToCancel._id,
          cancel_reason: finalReason
        }
      })

      if (response.data.success) {
        toast.success("Order cancelled successfully")
        setSelectedOrderToCancel(null)
        setCustomReason('')
        if (fetchOrder) fetchOrder()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="bg-gray-50/50 min-h-[80vh] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <FiPackage size={22} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-fashion-dark">My Orders</h1>
              <p className="text-xs text-fashion-gray">Track status, view details, or cancel your purchases</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
            {orders?.length || 0} Orders
          </span>
        </div>

        {/* No Orders State */}
        {(!orders || orders.length === 0) && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <NoData />
            <p className="text-sm font-semibold text-fashion-gray mt-2">You have not placed any orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 py-2.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders && orders.map((order, index) => {
            const product = order?.product_details
            const orderId = order?._id || order?.orderId
            const isCancelled = order?.order_status === 'CANCELLED'
            const isDelivered = order?.order_status === 'DELIVERED'

            return (
              <div
                key={order._id + index}
                onClick={() => navigate(`/order-tracking/${orderId}`)}
                className={`bg-white p-5 rounded-2xl shadow-sm border transition-all cursor-pointer group ${
                  isCancelled
                    ? 'border-red-200 bg-red-50/10 hover:border-red-300'
                    : 'border-gray-100 hover:border-orange-200 hover:shadow-md'
                }`}
              >
                {/* Card Header: Order Reference + Status Badges */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-3 mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-fashion-dark bg-gray-100 px-2.5 py-1 rounded-lg">
                      #{orderId ? orderId.slice(-8).toUpperCase() : 'ORDER'}
                    </span>
                    <span className="text-xs text-fashion-gray font-medium">
                      • {order?.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Recent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Payment Badge */}
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                      {order?.payment_status || 'CASH ON DELIVERY'}
                    </span>

                    {/* Order Status Badge */}
                    {isCancelled ? (
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                        <FiX size={12} /> CANCELLED
                      </span>
                    ) : isDelivered ? (
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <FiCheckCircle size={12} /> DELIVERED
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                        {order?.order_status ? order.order_status.replace(/_/g, ' ') : 'PROCESSING'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cancelled Alert Banner inside card */}
                {isCancelled && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-2">
                    <span className="font-semibold flex items-center gap-1">
                      <FiAlertTriangle size={14} className="text-red-500 shrink-0" />
                      Order Cancelled: <span className="font-bold italic">"{order?.cancel_reason || 'Requested by customer'}"</span>
                    </span>
                    <span className="text-[10px] text-red-600 font-extrabold shrink-0 bg-red-100 px-2 py-0.5 rounded-md">Refund Initiated</span>
                  </div>
                )}

                {/* Card Body: Product Info & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <img
                      src={product?.image?.[0] || '/favicon.png'}
                      alt={product?.name || 'Product Image'}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-100 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h2 className={`text-sm font-bold line-clamp-1 transition-colors ${
                        isCancelled ? 'text-gray-500 line-through' : 'text-fashion-dark group-hover:text-orange-600'
                      }`}>
                        {product?.name || 'Fashion Item'}
                      </h2>
                      {product?.size && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-extrabold bg-orange-50 text-orange-600 border border-orange-200 rounded-md">
                          Size: {product.size}
                        </span>
                      )}
                      <p className="text-xs text-fashion-gray mt-0.5">
                        Amount Paid: <span className="font-bold text-fashion-dark">{DisplayPriceInRupees(order?.totalAmt || 0)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="w-full sm:w-auto flex items-center justify-end gap-2 shrink-0">
                    {!isCancelled && !isDelivered && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedOrderToCancel(order)
                        }}
                        className="flex items-center gap-1 text-xs font-extrabold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-2 rounded-xl border border-red-200 transition-all cursor-pointer"
                        title="Cancel Order"
                      >
                        <FiX size={14} /> Cancel Order
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/order-tracking/${orderId}`)
                      }}
                      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                        isCancelled
                          ? 'text-red-700 bg-red-100 hover:bg-red-600 hover:text-white'
                          : 'text-orange-600 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white'
                      }`}
                    >
                      <FiTruck size={14} /> {isCancelled ? 'View Status' : 'Track Order'} <FiChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* CANCEL ORDER MODAL */}
      {selectedOrderToCancel && (
        <section className="bg-black/70 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-fashion-dark flex items-center gap-2">
                <FiAlertTriangle className="text-red-500" /> Cancel Order
              </h3>
              <button
                onClick={() => setSelectedOrderToCancel(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <p className="text-xs font-bold text-fashion-charcoal">
                Please tell us why you are cancelling this order:
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
                  onClick={() => setSelectedOrderToCancel(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-fashion-dark text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  )
}

export default MyOrders
