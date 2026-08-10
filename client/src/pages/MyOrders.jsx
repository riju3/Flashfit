import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FiTruck, FiChevronRight, FiPackage, FiX, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const { fetchOrder } = useGlobalContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (fetchOrder) {
      fetchOrder()
    }
  }, [])

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
              <p className="text-xs text-fashion-gray">Track status and view details for all your purchases</p>
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

                {/* Return / Replace Alert Banner inside card */}
                {order?.return_status && order.return_status !== 'NONE' && (
                  <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-0.5">
                    <div className="flex justify-between items-center font-bold">
                      <span>{order.return_type === 'REPLACE' ? 'Exchange Request' : 'Return & Refund Request'}</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-extrabold">
                        {order.return_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600">Reason: <span className="font-semibold italic">"{order?.return_reason}"</span></p>
                    {order?.return_comment && (
                      <p className="text-amber-800 font-medium">Notes: <span className="font-bold">"{order.return_comment}"</span></p>
                    )}
                  </div>
                )}

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

                {/* Card Body: Product Info & Action */}
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

                  {/* Track Order Button Only */}
                  <div className="w-full sm:w-auto flex items-center justify-end shrink-0">
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
    </div>
  )
}

export default MyOrders
