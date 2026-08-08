import React, { useEffect, useState } from 'react'

const ExpressSplashLoader = () => {
  const [show, setShow] = useState(false)
  const [accelerate, setAccelerate] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check if splash animation has already been shown in this browser session
    const hasSeen = sessionStorage.getItem('flashfit_splash_shown')
    if (!hasSeen) {
      setShow(true)

      // Step 1: Accelerate truck to the right after 1.4s
      const accelTimer = setTimeout(() => {
        setAccelerate(true)
      }, 1400)

      // Step 2: Start overlay fadeout at 2.0s
      const fadeTimer = setTimeout(() => {
        setFadeOut(true)
      }, 2000)

      // Step 3: Unmount component & mark as seen in sessionStorage at 2.4s
      const endTimer = setTimeout(() => {
        setShow(false)
        sessionStorage.setItem('flashfit_splash_shown', 'true')
      }, 2400)

      return () => {
        clearTimeout(accelTimer)
        clearTimeout(fadeTimer)
        clearTimeout(endTimer)
      }
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-b from-neutral-950 via-neutral-900 to-black flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Truck Animation Stage */}
      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* Animated Express Delivery Truck */}
        <div
          className={`relative w-80 sm:w-96 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
            accelerate ? 'translate-x-[150vw] scale-95 opacity-90' : 'translate-x-0 animate-truck-rev'
          }`}
        >
          {/* Speed Dust / Motion Streaks on Left when accelerating */}
          <div className={`absolute left-[-60px] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 transition-opacity duration-300 ${accelerate ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-orange-500 rounded-full animate-pulse" />
            <div className="w-24 h-1 bg-gradient-to-r from-transparent to-amber-400 rounded-full animate-pulse delay-75" />
            <div className="w-20 h-1 bg-gradient-to-r from-transparent to-orange-600 rounded-full animate-pulse delay-150" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent to-rose-500 rounded-full animate-pulse" />
          </div>

          {/* Truck Vector SVG */}
          <svg viewBox="0 0 500 250" className="w-full h-auto filter drop-shadow-[0_20px_35px_rgba(249,115,22,0.35)]">
            <defs>
              <linearGradient id="truckBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C1917" />
                <stop offset="100%" stopColor="#0C0A09" />
              </linearGradient>
              <linearGradient id="cabinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D00" />
                <stop offset="100%" stopColor="#E94560" />
              </linearGradient>
            </defs>

            {/* Rear Cargo Container */}
            <rect x="30" y="30" width="280" height="150" rx="16" fill="url(#truckBodyGrad)" stroke="#F97316" strokeWidth="3" />
            
            {/* Speed Stripes on Cargo Rear */}
            <line x1="10" y1="50" x2="30" y2="50" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
            <line x1="0" y1="70" x2="30" y2="70" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <line x1="15" y1="90" x2="30" y2="90" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />
            <line x1="5" y1="110" x2="30" y2="110" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <line x1="20" y1="130" x2="30" y2="130" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />

            {/* Middle Container Side Panel - FLASHFIT LOGO */}
            <rect x="45" y="45" width="250" height="120" rx="10" fill="#09090B" stroke="#27272A" strokeWidth="2" />
            
            {/* FlashFit Logo Inside Container */}
            <g transform="translate(75, 75)">
              {/* Lightning Bolt */}
              <polygon points="18,2 6,22 14,22 8,46 28,18 18,18 24,2" fill="url(#boltGrad)" />
              {/* Text */}
              <text x="36" y="26" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="Poppins, sans-serif" letterSpacing="-0.5">
                Flash<tspan fill="#F97316">Fit</tspan>
              </text>
              <text x="36" y="42" fill="#FDBA74" fontSize="10" fontWeight="800" fontFamily="Poppins, sans-serif" letterSpacing="1.5">
                30 MIN EXPRESS
              </text>
            </g>

            {/* Front Cabin */}
            <path d="M 310 60 L 410 60 Q 460 70 470 120 L 470 180 L 310 180 Z" fill="url(#cabinGrad)" stroke="#F97316" strokeWidth="3" />
            {/* Cabin Windshield Window */}
            <path d="M 360 70 L 415 70 Q 445 80 450 115 L 360 115 Z" fill="#18181B" stroke="#F97316" strokeWidth="2" />
            {/* Door Handle */}
            <rect x="370" y="130" width="25" height="6" rx="3" fill="#FFFFFF" />
            {/* Headlight Glow */}
            <circle cx="465" cy="155" r="8" fill="#FEF08A" />
            <polygon points="473,147 520,135 520,175 473,163" fill="#FEF08A" opacity="0.25" />

            {/* Chassis Bottom */}
            <rect x="25" y="180" width="445" height="12" rx="4" fill="#27272A" />

            {/* ROTATING FRONT WHEEL */}
            <g transform="translate(400, 192)">
              <circle cx="0" cy="0" r="32" fill="#09090B" stroke="#F97316" strokeWidth="4" />
              <circle cx="0" cy="0" r="22" fill="#27272A" stroke="#FFFFFF" strokeWidth="2" />
              {/* Rotating Rim Spokes */}
              <g className="animate-spin-fast origin-center">
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="-12" y1="-12" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="-12" y1="12" x2="12" y2="-12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="0" cy="0" r="8" fill="#F97316" />
            </g>

            {/* ROTATING REAR WHEEL 1 */}
            <g transform="translate(100, 192)">
              <circle cx="0" cy="0" r="32" fill="#09090B" stroke="#F97316" strokeWidth="4" />
              <circle cx="0" cy="0" r="22" fill="#27272A" stroke="#FFFFFF" strokeWidth="2" />
              <g className="animate-spin-fast origin-center">
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="-12" y1="-12" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="-12" y1="12" x2="12" y2="-12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="0" cy="0" r="8" fill="#F97316" />
            </g>

            {/* ROTATING REAR WHEEL 2 */}
            <g transform="translate(180, 192)">
              <circle cx="0" cy="0" r="32" fill="#09090B" stroke="#F97316" strokeWidth="4" />
              <circle cx="0" cy="0" r="22" fill="#27272A" stroke="#FFFFFF" strokeWidth="2" />
              <g className="animate-spin-fast origin-center">
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="-12" y1="-12" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="-12" y1="12" x2="12" y2="-12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="0" cy="0" r="8" fill="#F97316" />
            </g>
          </svg>
        </div>

        {/* Animated Moving Road Track */}
        <div className="w-full max-w-lg h-1.5 bg-neutral-800 rounded-full mt-4 overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 animate-road-track" />
        </div>

        {/* Brand Slogan under Road Track */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs font-black tracking-widest text-orange-400 uppercase animate-pulse">
            ⚡ 30 MIN EXPRESS DELIVERY
          </p>
          <p className="text-[11px] text-neutral-400 font-semibold tracking-wide">
            Delivering your order at lightning speed...
          </p>
        </div>

      </div>
    </div>
  )
}

export default ExpressSplashLoader
