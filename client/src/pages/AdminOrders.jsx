import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FiShoppingBag, FiUser, FiMapPin, FiClock, FiRefreshCw } from 'react-icons/fi'

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      const response = await Axios({
        ...SummaryApi.adminUpdateOrderStatus,
        data: {
          orderId,
          order_status: newStatus
        }
      })
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`)
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
    if (filter === 'ALL') return true
    return currentStatus === filter
  })

  return (
    <section className="bg-white p-3 sm:p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-6xl mx-auto my-2 sm:my-4 space-y-4 overflow-hidden">
      
      {/* Header Mobile Responsive */}
      <div className="flex flex-row justify-between items-center gap-2 border-b border-gray-100 pb-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-xl font-extrabold text-fashion-dark flex items-center gap-1.5 truncate">
            <FiShoppingBag className="text-orange-500 shrink-0" size={18} />
            <span className="truncate">Customer Orders</span>
            <span className="hidden sm:inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold">Admin</span>
          </h1>
          <p className="text-[11px] text-fashion-gray truncate">Manage all customer purchases & order statuses</p>
        </div>

        {/* Refresh Button with Icon (NO Emoji) */}
        <button
          onClick={fetchAllOrders}
          disabled={loading}
          className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-fashion-dark px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-gray-200"
        >
          <FiRefreshCw size={13} className={loading ? "animate-spin text-orange-500" : "text-fashion-dark"} />
          <span className="hidden sm:inline">Refresh Orders</span>
          <span className="sm:hidden">Refresh</span>
        </button>
      </div>

      {/* Filter Tabs Scrollable on Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-bold scrollbar-none w-full min-w-0 flex-nowrap border-b border-gray-100">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'CONFIRMED', label: 'Confirmed' },
          { id: 'PACKING', label: 'Packing' },
          { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => {
          const count = tab.id === 'ALL' 
            ? orders.length 
            : orders.filter(o => (o.order_status || 'CONFIRMED') === tab.id).length

          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shrink-0 transition-all flex items-center gap-1 cursor-pointer text-xs ${
                filter === tab.id
                  ? 'bg-orange-500 text-white shadow-xs font-extrabold'
                  : 'bg-gray-100 text-fashion-gray hover:bg-gray-200 font-semibold'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-fashion-dark'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 text-fashion-gray animate-pulse font-semibold text-xs sm:text-sm">
          Loading customer orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-xs sm:text-sm font-bold text-fashion-gray">No orders found under "{filter.replace(/_/g, ' ')}".</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => {
            const customer = order.userId
            const address = order.delivery_address
            const product = order.product_details
            const currentStatus = order.order_status || 'CONFIRMED'

            return (
              <div
                key={order._id}
                className={`p-3.5 sm:p-5 rounded-2xl border transition-all w-full min-w-0 ${
                  currentStatus === 'CANCELLED'
                    ? 'bg-red-50/40 border-red-200'
                    : currentStatus === 'DELIVERED'
                    ? 'bg-green-50/30 border-green-200'
                    : 'bg-white border-gray-200 hover:border-orange-200 shadow-xs'
                }`}
              >
                {/* Order Top Header Mobile Responsive */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-2.5 mb-3 gap-2 w-full min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="text-[11px] sm:text-xs font-mono font-bold bg-gray-100 text-fashion-dark px-2 py-0.5 rounded-lg border border-gray-200">
                      #{order._id ? order._id.slice(-8).toUpperCase() : 'ORDER'}
                    </span>
                    <span className="text-[11px] text-fashion-gray flex items-center gap-1">
                      <FiClock size={11} className="shrink-0" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
                      }) : 'Recent'}
                    </span>
                  </div>

                  {/* Status Dropdown Selector */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <span className="text-[11px] sm:text-xs font-bold text-fashion-gray">Status:</span>
                    <select
                      value={currentStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
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

                {/* Main Content Grid Mobile Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs w-full min-w-0">
                  
                  {/* Customer Info */}
                  <div className="space-y-0.5 bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-100 min-w-0">
                    <p className="font-bold text-fashion-dark uppercase text-[10px] tracking-wider flex items-center gap-1 text-gray-500 mb-0.5">
                      <FiUser size={11} className="shrink-0" /> Customer
                    </p>
                    <p className="font-extrabold text-fashion-dark truncate">{customer?.name || 'Customer'}</p>
                    <p className="text-fashion-gray truncate text-[11px]">{customer?.email || 'N/A'}</p>
                    <p className="text-fashion-dark font-semibold text-[11px] truncate">Mobile: {customer?.mobile || address?.mobile || 'N/A'}</p>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-2.5 items-center bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-100 min-w-0">
                    <img
                      src={product?.image?.[0] || '/favicon.png'}
                      alt={product?.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-fashion-dark line-clamp-1 text-xs">{product?.name || 'Item'}</p>
                      <p className="text-orange-600 font-extrabold mt-0.5 text-xs">
                        {DisplayPriceInRupees(order.totalAmt || 0)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold">{order.payment_status || 'PAID'}</p>
                    </div>
                  </div>

                  {/* Delivery Address & Cancel Reason if applicable */}
                  <div className="space-y-0.5 bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-100 min-w-0">
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

                    {/* Cancellation Reason Alert if Cancelled */}
                    {currentStatus === 'CANCELLED' && (
                      <div className="mt-2 pt-1.5 border-t border-red-200 text-red-600 font-semibold min-w-0">
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
