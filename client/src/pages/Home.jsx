import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import StickyBannerStack from '../components/StickyBannerStack'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardProduct from '../components/CardProduct'
import { FiArrowRight } from 'react-icons/fi'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { MdLocalShipping, MdReplay } from 'react-icons/md'
import { BsShieldCheck } from 'react-icons/bs'

import fashionVideo from '../assets/fashion_banner_video.mp4'
import bannerRedDress from '../assets/banner_model_red_dress.png'
import logoImg from '../assets/logo.png'

// ─── Hero Section ──────────────────────────────────────────────────────────
const HeroSection = () => {
  const [slide, setSlide] = useState(0)
  const navigate = useNavigate()

  const slides = [
    {
      tagline: 'New Season',
      title: 'Dress to\nImpress',
      sub: 'Discover curated collections that define your style. Premium fashion, delivered in minutes.',
      cta: 'Shop New Arrivals',
      ctaLink: '/search?tag=new-arrival',
      badge: 'Trending Now',
      accent: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 60%, #E94560 100%)',
    },
    {
      tagline: 'Up to 60% Off',
      title: 'End of Season\nSale',
      sub: "Hundreds of styles at unbeatable prices. Grab your favourites before they're gone.",
      cta: 'Shop the Sale',
      ctaLink: '/search?tag=sale',
      badge: 'Limited Time',
      accent: 'linear-gradient(135deg, #111111 0%, #3D0000 60%, #FF4D00 100%)',
    },
    {
      tagline: 'Premium Collection',
      title: 'Timeless\nElegance',
      sub: 'Sophisticated essentials that elevate every look. Crafted for those who lead.',
      cta: 'Explore Collection',
      ctaLink: '/search',
      badge: 'Just Dropped',
      accent: 'linear-gradient(135deg, #0D1B2A 0%, #1B2A4A 60%, #C9A84C 100%)',
    },
  ]

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  const s = slides[slide]

  return (
    <section
      className="relative overflow-hidden min-h-[500px] lg:min-h-[600px] w-full flex items-stretch"
      style={{ background: s.accent, transition: 'background 0.8s ease' }}
    >
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{background:'#FF4D00'}}/>
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full opacity-10 blur-3xl" style={{background:'#C9A84C'}}/>
      </div>

      <div className="w-full relative z-10 flex flex-col lg:flex-row items-stretch min-h-[500px] lg:min-h-[600px]">
        {/* Left Section: Auto-Sliding Text Content (40% width) */}
        <div className="w-full lg:w-[40%] flex items-center px-6 lg:px-12 py-12 lg:py-16 animate-fade-in-up z-10">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full mb-5 text-white/90 text-xs font-semibold tracking-wide shadow-sm">
              <span>{s.badge}</span>
            </div>

            {/* Eyebrow */}
            <p className="text-primary-100 text-sm font-bold tracking-widest uppercase mb-2">{s.tagline}</p>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4" style={{fontFamily:'Playfair Display, serif'}}>
              {s.title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {i === 1 ? (
                    <span style={{background:'linear-gradient(135deg,#FF4D00,#E94560)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                      {line}
                    </span>
                  ) : line}
                </React.Fragment>
              ))}
            </h1>

            <p className="text-white/70 text-base lg:text-lg mb-8 leading-relaxed max-w-lg">{s.sub}</p>

            {/* CTAs */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate(s.ctaLink)}
                className="flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-orange hover:scale-105 active:scale-95"
                style={{background:'linear-gradient(135deg,#FF4D00,#E94560)'}}
              >
                {s.cta}
                <FiArrowRight />
              </button>
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-2 glass text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/15 transition-all"
              >
                Browse All
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Mobile-Optimized 100% Full-Width Fitting Video Banner */}
        <div className="w-full lg:w-[60%] aspect-video sm:aspect-video lg:aspect-none min-h-[220px] sm:min-h-[350px] lg:min-h-[600px] relative z-20 overflow-hidden bg-black flex items-center justify-center">
          <video
            src={fashionVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain sm:object-cover lg:object-cover opacity-100"
          />

          {/* Transparent FlashFit Logo + Tagline Watermark at Bottom of Video */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-transparent flex flex-col items-center text-center z-10 select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 56" className="w-4 h-6 sm:w-5 sm:h-8">
                <defs>
                  <linearGradient id="videoBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF4D00" />
                    <stop offset="100%" stopColor="#E94560" />
                  </linearGradient>
                </defs>
                <polygon points="22,2 8,24 18,24 10,54 34,20 22,20 28,2" fill="url(#videoBoltGrad)" />
              </svg>
              <span className="font-black text-base sm:text-xl tracking-tight leading-none">
                <span className="text-white">Flash</span>
                <span style={{background:'linear-gradient(135deg,#FF4D00,#E94560)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Fit</span>
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-white font-bold tracking-wide mt-0.5 sm:mt-1.5 drop-shadow-md">
              Get your product in just 30 min...
            </span>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Trust Bar ──────────────────────────────────────────────────────────────
const TrustBar = () => (
  <section className="bg-white border-y border-gray-100">
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <HiOutlineLightningBolt className="text-primary-200" size={20}/>, text: '30-Min Delivery', sub: 'From stores near you' },
          { icon: <MdLocalShipping className="text-primary-200" size={20}/>, text: 'Free Shipping', sub: 'On orders above ₹999' },
          { icon: <MdReplay className="text-primary-200" size={20}/>, text: 'Easy Returns', sub: '7-day hassle free' },
          { icon: <BsShieldCheck className="text-primary-200" size={20}/>, text: '100% Authentic', sub: 'Verified brands only' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-fashion-dark">{item.text}</p>
              <p className="text-xs text-fashion-gray">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Category Pill Navigation ────────────────────────────────────────────────
const CategoryPills = ({ categories, subCategories, onCategoryClick }) => {
  const [active, setActive] = useState(null)
  const navigate = useNavigate()

  const handleClick = (cat) => {
    setActive(cat._id)
    onCategoryClick(cat._id, cat.name)
  }

  const handleAllClick = () => {
    setActive(null)
    navigate('/')
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={handleAllClick}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border cursor-pointer
            ${active === null ? 'text-white border-primary-200 shadow-orange' : 'text-fashion-charcoal border-gray-200 hover:border-primary-100 hover:text-primary-200 bg-white'}`}
          style={active === null ? {background:'linear-gradient(135deg,#FF4D00,#E94560)'} : {}}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => handleClick(cat)}
            className={`flex-shrink-0 flex items-center gap-2 pl-1 pr-4 py-1 rounded-full text-sm font-medium transition-all duration-200 border
              ${active === cat._id ? 'text-white border-primary-200 shadow-orange' : 'text-fashion-charcoal border-gray-200 hover:border-primary-100 hover:text-primary-200 bg-white'}`}
            style={active === cat._id ? {background:'linear-gradient(135deg,#FF4D00,#E94560)'} : {}}
          >
            {cat.image && (
              <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded-full object-cover bg-fashion-light" />
            )}
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, href }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <p className="section-subheading text-primary-200 mb-1">{eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
    </div>
    {href && (
      <Link
        to={href}
        className="flex items-center gap-1 text-sm font-semibold text-primary-200 hover:text-primary-100 transition-colors group"
      >
        View All
        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
)

// ─── Horizontal Product Row ──────────────────────────────────────────────────
const ProductRow = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48 rounded-xl overflow-hidden">
            <div className="skeleton aspect-[3/4] rounded-xl" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 rounded w-3/4" />
              <div className="skeleton h-3 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) return null

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
      {products.map(p => (
        <div key={p._id} className="flex-shrink-0 w-44 md:w-52 lg:w-56">
          <CardProduct data={p} />
        </div>
      ))}
    </div>
  )
}

// ─── Brands Marquee ──────────────────────────────────────────────────────────
const BRANDS = [
  { name: 'U.S. Polo Assn.',  abbr: 'USPA',       color: '#1B3A6B' },
  { name: 'Tommy Hilfiger',   abbr: 'TOMMY',      color: '#C8102E' },
  { name: 'Woodland',         abbr: 'WOODLAND',   color: '#4A2C0A' },
  { name: 'Snitch',           abbr: 'SNITCH',     color: '#FF4D00' },
  { name: 'Roadster',         abbr: 'ROADSTER',   color: '#111111' },
  { name: 'H&M',              abbr: 'H&M',        color: '#E50010' },
  { name: "Levi's",           abbr: "LEVI'S",     color: '#C41230' },
  { name: 'Nike',             abbr: 'NIKE',       color: '#111111' },
  { name: 'Adidas',           abbr: 'ADIDAS',     color: '#000000' },
  { name: 'Puma',             abbr: 'PUMA',       color: '#DB0030' },
  { name: 'Reebok',           abbr: 'REEBOK',     color: '#CC0000' },
  { name: 'Peter England',    abbr: 'P.ENGLAND',  color: '#003087' },
  { name: 'Van Heusen',       abbr: 'VAN HEUSEN', color: '#1C3A6A' },
  { name: 'Arrow',            abbr: 'ARROW',      color: '#2C2C2C' },
  { name: 'Louis Philippe',   abbr: 'L.PHILIPPE', color: '#8B6914' },
  { name: 'Raymond',          abbr: 'RAYMOND',    color: '#1A1A1A' },
  { name: 'Allen Solly',      abbr: 'A.SOLLY',    color: '#E63C2F' },
  { name: 'Jack & Jones',     abbr: 'J&J',        color: '#003399' },
  { name: 'Vero Moda',        abbr: 'VERO MODA',  color: '#222222' },
  { name: 'Only',             abbr: 'ONLY',       color: '#111111' },
  { name: 'Benetton',         abbr: 'BENETTON',   color: '#00A54F' },
  { name: 'Superdry',         abbr: 'SUPERDRY',   color: '#E8C200' },
  { name: 'Wrangler',         abbr: 'WRANGLER',   color: '#003087' },
  { name: 'Lee',              abbr: 'LEE',        color: '#C8102E' },
  { name: 'Spykar',           abbr: 'SPYKAR',     color: '#FF6B00' },
  { name: 'Flying Machine',   abbr: 'FLYING M.',  color: '#1B3A6B' },
  { name: 'Being Human',      abbr: 'B.HUMAN',    color: '#E30045' },
  { name: 'FabIndia',         abbr: 'FABINDIA',   color: '#8B3A0F' },
  { name: 'Manyavar',         abbr: 'MANYAVAR',   color: '#7B0D1E' },
  { name: 'W (Aurelia)',      abbr: 'W',          color: '#9B2335' },
  { name: 'Biba',             abbr: 'BIBA',       color: '#D4007A' },
  { name: 'Anita Dongre',     abbr: 'A.DONGRE',   color: '#B8860B' },
  { name: 'Calvin Klein',     abbr: 'CK',         color: '#111111' },
  { name: 'Ralph Lauren',     abbr: 'RL',         color: '#00205B' },
  { name: 'Fossil',           abbr: 'FOSSIL',     color: '#333333' },
  { name: 'Killer Jeans',     abbr: 'KILLER',     color: '#1A1A1A' },
]

const BrandChip = ({ brand }) => (
  <div
    className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-xl mx-3 bg-white border border-gray-100 shadow-sm hover:shadow-card group cursor-default transition-all duration-300 hover:-translate-y-0.5"
    style={{ minWidth: '140px' }}
  >
    {/* Color dot representing brand identity */}
    <span
      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: brand.color }}
    />
    <div>
      <p
        className="text-xs font-black tracking-widest leading-none"
        style={{ color: brand.color, letterSpacing: '0.08em' }}
      >
        {brand.abbr}
      </p>
      <p className="text-[9px] text-fashion-gray mt-0.5 leading-none whitespace-nowrap">
        {brand.name}
      </p>
    </div>
  </div>
)

const BrandsMarquee = () => {
  // Triplicate so it's truly seamless at any viewport
  const row1 = [...BRANDS, ...BRANDS, ...BRANDS]
  const row2 = [...BRANDS].reverse()
  const row2Full = [...row2, ...row2, ...row2]

  return (
    <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6 px-4">
        <p className="section-subheading text-primary-200 mb-1">Our Brand Partners</p>
        <h2 className="section-heading">Shop 300+ Premium Brands</h2>
      </div>

      {/* Row 1 — left to right */}
      <div className="marquee-wrapper mb-3" style={{ '--duration': '60s' }}>
        <div className="marquee-track">
          {row1.map((brand, i) => (
            <BrandChip key={brand.name + 'r1-' + i} brand={brand} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left (reverse) */}
      <div className="marquee-wrapper marquee-reverse" style={{ '--duration': '50s' }}>
        <div className="marquee-track">
          {row2Full.map((brand, i) => (
            <BrandChip key={brand.name + 'r2-' + i} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main Home Component ─────────────────────────────────────────────────────
const PromoCouponBanner = () => {
  const [bannerCoupon, setBannerCoupon] = useState(null)

  useEffect(() => {
    const fetchBannerCoupon = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getBannerCoupon })
        if (response.data?.success && response.data?.data) {
          setBannerCoupon(response.data.data)
        }
      } catch (_) {}
    }
    fetchBannerCoupon()
  }, [])

  if (!bannerCoupon || bannerCoupon.status !== 'Active') return null

  return (
    <section className="container mx-auto px-4 my-8">
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-orange-400/30">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: '#FF4D00' }} />
        
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-white/30">
            <span>⚡ Exclusive Discount Offer</span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            {bannerCoupon.description || `${bannerCoupon.discountPercentage}% OFF on your order!`}
          </h3>
          <p className="text-white/80 text-xs lg:text-sm font-semibold max-w-lg">
            Use this special promotional code at checkout to claim your instant discount.
          </p>
        </div>

        {/* Coupon Code Display Box */}
        <div className="relative z-10 flex flex-col items-center sm:items-end gap-1.5 flex-shrink-0 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25">
          <span className="text-[11px] font-extrabold text-orange-100 uppercase tracking-widest">Coupon Code</span>
          <div className="px-6 py-2.5 bg-white text-orange-600 rounded-xl shadow-lg font-black text-2xl tracking-widest border border-orange-200">
            {bannerCoupon.code}
          </div>
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData    = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const [newArrivals, setNewArrivals]   = useState([])
  const [trending,    setTrending]      = useState([])
  const [saleItems,   setSaleItems]     = useState([])
  const [loadingRows, setLoadingRows]   = useState(true)

  // Fetch tagged products
  const fetchTaggedProducts = async () => {
    setLoadingRows(true)
    try {
      const res = await Axios({ ...SummaryApi.getProduct, data: { page: 1, limit: 50, search: '' } })
      if (res.data?.success) {
        const all = res.data.data
        const arrivals = all.filter(p => p.tags?.includes('new-arrival'))
        setNewArrivals(arrivals.length > 0 ? arrivals.slice(0, 10) : all.slice(0, 10))

        const trend = all.filter(p => p.tags?.includes('trending'))
        setTrending(trend.length > 0 ? trend.slice(0, 10) : all.slice(10, 20))

        const sale = all.filter(p => p.discount > 0 || p.tags?.includes('sale'))
        setSaleItems(sale.length > 0 ? sale.slice(0, 10) : all.filter(p => p.discount > 0).slice(0, 10))
      }
    } catch (_) {}
    setLoadingRows(false)
  }

  useEffect(() => { fetchTaggedProducts() }, [])

  const handleCategoryClick = (id, name) => {
    const sub = subCategoryData.find(s => s.category.some(c => c._id === id))
    if (sub) {
      navigate(`/${valideURLConvert(name)}-${id}/${valideURLConvert(sub.name)}-${sub._id}`)
    }
  }

  return (
    <div className="bg-fashion-light min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Trust bar */}
      <TrustBar />

      {/* Category Pills */}
      {!loadingCategory && categoryData.length > 0 && (
        <CategoryPills
          categories={categoryData}
          subCategories={subCategoryData}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* ── New Arrivals ── */}
      <section className="container mx-auto px-4 py-8">
        <SectionHeader eyebrow="Just In" title="New Arrivals" href="/search?tag=new-arrival" />
        <ProductRow products={newArrivals} loading={loadingRows} />
      </section>

      {/* ── Trending Now ── */}
      {(trending.length > 0 || loadingRows) && (
        <section className="bg-white py-10 my-4">
          <div className="container mx-auto px-4">
            <SectionHeader eyebrow="What's Hot" title="Trending Now" href="/search?tag=trending" />
            <ProductRow products={trending} loading={loadingRows} />
          </div>
        </section>
      )}

      {/* ── Sticky Overlapping Text Banners Section ── */}
      <StickyBannerStack />

      {/* ── Sale Products Section ── */}
      {saleItems.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <SectionHeader eyebrow="Limited Time Deals" title="End of Season Sale Items" href="/search?tag=sale" />
          <ProductRow products={saleItems} loading={loadingRows} />
        </section>
      )}

      {/* ── Category-wise sections ── */}
      {categoryData.map(c => (
        <CategoryWiseProductDisplay
          key={c._id + 'CategorywiseProduct'}
          id={c._id}
          name={c.name}
        />
      ))}

      {/* ── Explore All Products Grid ── */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="section-subheading text-primary-200 mb-1">Catalog</p>
            <h2 className="section-heading">Featured Collection</h2>
          </div>
          <Link
            to="/search?q="
            className="flex items-center gap-1 text-sm font-semibold text-primary-200 hover:text-primary-100 transition-colors group"
          >
            Explore All 300+ Products
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newArrivals.concat(trending, saleItems).slice(0, 18).map((p, index) => (
            <CardProduct key={p._id + 'homeAllGrid' + index} data={p} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/search?q="
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-orange hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF4D00,#E94560)' }}
          >
            View Full 300+ Product Catalog <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Brands Marquee ── */}
      <BrandsMarquee />
    </div>
  )
}

export default Home
