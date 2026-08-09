import React, { useEffect, useState, useMemo } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { FiChevronDown, FiFilter, FiX, FiSearch } from 'react-icons/fi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const SORT_OPTIONS = [
  { label: 'Newest First',      value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Discount %',        value: 'discount' },
  { label: 'Name A–Z',          value: 'name_asc' },
]

const SIZE_OPTIONS = ['XS','S','M','L','XL','XXL','XXXL','Free Size']

const sortProducts = (products, sort) => {
  const arr = [...products]
  switch (sort) {
    case 'price_asc':  return arr.sort((a,b) => a.price - b.price)
    case 'price_desc': return arr.sort((a,b) => b.price - a.price)
    case 'discount':   return arr.sort((a,b) => (b.discount||0) - (a.discount||0))
    case 'name_asc':   return arr.sort((a,b) => a.name.localeCompare(b.name))
    default:           return arr // newest is already default
  }
}

const ProductListPage = () => {
  const [data,    setData]    = useState([])
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  // Filter / Sort state
  const [sort,        setSort]        = useState('newest')
  const [sortOpen,    setSortOpen]    = useState(false)
  const [filterOpen,  setFilterOpen]  = useState(false)
  const [filterSize,  setFilterSize]  = useState([])
  const [filterStock, setFilterStock] = useState(false)
  const [priceRange,  setPriceRange]  = useState([0, 10000])
  const [maxPrice,    setMaxPrice]    = useState(10000)

  const subCategory     = params?.subCategory?.split('-')
  const subCategoryName = subCategory?.slice(0, subCategory.length - 1)?.join(' ')
  const categoryId      = params.category.split('-').slice(-1)[0]
  const subCategoryId   = params.subCategory.split('-').slice(-1)[0]

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: { categoryId, subCategoryId, page, limit: 40 }
      })
      const { data: responseData } = response
      if (responseData.success) {
        const products = page === 1 ? responseData.data : [...data, ...responseData.data]
        setData(products)
        setTotalPage(responseData.totalCount)
        const max = Math.max(...responseData.data.map(p => p.price || 0), 1000)
        setMaxPrice(max)
        setPriceRange([0, max])
      }
    } catch (error) { AxiosToastError(error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProductdata() }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => s.category.some(el => el._id === categoryId))
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  // Computed: filtered + sorted
  const displayData = useMemo(() => {
    let filtered = [...data]
    if (filterStock)        filtered = filtered.filter(p => p.stock > 0)
    if (filterSize.length)  filtered = filtered.filter(p => p.sizes?.some(s => filterSize.includes(s)))
    filtered = filtered.filter(p => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1])
    return sortProducts(filtered, sort)
  }, [data, sort, filterSize, filterStock, priceRange])

  const toggleSize = (s) => setFilterSize(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const clearFilters = () => { setFilterSize([]); setFilterStock(false); setPriceRange([0, maxPrice]) }
  const hasFilters = filterSize.length > 0 || filterStock || priceRange[0] > 0 || priceRange[1] < maxPrice

  return (
    <section className="bg-fashion-light min-h-screen">
      <div className="container mx-auto flex">

        {/* ── Left Sidebar: Sub-categories ── */}
        <aside className="w-20 md:w-48 lg:w-64 min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-y-scroll scrollbarCustom bg-white shadow-sm sticky top-20 flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-fashion-gray">Categories</p>
          </div>
          {DisplaySubCategory.map(s => {
            const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
            const isActive = subCategoryId === s._id
            return (
              <Link
                to={link}
                key={s._id}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`flex flex-col lg:flex-row items-center lg:gap-3 p-3 border-b border-gray-50 transition-all group
                  ${isActive ? 'bg-primary-50 border-l-2 border-l-primary-200' : 'hover:bg-fashion-light'}`}
              >
                <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 transition-all
                  ${isActive ? 'ring-2 ring-primary-200' : 'group-hover:ring-1 group-hover:ring-primary-100'}`}>
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <p className={`text-xs text-center lg:text-left lg:text-sm font-medium mt-1 lg:mt-0
                  ${isActive ? 'text-primary-200' : 'text-fashion-charcoal'}`}>
                  {s.name}
                </p>
              </Link>
            )
          })}
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* ── Top Bar: heading + sort + filter ── */}
          <div className="sticky top-20 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <h1 className="font-bold text-fashion-dark text-base lg:text-lg capitalize">{subCategoryName}</h1>
              <p className="text-xs text-fashion-gray">{displayData.length} products</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter toggle */}
              <button
                onClick={() => setFilterOpen(o => !o)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-all
                  ${filterOpen || hasFilters ? 'border-primary-200 text-primary-200 bg-primary-50' : 'border-gray-200 text-fashion-charcoal hover:border-primary-100'}`}
              >
                <FiFilter size={14} />
                <span className="hidden sm:inline">Filter</span>
                {hasFilters && <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{background:'linear-gradient(135deg,#FF4D00,#E94560)'}}>!</span>}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(o => !o)}
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border border-gray-200 text-fashion-charcoal hover:border-primary-100 transition-all"
                >
                  <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                  <span className="sm:hidden">Sort</span>
                  <FiChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-11 z-30 bg-white rounded-xl shadow-dark border border-gray-100 min-w-48 overflow-hidden animate-fade-in-up">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          ${sort === opt.value ? 'bg-primary-50 text-primary-200 font-semibold' : 'hover:bg-fashion-light text-fashion-charcoal'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Filter Panel ── */}
          {filterOpen && (
            <div className="bg-white border-b border-gray-100 px-4 py-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-fashion-dark text-sm">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary-200 font-semibold flex items-center gap-1 hover:text-primary-100">
                    <FiX size={12}/> Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Size */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fashion-gray mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`size-chip text-xs ${filterSize.includes(s) ? 'selected' : ''}`}
                        style={filterSize.includes(s) ? {background:'linear-gradient(135deg,#FF4D00,#E94560)',borderColor:'#FF4D00',color:'#fff'} : {}}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price Range */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fashion-gray mb-2">
                    Price Range: {DisplayPriceInRupees(priceRange[0])} – {DisplayPriceInRupees(priceRange[1])}
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary-200"
                  />
                </div>
                {/* Stock */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fashion-gray mb-2">Availability</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setFilterStock(s => !s)}
                      className={`w-10 h-5 rounded-full transition-all flex-shrink-0 relative ${filterStock ? 'bg-primary-200' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${filterStock ? 'left-5' : 'left-0.5'}`} />
                    </div>
                    <span className="text-sm text-fashion-charcoal font-medium">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── Product Grid ── */}
          <div className="p-4">
            {loading && !data.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(8).fill(null).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="skeleton aspect-[3/4]" />
                    <div className="p-3 space-y-2">
                      <div className="skeleton h-3 rounded w-3/4" />
                      <div className="skeleton h-3 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayData.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 rounded-full bg-fashion-light flex items-center justify-center mx-auto mb-3">
                  <FiSearch size={22} className="text-fashion-gray" />
                </div>
                <p className="text-fashion-dark font-semibold text-lg mb-1">No products found</p>
                <p className="text-fashion-gray text-sm">Try changing your filters</p>
                <button onClick={clearFilters} className="mt-4 text-primary-200 font-semibold text-sm hover:underline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayData.map((p, i) => (
                  <CardProduct key={p._id + 'productlist' + i} data={p} />
                ))}
              </div>
            )}
            {loading && data.length > 0 && <Loading />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
