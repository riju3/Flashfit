import React, { useEffect, useRef, useState, useCallback } from 'react'
import { IoSearch } from "react-icons/io5"
import { IoClose } from "react-icons/io5"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { FaArrowLeft } from "react-icons/fa"
import useMobile from '../hooks/useMobile'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { valideURLConvert } from '../utils/valideURLConvert'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'

// ── Fashion placeholder sequence ─────────────────────────────────────────────
const FASHION_PLACEHOLDERS = [
  'Search "Roadster Cargo"',       1000,
  'Search "Tommy Hilfiger Polo"',  1000,
  'Search "Women Kurta"',          1000,
  'Search "Snitch Oversized Tee"', 1000,
  'Search "Men Formal Shirt"',     1000,
  'Search "Levi\'s Jeans"',        1000,
  'Search "Woodland Sneakers"',    1000,
  'Search "Summer Dress"',         1000,
  'Search "Denim Jacket"',         1000,
  'Search "USPA Polo"',            1000,
]

// ── Highlight matching text ───────────────────────────────────────────────────
const Highlight = ({ text = '', query = '' }) => {
  if (!query.trim()) return <span>{text}</span>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-primary-50 text-primary-200 font-semibold rounded-sm px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

const Search = () => {
  const navigate      = useNavigate()
  const location      = useLocation()
  const [isMobile]    = useMobile()
  const isSearchPage  = location.pathname === '/search'
  const searchText    = location.search.slice(3) // ?q=...

  // Autocomplete state
  const [query,       setQuery]       = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [open,        setOpen]        = useState(false)
  const [focused,     setFocused]     = useState(false)
  const debounceRef   = useRef(null)
  const wrapperRef    = useRef(null)
  const inputRef      = useRef(null)

  // ── Sync input with URL on search page ──────────────────────────────────
  useEffect(() => {
    if (isSearchPage) setQuery(decodeURIComponent(searchText || ''))
    else setQuery('')
  }, [isSearchPage, searchText])

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Fetch suggestions with 280ms debounce ────────────────────────────────
  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim() || q.trim().length < 1) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await Axios({
        ...SummaryApi.searchProduct,
        data: { search: q.trim(), page: 1, limit: 8 }
      })
      if (res.data?.success) {
        setSuggestions(res.data.data || [])
        setOpen(true)
      }
    } catch (_) {}
    setLoading(false)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)

    // Update URL if on search page
    if (isSearchPage) navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true })

    // Debounce API call
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 280)
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setOpen(false)
    inputRef.current?.focus()
    if (isSearchPage) navigate('/search?q=', { replace: true })
  }

  const handleProductClick = (product) => {
    const url = `/product/${valideURLConvert(product.name)}-${product._id}`
    setOpen(false)
    setQuery('')
    navigate(url)
  }

  const handleFullSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const redirectToSearchPage = () => {
    navigate('/search')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const hasSuggestions = suggestions.length > 0
  const showDropdown   = open && focused && (hasSuggestions || loading)

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0 lg:min-w-[420px]">
      {/* ── Search bar ── */}
      <form
        onSubmit={handleFullSearch}
        className={`flex items-center h-9 sm:h-11 lg:h-12 rounded-xl border bg-white transition-all duration-200 overflow-hidden
          ${focused ? 'border-primary-200 shadow-orange' : 'border-gray-200 hover:border-gray-300'}`}
      >
        {/* Left icon */}
        <div className="flex-shrink-0">
          {isMobile && isSearchPage ? (
            <Link
              to="/"
              className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 text-fashion-gray hover:text-primary-200 transition-colors"
            >
              <FaArrowLeft size={15} />
            </Link>
          ) : (
            <button
              type="submit"
              className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 transition-colors ${focused ? 'text-primary-200' : 'text-fashion-gray'}`}
            >
              <IoSearch size={16} />
            </button>
          )}
        </div>

        {/* Input / Placeholder animation */}
        <div className="flex-1 h-full min-w-0 overflow-hidden pr-1">
          {!isSearchPage && !focused ? (
            // Animated placeholder (homepage)
            <div
              onClick={redirectToSearchPage}
              className="w-full h-full flex items-center cursor-text text-fashion-gray text-xs sm:text-sm truncate"
            >
              <TypeAnimation
                sequence={FASHION_PLACEHOLDERS}
                wrapper="span"
                speed={55}
                repeat={Infinity}
              />
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                setFocused(true)
                if (query.trim()) fetchSuggestions(query)
              }}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search brands, clothes, styles..."
              autoFocus={isSearchPage}
              className="w-full h-full outline-none bg-transparent text-sm text-fashion-dark placeholder-fashion-gray pr-2"
            />
          )}
        </div>

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-1 text-fashion-gray hover:text-fashion-dark transition-colors rounded-full hover:bg-fashion-light"
          >
            <IoClose size={16} />
          </button>
        )}
      </form>

      {/* ── Autocomplete Dropdown ── */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-dark border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
          {/* Loading shimmer */}
          {loading && suggestions.length === 0 && (
            <div className="p-3 space-y-2">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 rounded w-3/4" />
                    <div className="skeleton h-2.5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {hasSuggestions && (
            <>
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray">
                  {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} for "{query}"
                </p>
                {loading && (
                  <span className="w-3 h-3 border-2 border-primary-200 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              <ul className="max-h-80 overflow-y-auto scrollbar-none">
                {suggestions.map((product) => {
                  const discountedPrice = pricewithDiscount(product.price, product.discount)
                  const productUrl      = `/product/${valideURLConvert(product.name)}-${product._id}`
                  return (
                    <li key={product._id}>
                      <button
                        onMouseDown={() => handleProductClick(product)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-fashion-light transition-colors text-left group"
                      >
                        {/* Product thumbnail */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-fashion-light flex-shrink-0 border border-gray-100">
                          <img
                            src={product.image?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-fashion-dark truncate leading-snug">
                            <Highlight text={product.name} query={query} />
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-primary-200">
                              {DisplayPriceInRupees(discountedPrice)}
                            </span>
                            {product.discount > 0 && (
                              <>
                                <span className="text-[10px] text-fashion-gray line-through">
                                  {DisplayPriceInRupees(product.price)}
                                </span>
                                <span className="text-[10px] font-bold text-green-600">
                                  {product.discount}% off
                                </span>
                              </>
                            )}
                          </div>
                          {/* Category */}
                          {product.category?.[0]?.name && (
                            <p className="text-[10px] text-fashion-gray mt-0.5">
                              {product.category[0].name}
                            </p>
                          )}
                        </div>

                        {/* In/Out stock */}
                        <div className="flex-shrink-0">
                          {product.stock === 0 ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">Sold Out</span>
                          ) : (
                            <IoSearch size={13} className="text-fashion-gray group-hover:text-primary-200 transition-colors" />
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* Footer: View all results */}
              <div className="border-t border-gray-100">
                <button
                  onMouseDown={handleFullSearch}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <IoSearch size={14} />
                  See all results for "{query}"
                </button>
              </div>
            </>
          )}

          {/* No results */}
          {!loading && query.trim() && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-fashion-light flex items-center justify-center mx-auto mb-2">
                <IoSearch size={18} className="text-fashion-gray" />
              </div>
              <p className="text-sm font-semibold text-fashion-dark">No results for "{query}"</p>
              <p className="text-xs text-fashion-gray mt-1">Try a different keyword or browse categories</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
