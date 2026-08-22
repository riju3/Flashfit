import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt, FaLink } from "react-icons/fa"
import uploadImage from '../utils/UploadImage'
import Loading from '../components/Loading'
import ViewImage from '../components/ViewImage'
import { MdDelete } from "react-icons/md"
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5"
import AddFieldComponent from '../components/AddFieldComponent'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import successAlert from '../utils/SuccessAlert'
import { BsCheckCircleFill } from 'react-icons/bs'
import { FiPlus } from 'react-icons/fi'

const APPAREL_SIZES  = ['XS','S','M','L','XL','XXL','XXXL','Free Size']
const FOOTWEAR_SIZES = ['UK 5','UK 6','UK 7','UK 8','UK 9','UK 10','UK 11']
const TAG_OPTIONS    = [
  { value: 'new-arrival',  label: 'New Arrival', color: '#22C55E' },
  { value: 'trending',     label: 'Trending',    color: '#FF4D00' },
  { value: 'sale',         label: 'Sale',        color: '#E94560' },
  { value: 'best-seller',  label: 'Best Seller', color: '#C9A84C' },
]

const SPEC_PRESETS = [
  {
    id: 'shoes',
    label: '👟 Shoes / Footwear',
    fields: {
      'Sole Material': 'Rubber',
      'Heel Type': 'Flat',
      'Color Family': 'White',
      'Heel Height': '1',
      'Upper Material': 'Synthetic',
      'Net Quantity': '1',
    }
  },
  {
    id: 'clothes',
    label: '👕 Clothes / Apparel',
    fields: {
      'Fabric / Material': 'Cotton',
      'Pattern': 'Solid',
      'Color Family': 'Black',
      'Fit Type': 'Regular Fit',
      'Net Quantity': '1 N',
    }
  },
  {
    id: 'sunglasses',
    label: '🕶️ Sunglasses / Eyewear',
    fields: {
      'Frame Material': 'Acetate',
      'Lens Technology': 'UV400 Protected',
      'Frame Shape': 'Wayfarer',
      'Color Family': 'Black',
      'Gender / Fit': 'Unisex',
      'Net Quantity': '1 N (With Case)',
    }
  },
  {
    id: 'watches',
    label: '⌚ Watches / Accessories',
    fields: {
      'Strap Material': 'Stainless Steel',
      'Movement': 'Analog Quartz',
      'Water Resistance': '3 ATM / 30m',
      'Dial Color': 'Black',
      'Color Family': 'Silver',
      'Net Quantity': '1 N',
    }
  },
  {
    id: 'bags',
    label: '👜 Bags / Backpacks',
    fields: {
      'Material': 'Vegan Leather',
      'Closure Type': 'Zipper',
      'Capacity': '20 Liters',
      'Color Family': 'Brown',
      'Net Quantity': '1 N',
    }
  }
]

const FieldGroup = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="admin-label">{label}</label>
    {children}
  </div>
)

const UploadProduct = () => {
  const [data, setData] = useState({
    name: '', image: [], category: [], subCategory: [],
    unit: '', stock: '', price: '', discount: '', description: '',
    more_details: {}, sizes: [], colors: [], tags: [], keywords: [],
    virtualTryOnEnabled: true,
  })
  const [keywordInput, setKeywordInput] = useState('')

  const addKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase()
    if (!trimmed || (data.keywords && data.keywords.includes(trimmed))) return
    setData(p => ({ ...p, keywords: [...(p.keywords || []), trimmed] }))
    setKeywordInput('')
  }
  const removeKeyword = (kw) => {
    setData(p => ({ ...p, keywords: (p.keywords || []).filter(k => k !== kw) }))
  }
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL]  = useState('')
  const [urlInput, setUrlInput]          = useState('')
  const allCategory    = useSelector(s => s.product.allCategory)
  const [selectCategory, setSelectCategory]       = useState('')
  const [selectSubCategory, setSelectSubCategory] = useState('')
  const allSubCategory = useSelector(s => s.product.allSubCategory)
  const [openAddField, setOpenAddField]  = useState(false)
  const [fieldName, setFieldName]        = useState('')
  const [customColor, setCustomColor]    = useState('#FF4D00')
  const [submitting, setSubmitting]      = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(p => ({ ...p, [name]: value }))
  }

  // File upload
  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageLoading(true)
    const response = await uploadImage(file)
    const imageUrl = response?.data?.data?.url
    if (imageUrl) setData(p => ({ ...p, image: [...p.image, imageUrl] }))
    setImageLoading(false)
  }

  // URL image input
  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return
    setData(p => ({ ...p, image: [...p.image, urlInput.trim()] }))
    setUrlInput('')
  }

  const handleDeleteImage = (index) => {
    setData(p => ({ ...p, image: p.image.filter((_, i) => i !== index) }))
  }

  // Category
  const handleRemoveCategory = (index) => {
    setData(p => ({ ...p, category: p.category.filter((_, i) => i !== index) }))
  }
  const handleRemoveSubCategory = (index) => {
    setData(p => ({ ...p, subCategory: p.subCategory.filter((_, i) => i !== index) }))
  }

  // Sizes — stored as [{size, stock}] objects
  const [customSizeInput, setCustomSizeInput] = useState('')

  const isSizeSelected = (s) => data.sizes.some(x => x.size === s)
  const getSizeStock   = (s) => data.sizes.find(x => x.size === s)?.stock ?? 1

  const toggleSize = (s) => {
    setData(p => ({
      ...p,
      sizes: isSizeSelected(s)
        ? p.sizes.filter(x => x.size !== s)
        : [...p.sizes, { size: s, stock: 1 }]
    }))
  }
  const setSizeStock = (s, qty) => {
    setData(p => ({
      ...p,
      sizes: p.sizes.map(x => x.size === s ? { ...x, stock: Number(qty) } : x)
    }))
  }
  const addCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase()
    if (!trimmed || isSizeSelected(trimmed)) return
    setData(p => ({ ...p, sizes: [...p.sizes, { size: trimmed, stock: 1 }] }))
    setCustomSizeInput('')
  }

  // Colors
  const toggleColor = (c) => {
    setData(p => ({
      ...p,
      colors: p.colors.includes(c) ? p.colors.filter(x => x !== c) : [...p.colors, c]
    }))
  }
  const addCustomColor = () => {
    if (!data.colors.includes(customColor)) toggleColor(customColor)
  }

  // Tags
  const toggleTag = (t) => {
    setData(p => ({
      ...p,
      tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t]
    }))
  }

  // More fields
  const handleAddField = () => {
    setData(p => ({ ...p, more_details: { ...p.more_details, [fieldName]: '' } }))
    setFieldName('')
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await Axios({ ...SummaryApi.createProduct, data })
      const { data: responseData } = response
      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name:'', image:[], category:[], subCategory:[],
          unit:'', stock:'', price:'', discount:'', description:'',
          more_details:{}, sizes:[], colors:[], tags:[],
        })
      }
    } catch (error) { AxiosToastError(error) }
    setSubmitting(false)
  }

  return (
    <section className="bg-fashion-light min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-fashion-dark" style={{fontFamily:'Playfair Display,serif'}}>Upload Product</h1>
          <p className="text-xs text-fashion-gray">Add a new product to your store</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Basic Info Card ── */}
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-fashion-gray border-b border-gray-100 pb-2">Basic Information</h2>

            <FieldGroup label="Product Name *">
              <input
                id="name" type="text" name="name" value={data.name}
                onChange={handleChange} required placeholder="e.g. Classic Slim-Fit Cotton Shirt"
                className="admin-input"
              />
            </FieldGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FieldGroup label="Brand (Optional)">
                <input
                  id="brand" type="text" name="brand" value={data.brand || ''}
                  onChange={handleChange} placeholder="e.g. Woodland, Nike, ZARA, Levi's"
                  className="admin-input"
                />
              </FieldGroup>
              <FieldGroup label="Color (Optional)">
                <input
                  id="color" type="text" name="color" value={data.color || ''}
                  onChange={handleChange} placeholder="e.g. Red, Black, Olive Green, White"
                  className="admin-input"
                />
              </FieldGroup>
            </div>

            <FieldGroup label="Description *">
              <textarea
                id="description" name="description" value={data.description}
                onChange={handleChange} required rows={4}
                placeholder="Describe the product — fabric, fit, occasion..."
                className="admin-input resize-none"
              />
            </FieldGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FieldGroup label="Unit / Size Label">
                <input
                  id="unit" type="text" name="unit" value={data.unit}
                  onChange={handleChange} placeholder="e.g. Per Piece, Set of 2"
                  className="admin-input"
                />
              </FieldGroup>
              <FieldGroup label="Stock Quantity *">
                <input
                  id="stock" type="number" name="stock" value={data.stock}
                  onChange={handleChange} required min={0} placeholder="0"
                  className="admin-input"
                />
              </FieldGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FieldGroup label="Price (₹) *">
                <input
                  id="price" type="number" name="price" value={data.price}
                  onChange={handleChange} required min={0} placeholder="999"
                  className="admin-input"
                />
              </FieldGroup>
              <FieldGroup label="Discount (%)">
                <input
                  id="discount" type="number" name="discount" value={data.discount}
                  onChange={handleChange} min={0} max={100} placeholder="0"
                  className="admin-input"
                />
              </FieldGroup>
            </div>

            {data.price && data.discount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-700 font-medium">
                Selling price: ₹{Math.round(data.price - (data.price * data.discount / 100))}
                &nbsp;·&nbsp; Customer saves ₹{Math.round(data.price * data.discount / 100)}
              </div>
            )}
          </div>

          {/* ── Images Card ── */}
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-fashion-gray border-b border-gray-100 pb-2">Product Images</h2>

            {/* File upload zone */}
            <label htmlFor="productImage" className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary-200 hover:bg-primary-50 transition-all group">
              {imageLoading ? <Loading /> : (
                <>
                  <FaCloudUploadAlt size={32} className="text-gray-300 group-hover:text-primary-200 transition-colors" />
                  <p className="text-sm font-medium text-fashion-gray group-hover:text-primary-200">Click to upload image</p>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                </>
              )}
              <input type="file" id="productImage" className="hidden" accept="image/*" onChange={handleUploadImage} />
            </label>

            {/* URL image input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-fashion-gray" size={13}/>
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                  placeholder="Or paste image URL (https://...)"
                  className="admin-input pl-9"
                />
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-orange"
                style={{background:'linear-gradient(135deg,#FF4D00,#E94560)'}}
              >
                Add
              </button>
            </div>

            {/* Uploaded images */}
            {data.image.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {data.image.map((img, index) => (
                  <div key={img + index} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={img} alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setViewImageURL(img)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdDelete className="text-white" size={18}/>
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-[9px] font-bold text-center bg-primary-200 text-white py-0.5">COVER</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Category Card ── */}
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-fashion-gray border-b border-gray-100 pb-2">Categories</h2>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Category">
                <select className="admin-input" value={selectCategory} onChange={e => {
                  const cat = allCategory.find(el => el._id === e.target.value)
                  if (cat && !data.category.find(c => c._id === cat._id)) {
                    setData(p => ({ ...p, category: [...p.category, cat] }))
                  }
                  setSelectCategory('')
                }}>
                  <option value="">Select Category</option>
                  {allCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <div className="flex flex-wrap gap-2">
                  {data.category.map((c, i) => (
                    <div key={c._id} className="flex items-center gap-1 bg-primary-50 text-primary-200 text-xs font-medium px-2 py-1 rounded-full border border-primary-100">
                      {c.name}
                      <button type="button" onClick={() => handleRemoveCategory(i)}><IoClose size={12}/></button>
                    </div>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup label="Sub Category">
                <select className="admin-input" value={selectSubCategory} onChange={e => {
                  const sub = allSubCategory.find(el => el._id === e.target.value)
                  if (sub && !data.subCategory.find(s => s._id === sub._id)) {
                    setData(p => ({ ...p, subCategory: [...p.subCategory, sub] }))
                  }
                  setSelectSubCategory('')
                }}>
                  <option value="">Select Sub Category</option>
                  {allSubCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <div className="flex flex-wrap gap-2">
                  {data.subCategory.map((c, i) => (
                    <div key={c._id} className="flex items-center gap-1 bg-primary-50 text-primary-200 text-xs font-medium px-2 py-1 rounded-full border border-primary-100">
                      {c.name}
                      <button type="button" onClick={() => handleRemoveSubCategory(i)}><IoClose size={12}/></button>
                    </div>
                  ))}
                </div>
              </FieldGroup>
            </div>
          </div>

          {/* ── Fashion Attributes Card ── */}
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-fashion-gray border-b border-gray-100 pb-2">Fashion Attributes</h2>

            {/* Sizes */}
            <FieldGroup label="Available Sizes (Optional — select for Apparel or Footwear)">
              {/* Apparel sizes */}
              <p className="text-[11px] font-bold text-fashion-gray uppercase tracking-widest mb-1">👕 Apparel</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {APPAREL_SIZES.map(s => (
                  <button
                    key={s} type="button" onClick={() => toggleSize(s)}
                    className={`size-chip text-xs transition-all`}
                    style={isSizeSelected(s) ? {background:'linear-gradient(135deg,#FF4D00,#E94560)',borderColor:'#FF4D00',color:'#fff'} : {}}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {/* Footwear sizes */}
              <p className="text-[11px] font-bold text-fashion-gray uppercase tracking-widest mb-1">👟 Footwear (UK)</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {FOOTWEAR_SIZES.map(s => (
                  <button
                    key={s} type="button" onClick={() => toggleSize(s)}
                    className={`size-chip text-xs transition-all`}
                    style={isSizeSelected(s) ? {background:'linear-gradient(135deg,#6366F1,#8B5CF6)',borderColor:'#6366F1',color:'#fff'} : {}}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {/* Custom size input */}
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={e => setCustomSizeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                  placeholder="Add custom size (e.g. EU 42, 32W)"
                  className="admin-input flex-1 text-xs"
                />
                <button type="button" onClick={addCustomSize}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-fashion-charcoal text-white hover:bg-fashion-dark transition-colors">
                  + Add
                </button>
              </div>

              {/* Selected sizes with per-size stock inputs */}
              {data.sizes.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] font-bold text-fashion-gray uppercase tracking-widest">Set Stock per Size</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {data.sizes.map(({ size: s, stock: st }) => (
                      <div key={s} className="flex items-center gap-2 bg-fashion-light border border-gray-200 rounded-xl px-3 py-2">
                        <span className="text-xs font-bold text-fashion-dark flex-1">{s}</span>
                        <input
                          type="number" min="0"
                          value={st}
                          onChange={e => setSizeStock(s, e.target.value)}
                          className="w-14 text-center text-xs font-semibold border rounded-lg px-1.5 py-1 outline-none focus:border-primary-200 bg-white"
                        />
                        <button type="button" onClick={() => toggleSize(s)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <IoClose size={14}/>
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-fashion-gray">💡 Set stock to <strong>0</strong> to show the size as <em>sold out</em> to customers.</p>
                </div>
              )}
            </FieldGroup>



            {/* Tags */}
            <FieldGroup label="Product Labels / Tags">
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(t => (
                  <button
                    key={t.value} type="button" onClick={() => toggleTag(t.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all
                      ${data.tags.includes(t.value) ? 'text-white border-transparent' : 'bg-transparent border-gray-200 text-fashion-charcoal hover:border-gray-300'}`}
                    style={data.tags.includes(t.value) ? {backgroundColor: t.color, borderColor: t.color} : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* AI Search Keywords (Hidden from store customers) */}
            <FieldGroup label="AI Search Keywords / Hidden Tags (Press Enter to Add)">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Type keyword (e.g. white, leather, round neck, partywear) and press Enter"
                  className="admin-input flex-1 text-xs"
                />
                <button type="button" onClick={addKeyword} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary-200 text-white hover:bg-primary-100 transition-colors">
                  + Add
                </button>
              </div>
              {(data.keywords && data.keywords.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.keywords.map(kw => (
                    <span key={kw} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
                      #{kw}
                      <button type="button" onClick={() => removeKeyword(kw)} className="text-gray-400 hover:text-red-500">
                        <IoClose size={14}/>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-1">💡 These keywords are hidden from customers on the product page, but help the AI Chatbot find exact matches.</p>
            </FieldGroup>

            {/* Virtual Try-On Admin Toggle Switch */}
            <div className="flex items-center justify-between p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
              <div>
                <p className="text-xs font-bold text-fashion-dark">Enable FlashFit Virtual Try-On for this product</p>
                <p className="text-[10px] text-gray-500">Show "FlashFit Virtual Try-On" link on the product page so users can generate try-ons. Turn OFF to hide it completely.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.virtualTryOnEnabled !== false}
                  onChange={e => setData(p => ({ ...p, virtualTryOnEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>

          {/* ── Key Features & Specifications Card ── */}
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-fashion-gray">
                Key Features & Specifications
              </h2>
              <span className="text-[11px] text-gray-400 font-medium">Predefined templates for product types</span>
            </div>

            {/* Template Selector Preset Buttons */}
            <div className="bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100 space-y-2">
              <p className="text-[11px] font-bold text-fashion-dark uppercase tracking-widest">⚡ Click to Load Predefined Template Fields</p>
              <div className="flex flex-wrap gap-2">
                {SPEC_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setData(p => ({
                        ...p,
                        more_details: { ...p.more_details, ...preset.fields }
                      }))
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 text-fashion-dark transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields list */}
            {Object.keys(data.more_details).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {Object.keys(data.more_details).map(k => (
                  <div key={k} className="relative group">
                    <FieldGroup label={k}>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={data.more_details[k]}
                          onChange={e => {
                            const val = e.target.value
                            setData(p => ({ ...p, more_details: { ...p.more_details, [k]: val } }))
                          }}
                          placeholder={`Enter ${k}`}
                          className="admin-input flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...data.more_details }
                            delete updated[k]
                            setData(p => ({ ...p, more_details: updated }))
                          }}
                          title="Remove Field"
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </FieldGroup>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-2">Click any template button above or click "+ Add Custom Specification Field" below to add details.</p>
            )}
          </div>

          {/* Add field + Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpenAddField(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-200 border-2 border-primary-100 hover:bg-primary-50 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <FiPlus /> Add Custom Specification Field
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition-all hover:shadow-orange hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{background:'linear-gradient(135deg,#FF4D00,#E94560)'}}
            >
              {submitting ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>

      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL('')} />}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={e => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  )
}

export default UploadProduct
