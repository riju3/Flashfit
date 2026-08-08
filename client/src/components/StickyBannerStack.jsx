import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const GRADIENT_MAP = {
  orange: 'from-orange-500 via-amber-500 to-rose-600',
  darkRed: 'from-black via-red-950 to-orange-800',
  midnight: 'from-slate-950 via-indigo-950 to-amber-600',
  purple: 'from-purple-950 via-fuchsia-900 to-pink-600',
  emerald: 'from-emerald-950 via-teal-900 to-lime-600',
  gold: 'from-amber-950 via-yellow-700 to-amber-500'
}

const StickyBannerStack = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBanners = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAllBanners })
      if (response.data?.success) {
        const activeOnly = (response.data.data || []).filter(b => b.status === 'Active')
        setBanners(activeOnly)
      }
    } catch (_) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  if (loading || banners.length === 0) return null

  return (
    <section className="my-12 px-4 max-w-4xl mx-auto relative isolate">
      {banners.map((banner, index) => {
        const gradientClass = GRADIENT_MAP[banner.gradientTheme] || GRADIENT_MAP.orange
        const isLast = index === banners.length - 1

        return (
          <div
            key={banner._id || index}
            className="sticky transition-all duration-300 ease-out will-change-transform"
            style={{
              top: '84px',
              zIndex: (index + 1) * 10,
              marginBottom: isLast ? '32px' : '120px'
            }}
          >
            <div className={`rounded-[32px] p-6 sm:p-10 shadow-2xl text-white bg-gradient-to-br ${gradientClass} border border-white/20 overflow-hidden relative group backdrop-blur-md transition-transform hover:scale-[1.01]`}>
              {/* Subtle Graphic Shimmer Overlay */}
              <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10 text-center space-y-4 max-w-xl mx-auto">
                
                {/* Eyebrow Header Pill */}
                {banner.eyebrow && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white/30 text-white shadow-sm">
                    {banner.eyebrow}
                  </div>
                )}

                {/* Main Title */}
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
                  {banner.title}
                </h2>

                {/* Subtitle / Description */}
                {banner.subtitle && (
                  <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed max-w-lg mx-auto">
                    {banner.subtitle}
                  </p>
                )}

                {/* Glassmorphism Coupon Code Card (Match user screenshot) */}
                {banner.couponCode && (
                  <div className="mt-4 pt-2">
                    <div className="bg-white/20 backdrop-blur-xl border border-white/40 p-4 sm:p-5 rounded-2xl max-w-xs mx-auto text-center shadow-xl space-y-1.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">
                        COUPON CODE
                      </p>
                      <div className="bg-white text-orange-600 font-black text-xl sm:text-2xl py-2 px-6 rounded-xl shadow-inner tracking-widest uppercase inline-block">
                        {banner.couponCode}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Action Button */}
                {banner.ctaText && (
                  <div className="pt-2">
                    <Link
                      to={banner.ctaLink || '/search'}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {banner.ctaText}
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default StickyBannerStack
