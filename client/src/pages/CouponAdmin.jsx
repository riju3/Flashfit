import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FiPlus, FiTag, FiTrash2, FiEdit3, FiStar, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const CouponAdmin = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [code, setCode] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('10')
  const [minOrderValue, setMinOrderValue] = useState('0')
  const [maxUses, setMaxUses] = useState('100')
  const [description, setDescription] = useState('10% OFF on your first purchase!')
  const [isBannerCoupon, setIsBannerCoupon] = useState(false)

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editCoupon, setEditCoupon] = useState(null)

  const [submitting, setSubmitting] = useState(false)

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getAllCoupons })
      if (response.data?.success) {
        setCoupons(response.data.data || [])
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleAddCoupon = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.addCoupon,
        data: {
          code,
          discountPercentage,
          minOrderValue,
          maxUses,
          description,
          isBannerCoupon
        }
      })
      if (response.data?.success) {
        toast.success("Coupon created successfully!")
        setShowAddModal(false)
        setCode('')
        setDiscountPercentage('10')
        setMinOrderValue('0')
        setMaxUses('100')
        setDescription('10% OFF on your first purchase!')
        setIsBannerCoupon(false)
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (coupon) => {
    setEditCoupon({ ...coupon })
    setShowEditModal(true)
  }

  const handleUpdateCoupon = async (e) => {
    e.preventDefault()
    if (!editCoupon?._id) return
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.updateCoupon,
        data: {
          _id: editCoupon._id,
          code: editCoupon.code,
          discountPercentage: editCoupon.discountPercentage,
          minOrderValue: editCoupon.minOrderValue,
          maxUses: editCoupon.maxUses,
          description: editCoupon.description,
          isBannerCoupon: editCoupon.isBannerCoupon,
          status: editCoupon.status
        }
      })
      if (response.data?.success) {
        toast.success("Coupon updated successfully!")
        setShowEditModal(false)
        setEditCoupon(null)
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleBanner = async (coupon) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCoupon,
        data: {
          _id: coupon._id,
          isBannerCoupon: !coupon.isBannerCoupon
        }
      })
      if (response.data?.success) {
        toast.success(coupon.isBannerCoupon ? "Removed from Home Banner" : "Set as Home Page Banner Coupon!")
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleToggleStatus = async (coupon) => {
    try {
      const newStatus = coupon.status === 'Active' ? 'Inactive' : 'Active'
      const response = await Axios({
        ...SummaryApi.updateCoupon,
        data: {
          _id: coupon._id,
          status: newStatus
        }
      })
      if (response.data?.success) {
        toast.success(`Coupon status updated to ${newStatus}`)
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return
    try {
      const response = await Axios({
        ...SummaryApi.deleteCoupon,
        data: { _id: id }
      })
      if (response.data?.success) {
        toast.success("Coupon deleted successfully")
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const bannerCouponObj = coupons.find(c => c.isBannerCoupon)
  const otherCoupons = coupons.filter(c => !c.isBannerCoupon)

  return (
    <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-5xl mx-auto my-6 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-fashion-dark flex items-center gap-2">
            <FiTag className="text-orange-500" /> Coupon & Discount Management
          </h2>
          <p className="text-xs text-fashion-gray mt-0.5">
            Edit first-time coupons, set usage limits, track one-time customer redemptions, and configure the Home Page banner
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-2xl shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <FiPlus size={16} /> Add New Coupon
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-fashion-gray">Loading coupons...</div>
      ) : (
        <div className="space-y-8">

          {/* SECTION 1: Home Page Banner Coupon */}
          <div className="bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-white p-5 rounded-3xl border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
                <FiStar className="text-amber-500 fill-amber-500" /> SECTION 1: Home Page Banner Coupon
              </h3>
              {bannerCouponObj && (
                <span className="text-[11px] font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  Active Banner Showcase
                </span>
              )}
            </div>

            {bannerCouponObj ? (
              <div className="bg-white p-4 rounded-2xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black px-3 py-1 bg-orange-500 text-white rounded-xl tracking-wider">
                      {bannerCouponObj.code}
                    </span>
                    <span className="text-xs font-extrabold text-green-600">
                      {bannerCouponObj.discountPercentage}% OFF
                    </span>
                    <span className="text-xs font-semibold text-fashion-gray">
                      (Min Order: ₹{bannerCouponObj.minOrderValue})
                    </span>
                  </div>
                  <p className="text-xs font-medium text-fashion-dark pt-1">{bannerCouponObj.description}</p>
                  <p className="text-[11px] text-fashion-gray font-bold">
                    Usage Tracker: {bannerCouponObj.usesCount} / {bannerCouponObj.maxUses} used ({bannerCouponObj.maxUses - bannerCouponObj.usesCount} remaining)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(bannerCouponObj)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-fashion-dark font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FiEdit3 size={14} className="text-orange-500" /> Edit Code & Rules
                  </button>
                  <button
                    onClick={() => handleToggleBanner(bannerCouponObj)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Unset Banner
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs font-bold text-fashion-gray bg-white rounded-2xl border border-dashed border-amber-200">
                No coupon is set as the Home Page Banner. Click "Set as Banner" on any coupon below!
              </div>
            )}
          </div>

          {/* SECTION 2: Other Store Promotional Coupons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-fashion-dark flex items-center gap-2">
                <FiTag className="text-orange-500" /> SECTION 2: All Promotional Coupons
              </h3>
              <span className="text-xs font-bold text-fashion-gray">Total: {coupons.length} Coupons</span>
            </div>

            {coupons.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-fashion-gray bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No coupons found.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-xs text-left text-fashion-dark">
                  <thead className="bg-orange-50/60 text-orange-600 font-extrabold uppercase text-[11px] border-b border-orange-100">
                    <tr>
                      <th className="p-3">Coupon Code</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Min Order</th>
                      <th className="p-3">Usage Count / Limit</th>
                      <th className="p-3">Home Banner</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {coupons.map((coupon) => {
                      const remaining = coupon.maxUses - coupon.usesCount
                      const isExpired = remaining <= 0

                      return (
                        <tr key={coupon._id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="p-3 font-extrabold text-fashion-dark">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-lg tracking-wider border border-orange-200">
                              {coupon.code}
                            </span>
                            {coupon.description && (
                              <p className="text-[10px] text-fashion-gray font-normal mt-0.5">{coupon.description}</p>
                            )}
                          </td>
                          <td className="p-3 font-bold text-green-600">{coupon.discountPercentage}% OFF</td>
                          <td className="p-3">₹{coupon.minOrderValue}</td>
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <span className="font-extrabold">{coupon.usesCount} / {coupon.maxUses} used</span>
                              <br />
                              {isExpired ? (
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-md">
                                  EXPIRED (0 Left)
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-green-50 text-green-700 rounded-md">
                                  {remaining} Left
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleBanner(coupon)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                coupon.isBannerCoupon
                                  ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <FiStar size={12} className={coupon.isBannerCoupon ? 'fill-amber-500 text-amber-500' : ''} />
                              {coupon.isBannerCoupon ? 'Active Banner' : 'Set as Banner'}
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleStatus(coupon)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                                coupon.status === 'Active'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-red-50 text-red-600 border-red-200'
                              }`}
                            >
                              {coupon.status}
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => openEditModal(coupon)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Coupon Code & Rules"
                            >
                              <FiEdit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(coupon._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Coupon"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiTag className="text-orange-500" /> Create New Coupon
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-fashion-dark flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FIRST10"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs uppercase font-extrabold tracking-wider focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    value={discountPercentage}
                    onChange={e => setDiscountPercentage(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={maxUses}
                    onChange={e => setMaxUses(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minOrderValue}
                  onChange={e => setMinOrderValue(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Description / Banner Text</label>
                <input
                  type="text"
                  placeholder="e.g. 10% OFF on your first purchase!"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs font-semibold text-fashion-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBannerCoupon}
                  onChange={e => setIsBannerCoupon(e.target.checked)}
                  className="w-4 h-4 text-orange-500 rounded border-gray-300"
                />
                <span>Set as Home Page Promotional Banner Coupon</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-fashion-dark font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {showEditModal && editCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiEdit3 className="text-orange-500" /> Edit Coupon ({editCoupon.code})
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-fashion-dark flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCoupon} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={editCoupon.code}
                  onChange={e => setEditCoupon({ ...editCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs uppercase font-extrabold tracking-wider focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editCoupon.discountPercentage}
                    onChange={e => setEditCoupon({ ...editCoupon, discountPercentage: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={editCoupon.maxUses}
                    onChange={e => setEditCoupon({ ...editCoupon, maxUses: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editCoupon.minOrderValue}
                  onChange={e => setEditCoupon({ ...editCoupon, minOrderValue: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Description / Banner Text</label>
                <input
                  type="text"
                  value={editCoupon.description}
                  onChange={e => setEditCoupon({ ...editCoupon, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-fashion-dark cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCoupon.isBannerCoupon}
                    onChange={e => setEditCoupon({ ...editCoupon, isBannerCoupon: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300"
                  />
                  <span>Show as Banner Coupon</span>
                </label>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span>Status:</span>
                  <select
                    value={editCoupon.status}
                    onChange={e => setEditCoupon({ ...editCoupon, status: e.target.value })}
                    className="p-1 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-fashion-dark font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default CouponAdmin
