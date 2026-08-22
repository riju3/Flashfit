import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import UploadImage from '../utils/UploadImage'
import { FiPlus, FiTrash2, FiLink, FiTag, FiShoppingBag, FiLayers } from 'react-icons/fi'

const DEFAULT_BRANDS = [
  { name: "Levi's", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg", query: "Levis" },
  { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", query: "Nike" },
  { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", query: "Adidas" },
  { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma-Logo.png", query: "Puma" },
  { name: "Wrangler", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Wrangler_Jeans_logo.svg", query: "Wrangler" },
  { name: "Lee", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Lee_Jeans_logo.svg", query: "Lee" },
  { name: "Tommy Hilfiger", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Tommy_Hilfiger_logo.svg", query: "Tommy" },
  { name: "Calvin Klein", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Calvin_klein_logo.svg", query: "Calvin" },
  { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", query: "Zara" },
  { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg", query: "HM" },
  { name: "Spykar", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Spykar_Logo.svg/512px-Spykar_Logo.svg.png", query: "Spykar" }
]

const AdminSettings = () => {
  const [upiId, setUpiId] = useState('')
  const [supportPhone, setSupportPhone] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [brandLogos, setBrandLogos] = useState([])
  const [virtualTryOnEnabled, setVirtualTryOnEnabled] = useState(true)
  const [loading, setLoading] = useState(false)

  // Add Brand Form State
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandLogo, setNewBrandLogo] = useState('')
  const [newBrandQuery, setNewBrandQuery] = useState('')
  const [logoInputMode, setLogoInputMode] = useState('URL')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSettings
      })
      if (response.data.success && response.data.data) {
        const data = response.data.data
        setUpiId(data.upiId || '')
        setSupportPhone(data.supportPhone || '+91 98765 43210')
        setSupportEmail(data.supportEmail || 'support@flashfit.com')
        setStoreAddress(data.storeAddress || '42 Fashion Street, Mumbai, MH 400001')
        setBrandLogos(data.brandLogos && data.brandLogos.length > 0 ? data.brandLogos : DEFAULT_BRANDS)
        setVirtualTryOnEnabled(data.virtualTryOnEnabled !== false)
      } else {
        setBrandLogos(DEFAULT_BRANDS)
      }
    } catch (error) {
      AxiosToastError(error)
      setBrandLogos(DEFAULT_BRANDS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleLogoFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploadingLogo(true)
      const response = await UploadImage(file)
      if (response.data?.success) {
        setNewBrandLogo(response.data.data.url)
        toast.success("Logo uploaded successfully!")
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleAddBrand = (e) => {
    e.preventDefault()
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name")
      return
    }
    if (!newBrandLogo.trim()) {
      toast.error("Please provide a brand logo URL or upload an image")
      return
    }

    const newBrand = {
      name: newBrandName.trim(),
      logo: newBrandLogo.trim(),
      query: newBrandQuery.trim() || newBrandName.trim()
    }

    setBrandLogos(prev => [...prev, newBrand])
    setNewBrandName('')
    setNewBrandLogo('')
    setNewBrandQuery('')
    toast.success(`Added ${newBrand.name} to marquee list!`)
  }

  const handleDeleteBrand = (index) => {
    setBrandLogos(prev => prev.filter((_, i) => i !== index))
    toast.success("Brand logo removed")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateSettings,
        data: {
          upiId,
          supportPhone,
          supportEmail,
          storeAddress,
          brandLogos,
          virtualTryOnEnabled
        }
      })
      if (response.data.success) {
        toast.success("Store Settings & Virtual Try-On configuration saved successfully!")
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6 px-4">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-fashion-dark flex items-center gap-2">
            <FiShoppingBag className="text-orange-500" /> Store Settings & Global Features
          </h1>
          <p className="text-xs text-fashion-gray mt-0.5">Manage store details, global Virtual Try-On feature, and brand logos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* GLOBAL VIRTUAL TRY-ON CONTROL CARD */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiLayers className="text-orange-500" /> Global FlashFit Virtual Try-On Control
              </h2>
              <p className="text-xs text-fashion-gray">Control whether the Virtual Try-On feature is visible across all products in your store</p>
            </div>

            <span className={`text-xs font-black px-3 py-1 rounded-full ${virtualTryOnEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {virtualTryOnEnabled ? 'Active on All Products' : 'Disabled (Hidden)'}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50/70 rounded-2xl border border-orange-200">
            <div>
              <h3 className="text-xs font-extrabold text-fashion-dark">FlashFit Virtual Try-On Feature Status</h3>
              <p className="text-[11px] text-fashion-gray mt-0.5">
                {virtualTryOnEnabled
                  ? 'ON: "FlashFit Virtual Try-On" link will be displayed next to Select Size on all product pages.'
                  : 'OFF: "FlashFit Virtual Try-On" link is hidden from all product pages.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setVirtualTryOnEnabled(!virtualTryOnEnabled)}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer border ${
                  virtualTryOnEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-700'
                    : 'bg-red-600 hover:bg-red-700 text-white border-red-700'
                }`}
              >
                {virtualTryOnEnabled ? 'ON (SHOW ON STORE)' : 'OFF (HIDE FROM STORE)'}
              </button>
            </div>
          </div>
        </section>
        
        {/* BRAND LOGOS MANAGEMENT SECTION */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-base font-extrabold text-fashion-dark flex items-center gap-2">
                <FiTag className="text-orange-500" /> Premium Brand Logos (Home Marquee)
              </h2>
              <p className="text-xs text-fashion-gray">Add real brand logo images by URL or file upload</p>
            </div>
            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              {brandLogos.length} Brands
            </span>
          </div>

          {/* ADD NEW BRAND LOGO FORM */}
          <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 space-y-4">
            <h3 className="text-xs font-black uppercase text-orange-900 tracking-wider">Add New Brand Logo</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Levi's, Nike, Puma"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fashion-dark mb-1">Search Tag / Query</label>
                <input
                  type="text"
                  placeholder="e.g. Levis or Men"
                  value={newBrandQuery}
                  onChange={(e) => setNewBrandQuery(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-fashion-dark">Logo Source *</label>
                  <div className="flex gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setLogoInputMode('URL')}
                      className={`px-2 py-0.5 rounded-md ${logoInputMode === 'URL' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoInputMode('FILE')}
                      className={`px-2 py-0.5 rounded-md ${logoInputMode === 'FILE' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {logoInputMode === 'URL' ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Paste Image URL (https://...)"
                      value={newBrandLogo}
                      onChange={(e) => setNewBrandLogo(e.target.value)}
                      className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 pr-8"
                    />
                    <FiLink className="absolute right-3 top-3 text-gray-400" size={14} />
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="w-full p-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none cursor-pointer"
                    />
                    {uploadingLogo && <span className="text-[10px] text-orange-600 font-bold block mt-1">Uploading image...</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Preview & Add Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {newBrandLogo ? (
                <div className="flex items-center gap-3 bg-white p-2 px-3 rounded-xl border border-orange-200 w-full sm:w-auto">
                  <span className="text-[11px] font-bold text-gray-500">Preview:</span>
                  <img src={newBrandLogo} alt="Preview" className="h-8 max-w-[120px] object-contain" />
                </div>
              ) : (
                <span className="text-[11px] text-gray-400 italic">No image provided yet</span>
              )}

              <button
                type="button"
                onClick={handleAddBrand}
                className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiPlus size={16} /> Add Brand Logo
              </button>
            </div>
          </div>

          {/* ACTIVE BRAND LOGOS GRID */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-fashion-dark uppercase tracking-wider">
              Active Brand Partners ({brandLogos.length})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {brandLogos.map((brand, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between items-center text-center relative group hover:border-orange-300 transition-all min-h-[90px]"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteBrand(index)}
                    className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-80 hover:opacity-100 cursor-pointer"
                    title="Remove Brand"
                  >
                    <FiTrash2 size={13} />
                  </button>

                  <div className="h-10 flex items-center justify-center w-full px-2 mt-2">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="h-8 max-w-[100px] object-contain" />
                    ) : (
                      <span className="text-xs font-extrabold text-orange-600 uppercase">{brand.name}</span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-fashion-dark mt-2 truncate w-full">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STORE & SUPPORT SETTINGS */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-extrabold text-fashion-dark border-b pb-3">Store & Support Information</h2>

          <div>
            <label className="block text-xs font-bold text-fashion-charcoal mb-1">
              Merchant UPI ID (e.g. flashfit@upi, 9876543210@paytm)
            </label>
            <input
              type="text"
              placeholder="Enter your UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fashion-charcoal mb-1">
              Customer Support Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fashion-charcoal mb-1">
              Customer Support Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. support@flashfit.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fashion-charcoal mb-1">
              Store Physical Contact Address
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 42 Fashion Street, Mumbai, MH 400001"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            ></textarea>
          </div>
        </section>

        {/* SAVE ALL SETTINGS BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm rounded-2xl shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving Settings..." : "Save All Store Settings"}
        </button>
      </form>
    </div>
  )
}

export default AdminSettings
