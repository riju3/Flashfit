import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FiShoppingBag, FiUser, FiMapPin, FiClock, FiRefreshCw, FiRepeat, FiRotateCcw } from 'react-icons/fi'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.adminAllOrders
      })
      if (response.data.success) {
        setOrders(response.data.data || [])
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus, isReturnStatus = false) => {
    try {
      setUpdatingId(orderId)
      const payload = { orderId }
      if (isReturnStatus) {
        payload.return_status = newStatus
      } else {
        payload.order_status = newStatus
      }

      const response = await Axios({
        ...SummaryApi.adminUpdateOrderStatus,
        data: payload
      })
      if (response.data.success) {
        toast.success(`Updated order ${isReturnStatus ? 'return status' : 'status'} to ${newStatus}`)
        fetchAllOrders()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const currentStatus = order.order_status || 'CONFIRMED'
    const returnStatus = order.return_status || ''
    
    if (filter === 'ALL') return true
    if (filter === 'RETURN_REQUESTED') return returnStatus.includes('RETURN')
    if (filter === 'REPLACE_REQUESTED') return returnStatus.includes('REPLACE')
    return currentStatus === filter
  })

  return (
    <section className="bg-white px-2.5 py-3.5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-6xl mx-auto my-1 sm:my-4 space-y-3.5">
      
      {/* Header Mobile Responsive */}
      <div className="flex flex-row justify-between items-center gap-2 border-b border-gray-100 pb-2.5">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm sm:text-xl font-extrabold text-fashion-dark flex items-center gap-1.5 truncate">
            <FiShoppingBag className="text-orange-500 shrink-0" size={16} />
            <span className="truncate">Customer Orders & Returns</span>
            <span className="text-[10px] sm:text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold shrink-0">Admin</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-fashion-gray truncate">Manage customer purchases, returns, and replacements</p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchAllOrders}
          disabled={loading}
          className="text-[11px] sm:text-xs font-extrabold bg-gray-100 hover:bg-gray-200 text-fashion-dark px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer border border-gray-200"
        >
          <FiRefreshCw size={12} className={loading ? "animate-spin text-orange-500" : "text-fashion-dark"} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 text-xs font-bold w-full border-b border-gray-100">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'CONFIRMED', label: 'Confirmed' },
          { id: 'PACKING', label: 'Packing' },
          { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'RETURN_REQUESTED', label: 'Returns' },
          { id: 'REPLACE_REQUESTED', label: 'Replacements' },
          { id: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => {
          const count = tab.id === 'ALL' 
            ? orders.length 
            : tab.id === 'RETURN_REQUESTED'
            ? orders.filter(o => (o.return_status || '').includes('RETURN')).length
            : tab.id === 'REPLACE_REQUESTED'
            ? orders.filter(o => (o.return_status || '').includes('REPLACE')).length
            : orders.filter(o => (o.order_status || 'CONFIRMED') === tab.id).length

          return (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs ${
                filter === tab.id
                  ? 'bg-orange-500 text-white shadow-xs font-extrabold'
                  : 'bg-gray-100 text-fashion-gray hover:bg-gray-200 font-semibold'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-fashion-dark font-bold'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-10 text-fashion-gray animate-pulse font-semibold text-xs sm:text-sm">
          Loading customer orders & return requests...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-xs sm:text-sm font-bold text-fashion-gray">No orders found under "{filter.replace(/_/g, ' ')}".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const customer = order.userId
            const address = order.delivery_address
            const product = order.product_details
            const currentStatus = order.order_status || 'CONFIRMED'
            const returnStatus = order.return_status || ''

            return (
              <div
                key={order._id}
                className={`p-3 sm:p-5 rounded-2xl border transition-all w-full ${
                  returnStatus
                    ? 'bg-orange-50/30 border-orange-300 shadow-sm'
                    : currentStatus === 'CANCELLED'
                    ? 'bg-red-50/40 border-red-200'
                    : currentStatus === 'DELIVERED'
                    ? 'bg-green-50/30 border-green-200'
                    : 'bg-white border-gray-200 hover:border-orange-200 shadow-xs'
                }`}
              >
                {/* Order Top Header Mobile Responsive */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-2 mb-2.5 gap-2 w-full">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] sm:text-xs font-mono font-bold bg-gray-100 text-fashion-dark px-2 py-0.5 rounded-lg border border-gray-200">
                      #{order._id ? order._id.slice(-8).toUpperCase() : 'ORDER'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-fashion-gray flex items-center gap-1">
                      <FiClock size={11} className="shrink-0" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                      }) : 'Recent'}
                    </span>
                  </div>

                  {/* Status Selectors */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <span className="text-[11px] font-bold text-fashion-gray">Status:</span>
                    <select
                      value={currentStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-[11px] sm:text-xs font-extrabold px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                        currentStatus === 'DELIVERED'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : currentStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : currentStatus === 'OUT_FOR_DELIVERY'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PACKING">PACKING</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* PROMINENT RETURN / REPLACE ALERT BOX IF USER SUBMITTED RETURN OR EXCHANGE */}
                {returnStatus && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-orange-100/90 via-amber-100/80 to-orange-100/90 border border-orange-300 rounded-xl text-xs space-y-1 shadow-xs">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="font-extrabold text-orange-950 flex items-center gap-1.5 text-xs">
                        {order.return_type === 'REPLACE' ? <FiRepeat className="text-orange-600" size={14} /> : <FiRotateCcw className="text-orange-600" size={14} />}
                        {order.return_type === 'REPLACE' ? 'REPLACEMENT / EXCHANGE REQUESTED' : 'RETURN & REFUND REQUESTED'}
                      </span>

                      {/* Admin Return Status Control */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-orange-900">Return Action:</span>
                        <select
                          value={returnStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value, true)}
                          className="text-[11px] font-black px-2 py-1 rounded-lg bg-white border border-orange-400 text-orange-900 focus:outline-none cursor-pointer"
                        >
                          <option value="RETURN_REQUESTED">RETURN_REQUESTED</option>
                          <option value="REPLACE_REQUESTED">REPLACE_REQUESTED</option>
                          <option value="RETURN_APPROVED">RETURN_APPROVED</option>
                          <option value="REPLACE_APPROVED">REPLACE_APPROVED</option>
                          <option value="RETURN_REJECTED">RETURN_REJECTED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-orange-900 font-semibold text-[11px]">
                      Reason: <span className="font-extrabold italic">"{order.return_reason || 'N/A'}"</span>
                    </p>
                  </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs w-full">
                  
                  {/* Customer Info */}
                  <div className="space-y-0.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    <p className="font-bold text-fashion-dark uppercase text-[10px] tracking-wider flex items-center gap-1 text-gray-500 mb-0.5">
                      <FiUser size={11} className="shrink-0" /> Customer
                    </p>
                    <p className="font-extrabold text-fashion-dark text-xs truncate">{customer?.name || 'Customer'}</p>
                    <p className="text-fashion-gray truncate text-[11px]">{customer?.email || 'N/A'}</p>
                    <p className="text-fashion-dark font-semibold text-[11px] truncate">Mobile: {customer?.mobile || address?.mobile || 'N/A'}</p>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-2.5 items-center bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    <img
                      src={product?.image?.[0] || '/favicon.png'}
                      alt={product?.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-fashion-dark line-clamp-1 text-xs">{product?.name || 'Item'}</p>
                      {product?.size && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-extrabold bg-orange-50 text-orange-600 border border-orange-200 rounded-md">
                          Size: {product.size}
                        </span>
                      )}
                      <p className="text-orange-600 font-extrabold mt-0.5 text-xs">
                        {DisplayPriceInRupees(order.totalAmt || 0)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold">{order.payment_status || 'PAID'}</p>
                    </div>
                  </div>

                  {/* Delivery Address & Cancel Reason */}
                  <div className="space-y-0.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    <p className="font-bold text-fashion-dark uppercase text-[10px] tracking-wider flex items-center gap-1 text-gray-500 mb-0.5">
                      <FiMapPin size={11} className="shrink-0" /> Delivery Location
                    </p>
                    {address ? (
                      <>
                        <p className="font-semibold text-fashion-dark truncate text-xs">{address.address_line}</p>
                        <p className="text-fashion-gray text-[11px] truncate">{address.city}, {address.state} - {address.pincode}</p>
                      </>
                    ) : (
                      <p className="text-fashion-gray text-[11px]">Standard Express Address</p>
                    )}

                    {currentStatus === 'CANCELLED' && (
                      <div className="mt-1.5 pt-1.5 border-t border-red-200 text-red-600 font-semibold">
                        <p className="text-[10px] font-bold uppercase text-red-500">Cancellation Reason:</p>
                        <p className="text-[11px] italic bg-red-100/70 p-1.5 rounded-lg mt-0.5 break-words">
                          "{order.cancel_reason || 'Cancelled by user'}"
                        </p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )
          })}
        </div>
      )}

    </section>
  )
}

export default AdminOrders
