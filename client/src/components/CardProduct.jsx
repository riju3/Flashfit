import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import { FiHeart } from 'react-icons/fi'
import { HiHeart } from 'react-icons/hi'

const TAG_CONFIG = {
  'new-arrival':  { label: 'NEW',       className: 'tag-new' },
  'trending':     { label: 'TRENDING',  className: 'tag-trending' },
  'sale':         { label: 'SALE',      className: 'tag-sale' },
  'best-seller':  { label: 'BEST',      className: 'tag-best-seller' },
}

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [wishlist, setWishlist] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const primaryTag = data?.tags?.[0]
  const tagCfg = primaryTag ? TAG_CONFIG[primaryTag] : null
  const discountedPrice = pricewithDiscount(data.price, data.discount)
  const isOutOfStock = data.stock === 0

  return (
    <div className="product-card group relative bg-white select-none">
      <Link to={url} className="block">
        {/* ── Image Container ── */}
        <div className="relative overflow-hidden bg-fashion-light rounded-t-xl aspect-[3/4]">
          {/* Skeleton while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton rounded-t-xl" />
          )}

          <img
            src={data.image[0]}
            alt={data.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-108 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'scale(1)', transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
          />

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-t-xl">
              <span className="bg-fashion-dark text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">Sold Out</span>
            </div>
          )}

          {/* Tag badge */}
          {tagCfg && !isOutOfStock && (
            <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full tracking-widest uppercase ${tagCfg.className}`}>
              {tagCfg.label}
            </span>
          )}

          {/* Discount badge */}
          {data.discount > 0 && !isOutOfStock && (
            <span className="absolute top-3 right-3 bg-secondary-100 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              -{data.discount}%
            </span>
          )}

        </div>

        {/* ── Info ── */}
        <div className="p-3">


          {/* Name */}
          <p className="text-sm font-semibold text-fashion-dark line-clamp-2 leading-snug mb-1">
            {data.name}
          </p>

          {/* Unit / Size hint */}
          {data.unit && (
            <p className="text-xs text-fashion-gray mb-2">{data.unit}</p>
          )}

          {/* Price row */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-fashion-dark">
              {DisplayPriceInRupees(discountedPrice)}
            </span>
            {data.discount > 0 && (
              <span className="text-xs text-fashion-gray line-through">
                {DisplayPriceInRupees(data.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); setWishlist(w => !w) }}
        className={`absolute top-3 ${data.discount > 0 ? 'right-10' : 'right-3'} z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
          ${wishlist ? 'bg-secondary-100 text-white' : 'bg-white/90 text-fashion-gray hover:bg-white hover:text-secondary-100'}
          ${data.tags?.length ? 'top-12' : 'top-3'}`}
        aria-label="Wishlist"
        style={{ top: data.discount > 0 ? '2.75rem' : '0.75rem', right: '0.75rem' }}
      >
        {wishlist ? <HiHeart size={14} /> : <FiHeart size={14} />}
      </button>
    </div>
  )
}

export default CardProduct
