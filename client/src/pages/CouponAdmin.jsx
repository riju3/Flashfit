import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FiPlus, FiTag, FiTrash2, FiEdit3, FiStar, FiLayers, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const THEME_OPTIONS = [
  { id: 'orange', label: 'Vibrant Orange', preview: 'from-orange-600 via-amber-500 to-rose-600' },
  { id: 'darkRed', label: 'Dark Red / Crimson', preview: 'from-stone-900 via-red-950 to-orange-700' },
  { id: 'midnight', label: 'Midnight Luxury', preview: 'from-slate-950 via-indigo-950 to-amber-600' },
  { id: 'purple', label: 'Royal Purple', preview: 'from-purple-950 via-fuchsia-900 to-pink-600' },
  { id: 'emerald', label: 'Emerald Green', preview: 'from-emerald-950 via-teal-900 to-lime-600' },
  { id: 'gold', label: 'Warm Gold', preview: 'from-amber-950 via-yellow-700 to-amber-500' }
]

const CouponAdmin = () => {
  const [activeTab, setActiveTab] = useState('banners') // 'banners' or 'coupons'
  const [coupons, setCoupons] = useState([])
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)

  // Coupon State
  const [showAddCouponModal, setShowAddCouponModal] = useState(false)
  const [showEditCouponModal, setShowEditCouponModal] = useState(false)
  const [code, setCode] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('10')
  const [minOrderValue, setMinOrderValue] = useState('0')
  const [maxUses, setMaxUses] = useState('100')
  const [description, setDescription] = useState('10% OFF on your first purchase!')
  const [isBannerCoupon, setIsBannerCoupon] = useState(false)
  const [editCoupon, setEditCoupon] = useState(null)

  // Banner State
  const [showAddBannerModal, setShowAddBannerModal] = useState(false)
  const [showEditBannerModal, setShowEditBannerModal] = useState(false)
  const [bEyebrow, setBEyebrow] = useState('EXCLUSIVE DISCOUNT OFFER')
  const [bTitle, setBTitle] = useState('')
  const [bSubtitle, setBSubtitle] = useState('')
  const [bCouponCode, setBCouponCode] = useState('')
  const [bCtaText, setBCtaText] = useState('')
  const [bCtaLink, setBCtaLink] = useState('/search')
  const [bGradientTheme, setBGradientTheme] = useState('orange')
  const [editBanner, setEditBanner] = useState(null)

  const [submitting, setSubmitting] = useState(false)

  const fetchCoupons = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAllCoupons })
      if (response.data?.success) {
        setCoupons(response.data.data || [])
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getAllBanners })
      if (response.data?.success) {
        setBanners(response.data.data || [])
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
    fetchBanners()
  }, [])

  // Coupon Handlers
  const handleAddCoupon = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.addCoupon,
        data: { code, discountPercentage, minOrderValue, maxUses, description, isBannerCoupon }
      })
      if (response.data?.success) {
        toast.success("Coupon created successfully!")
        setShowAddCouponModal(false)
        setCode('')
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateCoupon = async (e) => {
    e.preventDefault()
    if (!editCoupon?._id) return
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.updateCoupon,
        data: editCoupon
      })
      if (response.data?.success) {
        toast.success("Coupon updated successfully!")
        setShowEditCouponModal(false)
        setEditCoupon(null)
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return
    try {
      const response = await Axios({ ...SummaryApi.deleteCoupon, data: { _id: id } })
      if (response.data?.success) {
        toast.success("Coupon deleted")
        fetchCoupons()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // Banner Handlers (Text Only)
  const handleAddBanner = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.addBanner,
        data: {
          eyebrow: bEyebrow,
          title: bTitle,
          subtitle: bSubtitle,
          couponCode: bCouponCode,
          ctaText: bCtaText,
          ctaLink: bCtaLink,
          gradientTheme: bGradientTheme
        }
      })
      if (response.data?.success) {
        toast.success("Promotional text banner created!")
        setShowAddBannerModal(false)
        setBTitle('')
        setBSubtitle('')
        setBCouponCode('')
        setBCtaText('')
        fetchBanners()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateBanner = async (e) => {
    e.preventDefault()
    if (!editBanner?._id) return
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.updateBanner,
        data: editBanner
      })
      if (response.data?.success) {
        toast.success("Banner updated!")
        setShowEditBannerModal(false)
        setEditBanner(null)
        fetchBanners()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleBannerStatus = async (banner) => {
    try {
      const newStatus = banner.status === 'Active' ? 'Inactive' : 'Active'
      const response = await Axios({
        ...SummaryApi.updateBanner,
        data: { _id: banner._id, status: newStatus }
      })
      if (response.data?.success) {
        toast.success(`Banner is now ${newStatus}`)
        fetchBanners()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return
    try {
      const response = await Axios({ ...SummaryApi.deleteBanner, data: { _id: id } })
      if (response.data?.success) {
        toast.success("Banner deleted")
        fetchBanners()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-5xl mx-auto my-6 space-y-6">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-fashion-dark flex items-center gap-2">
            <FiLayers className="text-orange-500" /> Banners & Coupon Management
          </h2>
          <p className="text-xs text-fashion-gray mt-0.5">
            Add custom text banners with smooth sticky stacking effects & manage store discount coupons
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'banners' ? 'bg-white text-orange-600 shadow-sm' : 'text-fashion-gray hover:text-fashion-dark'
            }`}
          >
            🖼️ Homepage Text Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'coupons' ? 'bg-white text-orange-600 shadow-sm' : 'text-fashion-gray hover:text-fashion-dark'
            }`}
          >
            🎟️ Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: HOMEPAGE TEXT BANNERS ── */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
            <div>
              <h3 className="text-sm font-extrabold text-fashion-dark">Custom Homepage Promotional Banners</h3>
              <p className="text-xs text-fashion-gray">Create multiple banners by entering text. They stack & smoothly overlap during scrolling on Home!</p>
            </div>
            <button
              onClick={() => setShowAddBannerModal(true)}
              className="py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <FiPlus size={16} /> Add Text Banner
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-fashion-gray">Loading banners...</div>
          ) : banners.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-fashion-gray bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No custom banners created yet. Click "Add Text Banner" above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((banner, index) => {
                const themeObj = THEME_OPTIONS.find(t => t.id === banner.gradientTheme) || THEME_OPTIONS[0]

                return (
                  <div
                    key={banner._id}
                    className={`bg-gradient-to-r ${themeObj.preview} text-white p-5 rounded-3xl shadow-lg space-y-3 relative overflow-hidden border border-white/20`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                        Banner #{index + 1} • {banner.eyebrow}
                      </span>
                      <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md p-1 rounded-xl">
                        <button
                          onClick={() => {
                            setEditBanner({ ...banner })
                            setShowEditBannerModal(true)
                          }}
                          className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                          title="Edit Banner Text"
                        >
                          <FiEdit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleBannerStatus(banner)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${
                            banner.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {banner.status}
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
                          className="p-1.5 hover:bg-red-500/50 rounded-lg text-red-200 transition-colors cursor-pointer"
                          title="Delete Banner"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xl font-black tracking-tight">{banner.title}</h4>
                    {banner.subtitle && <p className="text-xs text-white/80 font-medium">{banner.subtitle}</p>}

                    {banner.couponCode && (
                      <div className="bg-white text-orange-600 px-4 py-2 rounded-xl font-black text-center text-sm tracking-widest w-fit border border-orange-200 shadow-md">
                        CODE: {banner.couponCode}
                      </div>
                    )}

                    {banner.ctaText && (
                      <div className="pt-1">
                        <span className="inline-block text-xs font-bold bg-white/20 px-3 py-1 rounded-lg border border-white/30">
                          Button: {banner.ctaText} ({banner.ctaLink})
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: COUPONS MANAGEMENT ── */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <h3 className="text-sm font-extrabold text-fashion-dark">Store Discount Coupons</h3>
              <p className="text-xs text-fashion-gray">Manage coupon codes, usage limits & discount percentages</p>
            </div>
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <FiPlus size={16} /> Create Coupon
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-xs text-left text-fashion-dark">
              <thead className="bg-orange-50/60 text-orange-600 font-extrabold uppercase text-[11px] border-b border-orange-100">
                <tr>
                  <th className="p-3">Coupon Code</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Min Order</th>
                  <th className="p-3">Usage Count / Limit</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {coupons.map((c) => {
                  const remaining = c.maxUses - c.usesCount
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-extrabold">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg tracking-wider border border-orange-200">
                          {c.code}
                        </span>
                        {c.description && <p className="text-[10px] text-fashion-gray font-normal mt-0.5">{c.description}</p>}
                      </td>
                      <td className="p-3 font-bold text-green-600">{c.discountPercentage}% OFF</td>
                      <td className="p-3">₹{c.minOrderValue}</td>
                      <td className="p-3 font-extrabold">{c.usesCount} / {c.maxUses} ({remaining <= 0 ? 'EXPIRED' : `${remaining} left`})</td>
                      <td className="p-3"><span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-xl">{c.status}</span></td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditCoupon({ ...c })
                            setShowEditCouponModal(true)
                          }}
                          className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg cursor-pointer"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteCoupon(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ADD TEXT BANNER MODAL ── */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiLayers className="text-orange-500" /> Create Custom Text Banner
              </h3>
              <button onClick={() => setShowAddBannerModal(false)} className="w-7 h-7 rounded-full bg-gray-100 font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Eyebrow / Small Header</label>
                <input
                  type="text"
                  placeholder="e.g. UP TO 60% OFF"
                  value={bEyebrow}
                  onChange={e => setBEyebrow(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Main Banner Title</label>
                <input
                  type="text"
                  placeholder="e.g. End of Season Sale"
                  value={bTitle}
                  onChange={e => setBTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-extrabold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Hundreds of styles at unbeatable prices."
                  value={bSubtitle}
                  onChange={e => setBSubtitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. FIRST10"
                    value={bCouponCode}
                    onChange={e => setBCouponCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Button Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Sale →"
                    value={bCtaText}
                    onChange={e => setBCtaText(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Button Redirect Link</label>
                <input
                  type="text"
                  placeholder="/search?tag=sale"
                  value={bCtaLink}
                  onChange={e => setBCtaLink(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Gradient Theme</label>
                <select
                  value={bGradientTheme}
                  onChange={e => setBGradientTheme(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  {THEME_OPTIONS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowAddBannerModal(false)} className="flex-1 py-2.5 bg-gray-100 font-bold text-xs rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md">
                  {submitting ? "Saving..." : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT TEXT BANNER MODAL ── */}
      {showEditBannerModal && editBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiEdit3 className="text-orange-500" /> Edit Text Banner
              </h3>
              <button onClick={() => setShowEditBannerModal(false)} className="w-7 h-7 rounded-full bg-gray-100 font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleUpdateBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Eyebrow Header</label>
                <input
                  type="text"
                  value={editBanner.eyebrow}
                  onChange={e => setEditBanner({ ...editBanner, eyebrow: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Banner Title</label>
                <input
                  type="text"
                  value={editBanner.title}
                  onChange={e => setEditBanner({ ...editBanner, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-extrabold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={editBanner.subtitle}
                  onChange={e => setEditBanner({ ...editBanner, subtitle: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={editBanner.couponCode}
                    onChange={e => setEditBanner({ ...editBanner, couponCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-fashion-dark mb-1">Button Text</label>
                  <input
                    type="text"
                    value={editBanner.ctaText}
                    onChange={e => setEditBanner({ ...editBanner, ctaText: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Gradient Theme</label>
                <select
                  value={editBanner.gradientTheme}
                  onChange={e => setEditBanner({ ...editBanner, gradientTheme: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  {THEME_OPTIONS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowEditBannerModal(false)} className="flex-1 py-2.5 bg-gray-100 font-bold text-xs rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md">
                  {submitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD COUPON MODAL ── */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiTag className="text-orange-500" /> Create New Coupon
              </h3>
              <button onClick={() => setShowAddCouponModal(false)} className="w-7 h-7 rounded-full bg-gray-100 font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FIRST10"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs uppercase font-extrabold"
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
                    value={maxUses}
                    onChange={e => setMaxUses(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowAddCouponModal(false)} className="flex-1 py-2.5 bg-gray-100 font-bold text-xs rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md">
                  {submitting ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT COUPON MODAL ── */}
      {showEditCouponModal && editCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiEdit3 className="text-orange-500" /> Edit Coupon ({editCoupon.code})
              </h3>
              <button onClick={() => setShowEditCouponModal(false)} className="w-7 h-7 rounded-full bg-gray-100 font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleUpdateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={editCoupon.code}
                  onChange={e => setEditCoupon({ ...editCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs uppercase font-extrabold"
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
                <label className="block text-xs font-bold text-fashion-dark mb-1">Description</label>
                <input
                  type="text"
                  value={editCoupon.description}
                  onChange={e => setEditCoupon({ ...editCoupon, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowEditCouponModal(false)} className="flex-1 py-2.5 bg-gray-100 font-bold text-xs rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md">
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
