import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const APPAREL_SIZES  = ['XS','S','M','L','XL','XXL','XXXL','Free Size']
const FOOTWEAR_SIZES = ['UK 5','UK 6','UK 7','UK 8','UK 9','UK 10','UK 11']

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


const EditProductAdmin = ({ close ,data : propsData,fetchProductData}) => {
  const [data, setData] = useState({
    _id : propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    brand: propsData.brand || "",
    color: propsData.color || "",
    more_details: propsData.more_details || {},
    sizes: propsData.sizes || [],
    tags: propsData.tags || [],
    keywords: propsData.keywords || [],
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
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const [customSizeInput, setCustomSizeInput] = useState('')

  const isSizeSelected = (s) => data.sizes.some(x => x.size === s)
  const toggleSize = (s) => {
    setData(p => ({
      ...p,
      sizes: isSizeSelected(s)
        ? p.sizes.filter(x => x.size !== s)
        : [...p.sizes, { size: s, stock: 1 }]
    }))
  }
  const setSizeStock = (s, qty) => {
    setData(p => ({ ...p, sizes: p.sizes.map(x => x.size === s ? { ...x, stock: Number(qty) } : x) }))
  }
  const addCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase()
    if (!trimmed || isSizeSelected(trimmed)) return
    setData(p => ({ ...p, sizes: [...p.sizes, { size: trimmed, stock: 1 }] }))
    setCustomSizeInput('')
  }


  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        if(close){
          close()
        }
        fetchProductData()
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })

      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
      <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
        <section className=''>
          <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
            <button onClick={close}>
              <IoClose size={20}/>
            </button>
          </div>
          <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
              <div className='grid gap-1'>
                <label htmlFor='name' className='font-medium'>Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter product name'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='grid gap-1'>
                  <label htmlFor='brand' className='font-medium text-xs'>Brand (Optional)</label>
                  <input
                    id='brand'
                    type='text'
                    placeholder='e.g. Woodland, Nike, ZARA'
                    name='brand'
                    value={data.brand}
                    onChange={handleChange}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded text-xs'
                  />
                </div>
                <div className='grid gap-1'>
                  <label htmlFor='color' className='font-medium text-xs'>Color (Optional)</label>
                  <input
                    id='color'
                    type='text'
                    placeholder='e.g. Red, Black, White, Olive'
                    name='color'
                    value={data.color}
                    onChange={handleChange}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded text-xs'
                  />
                </div>
              </div>
              <div className='grid gap-1'>
                <label htmlFor='description' className='font-medium'>Description</label>
                <textarea
                  id='description'
                  type='text'
                  placeholder='Enter product description'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  multiple
                  rows={3}
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                />
              </div>
              <div>
                <p className='font-medium'>Image</p>
                <div>
                  <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {
                        imageLoading ? <Loading /> : (
                          <>
                            <FaCloudUploadAlt size={35} />
                            <p>Upload Image</p>
                          </>
                        )
                      }
                    </div>
                    <input
                      type='file'
                      id='productImage'
                      className='hidden'
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/**display uploded image*/}
                  <div className='flex flex-wrap gap-4'>
                    {
                      data.image.map((img, index) => {
                        return (
                          <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                            <img
                              src={img}
                              alt={img}
                              className='w-full h-full object-scale-down cursor-pointer'
                              onClick={() => setViewImageURL(img)}
                            />
                            <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                              <MdDelete />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

              </div>
              <div className='grid gap-1'>
                <label className='font-medium'>Category</label>
                <div>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded'
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const category = allCategory.find(el => el._id === value)

                      setData((preve) => {
                        return {
                          ...preve,
                          category: [...preve.category, category],
                        }
                      })
                      setSelectCategory("")
                    }}
                  >
                    <option value={""}>Select Category</option>
                    {
                      allCategory.map((c, index) => {
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className='flex flex-wrap gap-3'>
                    {
                      data.category.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                            <p>{c.name}</p>
                            <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                              <IoClose size={20} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
              <div className='grid gap-1'>
                <label className='font-medium'>Sub Category</label>
                <div>
                  <select
                    className='bg-blue-50 border w-full p-2 rounded'
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      const subCategory = allSubCategory.find(el => el._id === value)

                      setData((preve) => {
                        return {
                          ...preve,
                          subCategory: [...preve.subCategory, subCategory]
                        }
                      })
                      setSelectSubCategory("")
                    }}
                  >
                    <option value={""} className='text-neutral-600'>Select Sub Category</option>
                    {
                      allSubCategory.map((c, index) => {
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className='flex flex-wrap gap-3'>
                    {
                      data.subCategory.map((c, index) => {
                        return (
                          <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                            <p>{c.name}</p>
                            <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                              <IoClose size={20} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

              <div className='grid gap-1'>
                <label htmlFor='unit' className='font-medium'>Unit</label>
                <input
                  id='unit'
                  type='text'
                  placeholder='Enter product unit'
                  name='unit'
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='stock' className='font-medium'>Number of Stock</label>
                <input
                  id='stock'
                  type='number'
                  placeholder='Enter product stock'
                  name='stock'
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='price' className='font-medium'>Price</label>
                <input
                  id='price'
                  type='number'
                  placeholder='Enter product price'
                  name='price'
                  value={data.price}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='discount' className='font-medium'>Discount</label>
                <input
                  id='discount'
                  type='number'
                  placeholder='Enter product discount'
                  name='discount'
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                />
              </div>


              {/**add more field**/}
              {
                Object?.keys(data?.more_details)?.map((k, index) => {
                  return (
                    <div className='grid gap-1'>
                      <label htmlFor={k} className='font-medium'>{k}</label>
                      <input
                        id={k}
                        type='text'
                        value={data?.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value
                              }
                            }
                          })
                        }}
                        required
                        className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                      />
                    </div>
                  )
                })
              }

              {/* ── Sizes ── */}
              <div className='grid gap-2 mt-4 p-3 bg-blue-50 rounded-lg border'>
                <label className='font-semibold text-sm'>Available Sizes <span className='text-xs font-normal text-gray-500'>(Optional)</span></label>

                <p className='text-[11px] font-bold text-gray-500 uppercase tracking-widest'>👕 Apparel</p>
                <div className='flex flex-wrap gap-2'>
                  {APPAREL_SIZES.map(s => (
                    <button key={s} type='button' onClick={() => toggleSize(s)}
                      className='px-3 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all'
                      style={isSizeSelected(s)
                        ? {background:'linear-gradient(135deg,#FF4D00,#E94560)',borderColor:'#FF4D00',color:'#fff'}
                        : {background:'#fff',borderColor:'#e5e7eb',color:'#374151'}}>
                      {s}
                    </button>
                  ))}
                </div>

                <p className='text-[11px] font-bold text-gray-500 uppercase tracking-widest'>👟 Footwear (UK)</p>
                <div className='flex flex-wrap gap-2'>
                  {FOOTWEAR_SIZES.map(s => (
                    <button key={s} type='button' onClick={() => toggleSize(s)}
                      className='px-3 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all'
                      style={isSizeSelected(s)
                        ? {background:'linear-gradient(135deg,#6366F1,#8B5CF6)',borderColor:'#6366F1',color:'#fff'}
                        : {background:'#fff',borderColor:'#e5e7eb',color:'#374151'}}>
                      {s}
                    </button>
                  ))}
                </div>

                <div className='flex gap-2'>
                  <input type='text' value={customSizeInput} onChange={e => setCustomSizeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                    placeholder='Custom size (e.g. EU 42, 32W)'
                    className='bg-white border rounded px-2 py-1.5 text-xs flex-1 outline-none focus:border-primary-200' />
                  <button type='button' onClick={addCustomSize}
                    className='px-3 py-1.5 text-xs font-bold rounded bg-gray-800 text-white hover:bg-gray-900'>+ Add</button>
                </div>

                {data.sizes.length > 0 && (
                  <div className='mt-2 space-y-2'>
                    <p className='text-[11px] font-bold text-gray-500 uppercase tracking-widest'>Set Stock per Size</p>
                    <div className='grid grid-cols-2 gap-2'>
                      {data.sizes.map(({ size: s, stock: st }) => (
                        <div key={s} className='flex items-center gap-2 bg-white border rounded-lg px-2.5 py-1.5'>
                          <span className='text-xs font-bold text-gray-800 flex-1'>{s}</span>
                          <input type='number' min='0' value={st}
                            onChange={e => setSizeStock(s, e.target.value)}
                            className='w-14 text-center text-xs font-semibold border rounded px-1 py-0.5 outline-none focus:border-primary-200' />
                          <button type='button' onClick={() => toggleSize(s)} className='text-gray-400 hover:text-red-500'>
                            <IoClose size={14}/>
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className='text-[10px] text-gray-500'>💡 Set stock to <strong>0</strong> to mark a size as <em>sold out</em> for customers.</p>
                  </div>
                )}
              </div>

              {/* ── Availability Toggle ── */}
              <div className='grid gap-2 mt-2 p-3 bg-blue-50 rounded-lg border'>
                <label className='font-semibold text-sm'>Stock Availability</label>
                <div className='flex gap-3'>
                  {['In Stock', 'Out of Stock'].map(opt => (
                    <button key={opt} type='button'
                      onClick={() => setData(p => ({ ...p, stock: opt === 'In Stock' ? (p.stock > 0 ? p.stock : 1) : 0 }))}
                      className='px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all'
                      style={(opt === 'In Stock' ? (data.stock > 0 || data.stock === null || data.stock === '') : data.stock === 0)
                        ? {borderColor:'#22c55e',background:'#f0fdf4',color:'#15803d'}
                        : {borderColor:'#e5e7eb',background:'#fff',color:'#6b7280'}}>
                      {opt === 'In Stock' ? '✅ In Stock' : '❌ Out of Stock'}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── AI Search Keywords (Hidden from store customers) ── */}
              <div className='grid gap-2 mt-2 p-3 bg-blue-50 rounded-lg border'>
                <label className='font-semibold text-sm'>AI Search Keywords / Hidden Tags <span className='text-xs font-normal text-gray-500'>(Press Enter to Add)</span></label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Type keyword (e.g. white, leather, round neck, partywear) and press Enter"
                    className="bg-white p-2 outline-none border focus-within:border-primary-200 rounded flex-1 text-xs"
                  />
                  <button type="button" onClick={addKeyword} className="px-3 py-1.5 text-xs font-bold rounded bg-primary-200 text-white hover:bg-primary-100 transition-colors">
                    + Add
                  </button>
                </div>
                {(data.keywords && data.keywords.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.keywords.map(kw => (
                      <span key={kw} className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-300">
                        #{kw}
                        <button type="button" onClick={() => removeKeyword(kw)} className="text-gray-400 hover:text-red-500">
                          <IoClose size={14}/>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-gray-500">💡 These keywords are hidden from customers on the product page, but help the AI Chatbot find exact matches.</p>
              </div>

              {/* ── Key Features & Specifications Card ── */}
              <div className='grid gap-2 mt-2 p-3 bg-blue-50 rounded-lg border space-y-3'>
                <div className='flex items-center justify-between border-b border-blue-100 pb-2'>
                  <label className='font-bold text-sm text-fashion-dark uppercase tracking-wider'>Key Features & Specifications</label>
                  <span className='text-[11px] text-gray-500 font-medium'>Load predefined product templates</span>
                </div>

                {/* Preset Template Buttons */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-2">
                  <p className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">⚡ Click to Load Template Fields</p>
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
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white text-fashion-dark transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Fields */}
                {Object.keys(data.more_details || {}).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {Object.keys(data.more_details).map(k => (
                      <div key={k} className="flex flex-col gap-1 bg-white p-2.5 rounded-xl border border-gray-200">
                        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{k}</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={data.more_details[k]}
                            onChange={e => {
                              const val = e.target.value
                              setData(p => ({ ...p, more_details: { ...p.more_details, [k]: val } }))
                            }}
                            placeholder={`Enter ${k}`}
                            className="bg-white border rounded px-2.5 py-1.5 text-xs flex-1 outline-none focus:border-primary-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...data.more_details }
                              delete updated[k]
                              setData(p => ({ ...p, more_details: updated }))
                            }}
                            title="Remove Field"
                            className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                          >
                            <IoClose size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic py-1">Click a template above to add specification fields.</p>
                )}
              </div>

              <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-2 px-4 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded-xl text-xs flex items-center justify-center gap-1.5 w-fit'>
                + Add Custom Specification Field
              </div>

              <button
                className='bg-primary-100 hover:bg-primary-200 py-3 rounded-xl font-bold text-white transition-all shadow-md cursor-pointer'
              >
                Update Product Details
              </button>
            </form>
          </div>

          {
            ViewImageURL && (
              <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
            )
          }

          {
            openAddField && (
              <AddFieldComponent
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                submit={handleAddField}
                close={() => setOpenAddField(false)}
              />
            )
          }
        </section>
      </div>
    </section>
  )
}

export default EditProductAdmin


