import React, { useEffect, useState } from 'react'

const ExpressSplashLoader = () => {
  const [show, setShow] = useState(false)
  const [stage, setStage] = useState(0) // 0: Man walking carrying parcel, 1: Man drops parcel into truck, 2: Fast right acceleration, 3: Fade out

  useEffect(() => {
    // Check if splash animation has already been shown in this browser session
    const hasSeen = sessionStorage.getItem('flashfit_splash_shown')
    if (!hasSeen) {
      setShow(true)

      // Step 1: Man stops walking and drops parcel into truck at 1.8s
      const dropTimer = setTimeout(() => {
        setStage(1)
      }, 1800)

      // Step 2: Truck accelerates fast to right at 2.8s
      const accelTimer = setTimeout(() => {
        setStage(2)
      }, 2800)

      // Step 3: Fade out overlay at 4.0s
      const fadeTimer = setTimeout(() => {
        setStage(3)
      }, 4000)

      // Step 4: Unmount component & mark in sessionStorage at 4.6s
      const endTimer = setTimeout(() => {
        setShow(false)
        sessionStorage.setItem('flashfit_splash_shown', 'true')
      }, 4600)

      return () => {
        clearTimeout(dropTimer)
        clearTimeout(accelTimer)
        clearTimeout(fadeTimer)
        clearTimeout(endTimer)
      }
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-b from-neutral-950 via-neutral-900 to-black flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-700 ${
        stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Animation Stage */}
      <div className="relative w-full max-w-3xl px-4 flex flex-col items-center">
        
        {/* Truck + Delivery Man Scene Container */}
        <div
          className={`relative w-85 sm:w-[480px] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${
            stage === 2 ? 'translate-x-[160vw] scale-95 opacity-90' : 'translate-x-0'
          }`}
        >
          {/* Speed Dust / Motion Streaks on Left when accelerating */}
          {stage === 2 && (
            <div className="absolute left-[-70px] top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-100 transition-opacity">
              <div className="w-24 h-1.5 bg-gradient-to-r from-transparent to-orange-500 rounded-full animate-pulse" />
              <div className="w-32 h-1.5 bg-gradient-to-r from-transparent to-amber-400 rounded-full animate-pulse delay-75" />
              <div className="w-28 h-1.5 bg-gradient-to-r from-transparent to-orange-600 rounded-full animate-pulse delay-150" />
              <div className="w-20 h-1.5 bg-gradient-to-r from-transparent to-rose-500 rounded-full animate-pulse" />
            </div>
          )}

          {/* Combined SVG Scene */}
          <svg viewBox="0 0 580 270" className="w-full h-auto filter drop-shadow-[0_20px_35px_rgba(249,115,22,0.35)]">
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
              <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* ── ANIMATED DELIVERY MAN CARRYING PARCEL (Larger Size & Smooth Walking Stride) ── */}
            <g
              className={`transition-all duration-1000 ease-in-out ${
                stage === 0
                  ? 'translate-x-[-40px] translate-y-0 opacity-100'
                  : 'translate-x-[45px] translate-y-[20px] opacity-0'
              }`}
            >
              {/* Delivery Man Silhouette - Scaled Up 1.4x */}
              <g transform="scale(1.35) translate(-10, 5)">
                {/* Head / Cap */}
                <circle cx="20" cy="40" r="13" fill="#F97316" />
                <path d="M 10 38 C 10 29, 30 29, 34 38 Z" fill="#EA580C" />
                
                {/* Body / Uniform */}
                <path d="M 10 53 L 30 53 L 28 98 L 12 98 Z" fill="#1C1917" stroke="#F97316" strokeWidth="2" />
                
                {/* Walking Leg Strides */}
                {/* Left Leg */}
                <g className={stage === 0 ? "animate-leg-left" : ""}>
                  <line x1="15" y1="98" x2="10" y2="135" stroke="#18181B" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 6 135 L 14 135 L 14 140 L 6 140 Z" fill="#F97316" />
                </g>
                {/* Right Leg */}
                <g className={stage === 0 ? "animate-leg-right" : ""}>
                  <line x1="25" y1="98" x2="30" y2="135" stroke="#18181B" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 26 135 L 34 135 L 34 140 L 26 140 Z" fill="#F97316" />
                </g>

                {/* Arms Holding Parcel */}
                <path d="M 10 60 L -4 75 L 25 75" fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />

                {/* PARCEL BOX BEING CARRIED & WALKED */}
                <g transform="translate(10, 48)">
                  <rect x="0" y="0" width="38" height="30" rx="5" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Parcel Tape Lines */}
                  <line x1="19" y1="0" x2="19" y2="30" stroke="#B45309" strokeWidth="3" />
                  <line x1="0" y1="15" x2="38" y2="15" stroke="#B45309" strokeWidth="3" />
                  {/* Small Lightning Bolt Icon on Box */}
                  <polygon points="19,6 15,15 19,15 17,24 23,12 19,12" fill="#FFFFFF" />
                </g>
              </g>
            </g>

            {/* ── PARCEL SAFE INSIDE TRUCK (Visible after stage >= 1) ── */}
            {stage >= 1 && (
              <g className="animate-bounce-once">
                <rect x="90" y="125" width="36" height="28" rx="5" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="108" y1="125" x2="108" y2="153" stroke="#B45309" strokeWidth="3" />
                <line x1="90" y1="139" x2="126" y2="139" stroke="#B45309" strokeWidth="3" />
                <polygon points="108,129 104,137 108,137 106,146 112,135 108,135" fill="#FFFFFF" />
              </g>
            )}

            {/* Rear Cargo Container */}
            <rect x="70" y="30" width="280" height="150" rx="16" fill="url(#truckBodyGrad)" stroke="#F97316" strokeWidth="3" />
            
            {/* Speed Stripes on Cargo Rear */}
            <line x1="50" y1="50" x2="70" y2="50" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
            <line x1="40" y1="70" x2="70" y2="70" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="90" x2="70" y2="90" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />
            <line x1="45" y1="110" x2="70" y2="110" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <line x1="60" y1="130" x2="70" y2="130" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />

            {/* Middle Container Side Panel - FLASHFIT LOGO */}
            <rect x="85" y="45" width="250" height="120" rx="10" fill="#09090B" stroke="#27272A" strokeWidth="2" />
            
            {/* FlashFit Logo Inside Container */}
            <g transform="translate(115, 75)">
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
            <path d="M 350 60 L 450 60 Q 500 70 510 120 L 510 180 L 350 180 Z" fill="url(#cabinGrad)" stroke="#F97316" strokeWidth="3" />
            {/* Cabin Windshield Window */}
            <path d="M 400 70 L 455 70 Q 485 80 490 115 L 400 115 Z" fill="#18181B" stroke="#F97316" strokeWidth="2" />
            {/* Door Handle */}
            <rect x="410" y="130" width="25" height="6" rx="3" fill="#FFFFFF" />
            {/* Headlight Glow */}
            <circle cx="505" cy="155" r="8" fill="#FEF08A" />
            <polygon points="513,147 560,135 560,175 513,163" fill="#FEF08A" opacity={stage >= 1 ? 0.4 : 0.15} />

            {/* Chassis Bottom */}
            <rect x="65" y="180" width="445" height="12" rx="4" fill="#27272A" />

            {/* ROTATING FRONT WHEEL */}
            <g transform="translate(440, 192)">
              <circle cx="0" cy="0" r="32" fill="#09090B" stroke="#F97316" strokeWidth="4" />
              <circle cx="0" cy="0" r="22" fill="#27272A" stroke="#FFFFFF" strokeWidth="2" />
              <g className={stage >= 1 ? "animate-spin-fast origin-center" : "origin-center"}>
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="-12" y1="-12" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="-12" y1="12" x2="12" y2="-12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="0" cy="0" r="8" fill="#F97316" />
            </g>

            {/* ROTATING REAR WHEEL 1 */}
            <g transform="translate(140, 192)">
              <circle cx="0" cy="0" r="32" fill="#09090B" stroke="#F97316" strokeWidth="4" />
              <circle cx="0" cy="0" r="22" fill="#27272A" stroke="#FFFFFF" strokeWidth="2" />
              <g className={stage >= 1 ? "animate-spin-fast origin-center" : "origin-center"}>
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <line x1="-12" y1="-12" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="-12" y1="12" x2="12" y2="-12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="0" cy="0" r="8" fill="#F97316" />
            </g>

            {/* ROTATING REAR WHEEL 2 */}
            <g transform="translate(220, 192)">
              <circle cx="0" cy="0" r="32" fill="#09090B" stroke="#F97316" strokeWidth="4" />
              <circle cx="0" cy="0" r="22" fill="#27272A" stroke="#FFFFFF" strokeWidth="2" />
              <g className={stage >= 1 ? "animate-spin-fast origin-center" : "origin-center"}>
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
          <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 ${stage >= 1 ? 'animate-road-track' : ''}`} />
        </div>

        {/* Dynamic Status Text under Road Track */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs font-black tracking-widest text-orange-400 uppercase animate-pulse">
            {stage === 0
              ? '🚶 RIDER WALKING & LOADING PARCEL...'
              : stage === 1
              ? '⚡ PARCEL LOADED! STARTING ENGINE...'
              : '🚀 SPEEDING TO YOUR DOORSTEP IN 30 MINS!'}
          </p>
          <p className="text-[11px] text-neutral-400 font-semibold tracking-wide">
            {stage === 0
              ? 'Delivery executive walking to load package into truck container'
              : stage === 1
              ? 'FlashFit package loaded safely! Starting 30 min express delivery'
              : 'Speeding at full acceleration to your location'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default ExpressSplashLoader
