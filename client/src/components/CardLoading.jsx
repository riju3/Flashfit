import React from 'react'

const CardLoading = () => {
  return (
    <div className="flex-shrink-0 w-44 md:w-52 lg:w-56 bg-white rounded-xl overflow-hidden shadow-card">
      {/* Image skeleton - 3/4 aspect ratio */}
      <div className="skeleton w-full" style={{ aspectRatio: '3/4' }} />
      {/* Info skeleton */}
      <div className="p-3 space-y-2">
        <div className="flex gap-1">
          <div className="skeleton h-2.5 w-8 rounded-full" />
          <div className="skeleton h-2.5 w-12 rounded-full" />
        </div>
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-3 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/3" />
        <div className="flex justify-between items-center mt-1">
          <div className="skeleton h-4 rounded w-16" />
          <div className="skeleton h-7 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default CardLoading
