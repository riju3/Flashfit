import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaHeart, FaRegHeart, FaStar } from "react-icons/fa6"
import { FiShare2, FiTruck, FiRefreshCw, FiShield, FiZap, FiMapPin, FiCheckCircle, FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import CardProduct from '../components/CardProduct'
import { valideURLConvert } from '../utils/valideURLConvert'
import SizeGuideModal from '../components/SizeGuideModal'
import VirtualTryOnModal from '../components/VirtualTryOnModal'

const TAG_LABELS = {
  'new-arrival': { label: 'New Arrival', className: 'bg-green-500 text-white' },
  'trending':    { label: 'Trending',    className: 'text-white', style:{background:'linear-gradient(135deg,#FF4D00,#E94560)'} },
  'sale':        { label: 'Sale',        className: 'bg-secondary-100 text-white' },
  'best-seller': { label: 'Best Seller', className: 'text-fashion-dark', style:{background:'linear-gradient(135deg,#C9A84C,#E8C97A)'} },
}


const ProductDisplayPage = () => {
  const params = useParams()
  const productId = params?.product?.match(/[a-fA-F0-9]{24}$/)?.[0] || params?.product?.split('-')?.pop()

  const [data,           setData]           = useState({ name:'', image:[], sizes:[], colors:[], tags:[] })
  const [activeImage,    setActiveImage]    = useState(0)
  const [loading,        setLoading]        = useState(true)
  const [selectedSize,   setSelectedSize]   = useState('')
  const [selectedColor,  setSelectedColor]  = useState('')
  const [wishlist,       setWishlist]       = useState(false)
  const [zoomed,         setZoomed]         = useState(false)
  const [reviewsData,    setReviewsData]    = useState({ reviews: [], averageRating: 0, totalReviews: 0 })
  const [showReviewsDropdown, setShowReviewsDropdown] = useState(false)
  const [openSizeModal, setOpenSizeModal] = useState(false)
  const [showTryOnModal, setShowTryOnModal] = useState(false)
  const [openProductDetails, setOpenProductDetails] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd,   setTouchEnd]   = useState(null)

  const getProductSpecifications = () => {
    // If more_details exists in database, map directly from it
    if (data?.more_details && Object.keys(data.more_details).length > 0) {
      return Object.entries(data.more_details)
        .filter(([_, val]) => val !== undefined && val !== null && String(val).trim() !== '')
        .map(([key, val]) => ({ label: key, value: String(val) }));
    }

    // Default fallback specs based on footwear vs apparel
    const isFootwear = data?.category?.some(c => 
      c.name?.toLowerCase().includes('footwear') || 
      c.name?.toLowerCase().includes('shoe') || 
      c.name?.toLowerCase().includes('sneaker')
    ) || data?.name?.toLowerCase().includes('shoe') || data?.name?.toLowerCase().includes('sneaker');

    const color = data?.colors?.[0] || (data?.name?.match(/(red|blue|white|black|green|yellow|pink|grey|orange|navy|purple|brown)/i)?.[0]) || 'White';

    if (isFootwear) {
      return [
        { label: 'Sole Material', value: 'Rubber' },
        { label: 'Heel Type', value: 'Flat' },
        { label: 'Color Family', value: color.charAt(0).toUpperCase() + color.slice(1) },
        { label: 'Heel Height', value: '1' },
        { label: 'Upper Material', value: 'Synthetic' },
        { label: 'Net Quantity', value: '1' },
      ];
    } else {
      return [
        { label: 'Fabric / Material', value: 'Premium Breathable Cotton' },
        { label: 'Pattern', value: 'Solid Design' },
        { label: 'Color Family', value: color.charAt(0).toUpperCase() + color.slice(1) },
        { label: 'Fit Type', value: 'Regular Comfort Fit' },
        { label: 'Net Quantity', value: '1' },
      ];
    }
  };

  const handleShareProduct = async () => {
    const shareData = {
      title: data?.name || 'FlashFit Fashion',
      text: `Check out ${data?.name || 'this item'} on FlashFit!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyUrlToClipboard()
        }
      }
    } else {
      copyUrlToClipboard()
    }
  }

  const copyUrlToClipboard = () => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(window.location.href)
      } else {
        const input = document.createElement('input')
        input.value = window.location.href
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
    } catch (_) {}
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const fetchProductReviews = async (pId) => {
    if (!pId) return
    setReviewsData({ reviews: [], averageRating: 0, totalReviews: 0 })
    try {
      const response = await Axios({
        url: `${SummaryApi.getProductReviews.url}/${pId}`,
        method: SummaryApi.getProductReviews.method
      })
      if (response.data?.success && response.data?.data) {
        setReviewsData(response.data.data)
      }
    } catch (_) {}
  }

  const minSwipeDistance = 40

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe  = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && data.image?.length > 1) {
      setActiveImage(prev => (prev + 1) % data.image.length)
    }
    if (isRightSwipe && data.image?.length > 1) {
      setActiveImage(prev => (prev - 1 + data.image.length) % data.image.length)
    }
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    if (data.image?.length > 1) {
      setActiveImage(prev => (prev + 1) % data.image.length)
    }
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    if (data.image?.length > 1) {
      setActiveImage(prev => (prev - 1 + data.image.length) % data.image.length)
    }
  }
  const [similarProducts, setSimilarProducts] = useState([])
  const [showAddressModal, setShowAddressModal] = useState(false)

  const user        = useSelector(state => state.user)
  const addressList = useSelector(state => state.addresses.addressList || [])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)

  const navigate  = useNavigate()
  const { fetchCartItem } = useGlobalContext()
  const [buying, setBuying] = useState(false)

  const imageContainerRef   = useRef()
  const similarContainerRef = useRef()

  const handleBuyNow = async () => {
    if (!user?._id) {
      toast.error("Please login to buy items")
      navigate('/login')
      return
    }

    if (data?.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size first")
      return
    }

    try {
      setBuying(true)
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: { productId: data?._id }
      })
      if (response.data?.success) {
        if (fetchCartItem) fetchCartItem()
        navigate('/checkout')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setBuying(false)
    }
  }

  const fetchProductDetails = async () => {
    if (!productId || productId.length !== 24) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
      })
      const { data: responseData } = response
      if (responseData.success) {
        const prod = responseData.data

        // Normalize image field to always be an array of URLs
        let normalizedImages = []
        if (Array.isArray(prod.image)) {
          normalizedImages = prod.image
        } else if (typeof prod.image === 'string' && prod.image.trim()) {
          normalizedImages = [prod.image]
        }
        prod.image = normalizedImages

        // Defensive: normalize sizes to [{size, stock}] in case backend returns old string format
        if (Array.isArray(prod.sizes) && prod.sizes.length > 0) {
          prod.sizes = prod.sizes.map(s =>
            typeof s === 'string' ? { size: s, stock: 1 } : s
          )
        }

        setData(prod)
        if (prod.colors?.length) setSelectedColor(prod.colors[0])

        // Extract category ID safely
        const catId = typeof prod.category?.[0] === 'object' ? prod.category[0]._id : prod.category?.[0]
        fetchSimilarProducts(catId, prod._id)
        fetchProductReviews(prod._id)
      }
    } catch (error) { AxiosToastError(error) }
    finally { setLoading(false) }
  }

  const fetchSimilarProducts = async (catId, currentProdId) => {
    try {
      let items = []
      if (catId) {
        const response = await Axios({
          ...SummaryApi.getProductByCategory,
          data: { id: catId }
        })
        if (response.data?.success && response.data.data?.length) {
          items = response.data.data
        }
      }

      // If category search returns few items, fetch general products as fallback
      if (items.length < 4) {
        const genRes = await Axios({
          ...SummaryApi.getProduct,
          data: { page: 1, limit: 12, search: '' }
        })
        if (genRes.data?.success) {
          items = [...items, ...genRes.data.data]
        }
      }

      // Deduplicate and exclude current product
      const uniqueMap = {}
      const filtered = []
      for (const p of items) {
        if (p._id !== currentProdId && !uniqueMap[p._id]) {
          uniqueMap[p._id] = true
          filtered.push(p)
        }
      }
      setSimilarProducts(filtered)
    } catch (_) {}
  }

  useEffect(() => {
    fetchProductDetails()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [params])

  // Re-fetch fresh stock data whenever the user returns to this tab
  // (e.g. after placing an order in another tab, or coming back from checkout)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchProductDetails()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [params])

  const handleThumbScrollRight = () => { if (imageContainerRef.current) imageContainerRef.current.scrollLeft += 80 }
  const handleThumbScrollLeft  = () => { if (imageContainerRef.current) imageContainerRef.current.scrollLeft -= 80 }

  const handleSimilarScrollRight = () => { if (similarContainerRef.current) similarContainerRef.current.scrollLeft += 240 }
  const handleSimilarScrollLeft  = () => { if (similarContainerRef.current) similarContainerRef.current.scrollLeft -= 240 }

  const discountedPrice = pricewithDiscount(data.price, data.discount)
  const savings         = data.price - discountedPrice

  // Active delivery address
  const activeAddress = addressList[selectedAddressIndex] || addressList[0]

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8">
        <div className="skeleton aspect-[4/5] rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-5 rounded w-1/3" />
          <div className="skeleton h-8 rounded w-3/4" />
          <div className="skeleton h-4 rounded w-1/2" />
          <div className="skeleton h-14 rounded" />
          <div className="skeleton h-12 rounded" />
        </div>
      </div>
    )
  }

  return (
    <section className="bg-fashion-light min-h-screen py-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Left: Swipeable Big Image Viewer ── */}
          <div className="space-y-3">
            {/* Main Big Image */}
            <div
              className={`bg-white rounded-2xl overflow-hidden cursor-zoom-in relative shadow-card group select-none ${zoomed ? 'cursor-zoom-out' : ''}`}
              style={{ aspectRatio:'4/5' }}
              onClick={() => setZoomed(z => !z)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={data.image?.[activeImage] || data.image?.[0]}
                alt={data.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`}
              />

              {/* Tag overlay */}
              {data.tags?.[0] && TAG_LABELS[data.tags[0]] && (
                <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10 ${TAG_LABELS[data.tags[0]].className}`}
                  style={TAG_LABELS[data.tags[0]].style}>
                  {TAG_LABELS[data.tags[0]].label}
                </span>
              )}

              {/* Wishlist button */}
              <button
                onClick={(e) => { e.stopPropagation(); setWishlist(w => !w) }}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-card transition-all z-10
                  ${wishlist ? 'bg-secondary-100 text-white' : 'bg-white text-fashion-gray hover:text-secondary-100'}`}
              >
                {wishlist ? <FaHeart size={15}/> : <FaRegHeart size={15}/>}
              </button>

              {/* Overlay Prev / Next Arrows (Visible when multiple images exist) */}
              {data.image?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-fashion-dark w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-10"
                    aria-label="Previous photo"
                  >
                    <FaAngleLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-fashion-dark w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-10"
                    aria-label="Next photo"
                  >
                    <FaAngleRight size={16} />
                  </button>
                </>
              )}

              {/* Bottom Dot Indicators & Photo Counter Pill */}
              {data.image?.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-10 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    {data.image.map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block rounded-full transition-all duration-300 ${idx === activeImage ? 'w-5 h-1.5 bg-primary-200' : 'w-1.5 h-1.5 bg-white/60'}`}
                      />
                    ))}
                    <span className="text-[10px] text-white font-bold ml-1 tracking-wider">
                      {activeImage + 1}/{data.image.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Details & Purchase Actions ── */}
          <div className="space-y-5">
            {/* Category / Brand */}
            {data.category?.[0] && (
              <p className="text-xs font-bold uppercase tracking-widest text-primary-200">
                {data.category[0].name || ''}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-fashion-dark leading-tight" style={{fontFamily:'Playfair Display,serif'}}>
              {data.name}
            </h1>

            {/* Faded Product Intro (no header word used) */}
            {data.description && (
              <p className="text-xs text-fashion-gray/80 leading-relaxed font-normal">
                {data.description}
              </p>
            )}

            {/* Ratings & Reviews Bar (Shows ONLY real reviews) */}
            <div
              onClick={() => {
                setShowReviewsDropdown(true)
                document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center gap-3 flex-wrap text-xs cursor-pointer group/rating hover:opacity-90 transition-opacity"
            >
              {reviewsData.totalReviews > 0 ? (
                <>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold group-hover/rating:scale-105 transition-transform">
                    <span>{reviewsData.averageRating}</span>
                    <FaStar className="text-amber-500" size={11} />
                  </div>
                  <span className="text-fashion-gray font-medium group-hover/rating:text-orange-600 transition-colors">
                    {reviewsData.totalReviews} Customer Review{reviewsData.totalReviews > 1 ? 's' : ''} (Click to view)
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-fashion-gray font-medium">No ratings & reviews yet</span>
                  <span className="text-primary-200 font-semibold group-hover/rating:underline text-[11px]">(Click to view section)</span>
                </div>
              )}
            </div>

            {/* Price Block */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-fashion-dark">
                  {DisplayPriceInRupees(discountedPrice)}
                </span>
                {data.discount > 0 && (
                  <>
                    <span className="text-lg text-fashion-gray line-through">{DisplayPriceInRupees(data.price)}</span>
                    <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white" style={{background:'linear-gradient(135deg,#22C55E,#16A34A)'}}>
                      {data.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              {data.discount > 0 && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  You save {DisplayPriceInRupees(savings)}!
                </p>
              )}
            </div>

            {/* Delivery Address Selector Box */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-fashion-dark font-bold text-sm">
                  <FiMapPin className="text-primary-200" size={16} />
                  <span>Delivery Location</span>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-bold text-primary-200 hover:underline flex items-center gap-0.5"
                >
                  Change <FiChevronRight size={12} />
                </button>
              </div>

              {activeAddress ? (
                <div className="text-xs text-fashion-charcoal space-y-1 bg-fashion-light p-3 rounded-xl border border-gray-100">
                  <p className="font-bold text-fashion-dark">{activeAddress.address_line || 'Home Address'}</p>
                  <p className="text-fashion-gray">{activeAddress.city}, {activeAddress.state} - {activeAddress.pincode}</p>
                  <p className="text-green-600 font-extrabold flex items-center gap-1.5 pt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    ⚡ 30-Min Express Darkstore Delivery
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs bg-fashion-light p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-fashion-dark font-semibold">⚡ 30-Min Express Delivery Available</span>
                  </div>
                  <button onClick={() => setShowAddressModal(true)} className="text-primary-200 font-bold hover:underline">Select Address</button>
                </div>
              )}
            </div>

            {/* Size Selector (Image 2) */}
            {data.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-fashion-dark">Select Size</p>
                  <button onClick={() => setOpenSizeModal(true)} className="text-xs text-primary-200 font-extrabold hover:underline cursor-pointer">Size Guide</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {data.sizes.map(({ size: s, stock: st }) => {
                    const soldOut = st === 0
                    const isSelected = selectedSize === s
                    return (
                      <button
                        key={s}
                        disabled={soldOut}
                        title={soldOut ? 'Sold Out' : `${st} left`}
                        onClick={() => !soldOut && setSelectedSize(s)}
                        className={`relative size-chip text-xs transition-all select-none font-bold px-3.5 py-2 rounded-xl border ${
                          soldOut
                            ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
                            : isSelected ? '' : 'bg-white text-fashion-dark border-gray-200 hover:border-primary-200'
                        }`}
                        style={!soldOut && isSelected ? {background:'linear-gradient(135deg,#FF4D00,#E94560)',borderColor:'#FF4D00',color:'#fff'} : {}}
                      >
                        {s}
                        {soldOut && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg">
                            <span className="block w-full h-px bg-gray-400 rotate-[-35deg] absolute opacity-60"/>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {data.sizes.some(x => x.stock === 0) && (
                  <p className="text-[10px] text-fashion-gray mt-1.5">Greyed sizes are currently sold out.</p>
                )}
              </div>
            )}

            {/* Add to Cart & Buy Now (Image 2) */}
            <div className="pt-2">
              {data.stock === 0 ? (
                <div className="bg-gray-100 rounded-2xl p-4 text-center">
                  <p className="text-fashion-gray font-semibold">This item is currently out of stock</p>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <AddToCartButton data={data} selectedSize={selectedSize} />
                  </div>
                  <button
                    onClick={handleBuyNow}
                    disabled={buying}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-3 px-4 rounded-xl text-fashion-dark transition-all hover:shadow-gold hover:scale-[1.02] active:scale-95 border border-gold-200 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C97A)' }}
                  >
                    <FiZap size={14} />
                    {buying ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              )}
            </div>

            {/* FlashFit Virtual Try-On & Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setShowTryOnModal(true)}
                className="flex items-center gap-2 text-xs font-extrabold px-4.5 py-2.5 rounded-xl border bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer"
              >
                <HiSparkles size={16} className="text-yellow-300" />
                FlashFit Virtual Try-On Room
              </button>

              <button
                onClick={handleShareProduct}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                    : 'bg-gray-50 text-fashion-dark hover:bg-orange-50 hover:border-orange-200 border-gray-200'
                }`}
              >
                {copiedLink ? (
                  <>
                    <FiCheckCircle size={15} className="text-green-600" /> Link Copied!
                  </>
                ) : (
                  <>
                    <FiShare2 size={15} className="text-orange-500" /> Share Product
                  </>
                )}
              </button>
            </div>

            {/* 30-Min Express, Returns & COD Trust Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="bg-orange-50/60 p-3 rounded-2xl border border-orange-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FiZap size={16} />
                </div>
                <div>
                  <p className="font-extrabold text-fashion-dark text-[11px]">30-Min Delivery</p>
                  <p className="text-[10px] text-fashion-gray">Express Darkstore</p>
                </div>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FiRefreshCw size={16} />
                </div>
                <div>
                  <p className="font-extrabold text-fashion-dark text-[11px]">7-Day Returns</p>
                  <p className="text-[10px] text-fashion-gray">Hassle-Free Exchange</p>
                </div>
              </div>

              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FiShield size={16} />
                </div>
                <div>
                  <p className="font-extrabold text-fashion-dark text-[11px]">COD Available</p>
                  <p className="text-[10px] text-fashion-gray">Pay on Delivery</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Product Details Section (Full-Width Accordion) ── */}
        <div className="mt-10 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-200 mb-1">Specifications & Overview</p>
              <h2 className="text-xl font-bold text-fashion-dark">Product Details</h2>
            </div>
            <button
              onClick={() => setOpenProductDetails(prev => !prev)}
              className="py-2.5 px-5 bg-fashion-dark hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer w-fit"
            >
              <span>{openProductDetails ? 'Hide Product Details' : 'View Product Details'}</span>
              {openProductDetails ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </button>
          </div>

          {openProductDetails && (
            <div className="space-y-6 pt-4 border-t border-gray-100 animate-fade-in-up">
              {/* Detailed Description Paragraph (Matching Image 1) */}
              <div>
                <p className="text-xs font-bold text-fashion-dark uppercase tracking-wider mb-2">Description</p>
                <p className="text-xs sm:text-sm text-fashion-gray leading-relaxed font-normal bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                  {data?.description || `Obtain this high-performance fashion pair from FlashFit that is constructed with fine technology and futuristic design to uplift your style game. Its premium synthetic upper optimally encases the foot, while the rubber outsole ensures strong traction to avoid slippages. It can be teamed with a pair of jeans and a top.`}
                </p>
              </div>

              {/* Specifications Table (Matching Image 1 Teal Badges) */}
              <div>
                <p className="text-xs font-bold text-fashion-dark uppercase tracking-wider mb-3">Key Features & Specifications</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getProductSpecifications().map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 transition-colors shadow-2xs">
                      <span className="inline-block bg-[#E0F7FA] text-[#00695C] font-semibold px-3 py-1.5 rounded-xl text-xs tracking-wide border border-[#B2EBF2]/60">
                        {spec.label}
                      </span>
                      <span className="text-xs sm:text-sm text-fashion-dark font-bold">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Customer Ratings & Reviews Section (Dropdown Accordion) ── */}
        <div id="reviews-section" className="mt-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-200 mb-1">Feedback & Opinions</p>
              <h2 className="text-xl font-bold text-fashion-dark">Customer Reviews & Ratings</h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {reviewsData.totalReviews > 0 ? (
                <div className="flex items-center gap-2 bg-amber-50/80 px-3.5 py-2 rounded-2xl border border-amber-200">
                  <span className="text-2xl font-black text-amber-600 leading-none">
                    {reviewsData.averageRating}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FaStar key={s} size={13} className={s <= Math.round(Number(reviewsData.averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-fashion-dark border-l border-amber-200 pl-2">
                    {reviewsData.totalReviews} Review{reviewsData.totalReviews !== 1 ? 's' : ''}
                  </span>
                </div>
              ) : (
                <div className="px-3.5 py-2 bg-gray-100 rounded-2xl text-xs font-bold text-fashion-gray border border-gray-200">
                  No Customer Reviews Yet
                </div>
              )}

              <button
                onClick={() => setShowReviewsDropdown(prev => !prev)}
                className="py-2.5 px-5 bg-fashion-dark hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{showReviewsDropdown ? 'Hide Reviews' : `View Reviews (${reviewsData.totalReviews})`}</span>
                {showReviewsDropdown ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Collapsible Reviews Content */}
          {showReviewsDropdown && (
            <div className="border-t border-gray-100 pt-5 space-y-4 animate-fade-in-up">
              {reviewsData.reviews?.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {reviewsData.reviews.map((r) => (
                    <div key={r._id} className="p-4 bg-fashion-light/60 rounded-2xl border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                            {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-fashion-dark">{r.userName}</p>
                            <p className="text-[10px] text-fashion-gray">
                              {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <span className="text-xs font-bold text-amber-700">{r.rating}</span>
                            <FaStar className="text-amber-500" size={11} />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-fashion-dark leading-relaxed font-normal">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50/50 rounded-2xl">
                  <p className="text-xs font-bold text-fashion-gray">No customer reviews written yet for this item.</p>
                  <p className="text-[11px] text-gray-400 mt-1">Reviews appear here once delivered orders are rated!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Similar Products Carousel (Swipe Left to Right) ── */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="section-subheading text-primary-200 mb-1">Recommendations</p>
                <h2 className="section-heading">Similar Products You May Like</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimilarScrollLeft}
                  className="bg-white hover:bg-fashion-light shadow-card text-fashion-dark p-2 rounded-full transition-all"
                >
                  <FaAngleLeft size={14} />
                </button>
                <button
                  onClick={handleSimilarScrollRight}
                  className="bg-white hover:bg-fashion-light shadow-card text-fashion-dark p-2 rounded-full transition-all"
                >
                  <FaAngleRight size={14} />
                </button>
              </div>
            </div>

            <div
              ref={similarContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4 -mx-4 px-4"
            >
              {similarProducts.map((p, index) => (
                <div key={p._id + 'similar' + index} className="flex-shrink-0 w-44 md:w-52 lg:w-56">
                  <CardProduct data={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Inline Delivery Address Picker Modal ── */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-fashion-dark text-base">Select Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-fashion-gray hover:text-fashion-dark font-bold">✕</button>
            </div>

            {addressList.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {addressList.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => { setSelectedAddressIndex(idx); setShowAddressModal(false); }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedAddressIndex === idx ? 'border-primary-200 bg-primary-50' : 'border-gray-200 hover:border-primary-100'}`}
                  >
                    <p className="font-semibold text-xs text-fashion-dark">{addr.address_line}</p>
                    <p className="text-[11px] text-fashion-gray">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-fashion-gray mb-3">No saved addresses found.</p>
                <Link
                  to="/dashboard/address"
                  onClick={() => setShowAddressModal(false)}
                  className="text-xs font-bold text-primary-200 hover:underline"
                >
                  + Add Address in Profile
                </Link>
              </div>
            )}

            <button
              onClick={() => setShowAddressModal(false)}
              className="w-full py-2.5 bg-fashion-dark text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <SizeGuideModal isOpen={openSizeModal} onClose={() => setOpenSizeModal(false)} />
      <VirtualTryOnModal
        isOpen={showTryOnModal}
        onClose={() => setShowTryOnModal(false)}
        product={data}
      />
    </section>
  )
}

export default ProductDisplayPage
