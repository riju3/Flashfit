import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FiShoppingBag, FiUser, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiBox } from 'react-icons/fi'

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
    <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto my-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-fashion-dark flex items-center gap-2">
            <FiShoppingBag className="text-orange-500" /> Customer Orders Management (Admin)
          </h1>
          <p className="text-xs text-fashion-gray">View, update status, and manage all customer purchases</p>
        </div>
        <button
          onClick={fetchAllOrders}
          className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-fashion-dark px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-none">
        {['ALL', 'CONFIRMED', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-2 rounded-xl shrink-0 transition-all ${
              filter === tab
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-gray-100 text-fashion-gray hover:bg-gray-200'
            }`}
          >
            {tab === 'ALL' ? 'All Orders' : tab.replace(/_/g, ' ')}
            <span className="ml-1.5 opacity-80 text-[10px]">
              ({tab === 'ALL' ? orders.length : orders.filter(o => (o.order_status || 'CONFIRMED') === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 text-fashion-gray animate-pulse font-semibold text-sm">
          Loading all customer orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-sm font-bold text-fashion-gray">No orders found for this status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const customer = order.userId
            const address = order.delivery_address
            const product = order.product_details
            const currentStatus = order.order_status || 'CONFIRMED'

            return (
              <div
                key={order._id}
                className={`p-5 rounded-2xl border transition-all ${
                  currentStatus === 'CANCELLED'
                    ? 'bg-red-50/40 border-red-200'
                    : currentStatus === 'DELIVERED'
                    ? 'bg-green-50/30 border-green-200'
                    : 'bg-white border-gray-200 hover:border-orange-200 shadow-sm'
                }`}
              >
                {/* Order Top Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-3 mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-gray-100 text-fashion-dark px-2.5 py-1 rounded-lg">
                      #{order._id ? order._id.slice(-8).toUpperCase() : 'ORDER'}
                    </span>
                    <span className="text-xs text-fashion-gray flex items-center gap-1">
                      <FiClock size={12} />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                      }) : 'Recent'}
                    </span>
                  </div>

                  {/* Status Dropdown Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-fashion-gray">Status:</span>
                    <select
                      value={currentStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
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

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Customer Info */}
                  <div className="space-y-1 bg-gray-50/70 p-3 rounded-xl">
                    <p className="font-bold text-fashion-dark uppercase text-[10px] tracking-wider flex items-center gap-1 text-gray-500 mb-1">
                      <FiUser size={12} /> Customer
                    </p>
                    <p className="font-extrabold text-fashion-dark">{customer?.name || 'Customer'}</p>
                    <p className="text-fashion-gray truncate">{customer?.email || 'N/A'}</p>
                    <p className="text-fashion-dark font-semibold">Mobile: {customer?.mobile || address?.mobile || 'N/A'}</p>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-3 items-center bg-gray-50/70 p-3 rounded-xl">
                    <img
                      src={product?.image?.[0] || '/favicon.png'}
                      alt={product?.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-fashion-dark line-clamp-1">{product?.name || 'Item'}</p>
                      <p className="text-orange-600 font-extrabold mt-0.5">
                        {DisplayPriceInRupees(order.totalAmt || 0)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold">{order.payment_status || 'PAID'}</p>
                    </div>
                  </div>

                  {/* Delivery Address & Cancel Reason if applicable */}
                  <div className="space-y-1 bg-gray-50/70 p-3 rounded-xl">
                    <p className="font-bold text-fashion-dark uppercase text-[10px] tracking-wider flex items-center gap-1 text-gray-500 mb-1">
                      <FiMapPin size={12} /> Delivery Location
                    </p>
                    {address ? (
                      <>
                        <p className="font-semibold text-fashion-dark truncate">{address.address_line}</p>
                        <p className="text-fashion-gray">{address.city}, {address.state} - {address.pincode}</p>
                      </>
                    ) : (
                      <p className="text-fashion-gray">Standard Delivery Address</p>
                    )}

                    {/* Cancellation Reason Alert if Cancelled */}
                    {currentStatus === 'CANCELLED' && (
                      <div className="mt-2 pt-2 border-t border-red-200 text-red-600 font-semibold">
                        <p className="text-[10px] font-bold uppercase text-red-500">Cancellation Reason:</p>
                        <p className="text-xs italic bg-red-100/60 p-1.5 rounded-lg mt-0.5">
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
