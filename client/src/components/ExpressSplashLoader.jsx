import React, { useEffect, useState } from 'react'

const ExpressSplashLoader = () => {
  const [show, setShow] = useState(false)
  const [stage, setStage] = useState(0) // 0: Man dropping parcel, 1: Parcel loaded & engine rev, 2: Fast right acceleration, 3: Fade out

  useEffect(() => {
    // Check if splash animation has already been shown in this browser session
    const hasSeen = sessionStorage.getItem('flashfit_splash_shown')
    if (!hasSeen) {
      setShow(true)

      // Step 1: Man drops parcel into truck at 1.1s
      const loadTimer = setTimeout(() => {
        setStage(1)
      }, 1100)

      // Step 2: Truck accelerates fast to right at 1.9s
      const accelTimer = setTimeout(() => {
        setStage(2)
      }, 1900)

      // Step 3: Fade out overlay at 2.5s
      const fadeTimer = setTimeout(() => {
        setStage(3)
      }, 2500)

      // Step 4: Unmount component & mark in sessionStorage at 2.9s
      const endTimer = setTimeout(() => {
        setShow(false)
        sessionStorage.setItem('flashfit_splash_shown', 'true')
      }, 2900)

      return () => {
        clearTimeout(loadTimer)
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
        stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Animation Stage */}
      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* Truck + Delivery Man Scene */}
        <div
          className={`relative w-80 sm:w-[440px] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
            stage === 2 ? 'translate-x-[150vw] scale-95 opacity-90' : 'translate-x-0'
          }`}
        >
          {/* Speed Dust / Motion Streaks on Left when accelerating */}
          {stage === 2 && (
            <div className="absolute left-[-60px] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-100 transition-opacity">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent to-orange-500 rounded-full animate-pulse" />
              <div className="w-28 h-1 bg-gradient-to-r from-transparent to-amber-400 rounded-full animate-pulse delay-75" />
              <div className="w-24 h-1 bg-gradient-to-r from-transparent to-orange-600 rounded-full animate-pulse delay-150" />
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-rose-500 rounded-full animate-pulse" />
            </div>
          )}

          {/* Combined SVG Scene */}
          <svg viewBox="0 0 540 260" className="w-full h-auto filter drop-shadow-[0_20px_35px_rgba(249,115,22,0.35)]">
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

            {/* ── ANIMATED DELIVERY MAN CARRYING PARCEL (Stage 0 -> Drops into Truck) ── */}
            <g
              className={`transition-all duration-700 ease-in-out ${
                stage === 0
                  ? 'translate-x-0 translate-y-0 opacity-100'
                  : 'translate-x-12 translate-y-16 opacity-0'
              }`}
            >
              {/* Delivery Man Silhouette */}
              {/* Head / Cap */}
              <circle cx="20" cy="45" r="11" fill="#F97316" />
              <path d="M 12 43 C 12 36, 28 36, 32 43 Z" fill="#EA580C" />
              {/* Body / Uniform */}
              <path d="M 12 56 L 28 56 L 26 95 L 14 95 Z" fill="#1C1917" stroke="#F97316" strokeWidth="1.5" />
              {/* Legs */}
              <line x1="16" y1="95" x2="14" y2="125" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
              <line x1="24" y1="95" x2="26" y2="125" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />

              {/* PARCEL BOX BEING HELD & DROPPED */}
              <g className={`transition-all duration-500 ${stage === 0 ? 'translate-x-6 translate-y-[20px]' : 'translate-x-20 translate-y-[60px]'}`}>
                <rect x="10" y="25" width="34" height="28" rx="4" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Parcel Tape Lines */}
                <line x1="27" y1="25" x2="27" y2="53" stroke="#B45309" strokeWidth="3" />
                <line x1="10" y1="39" x2="44" y2="39" stroke="#B45309" strokeWidth="3" />
                {/* Small Lightning Bolt Icon on Box */}
                <polygon points="27,31 23,40 27,40 25,48 31,37 27,37" fill="#FFFFFF" />
              </g>
            </g>

            {/* ── PARCEL SAFE INSIDE TRUCK (Visible after stage >= 1) ── */}
            {stage >= 1 && (
              <g className="animate-bounce-once">
                <rect x="70" y="125" width="32" height="26" rx="4" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
                <line x1="86" y1="125" x2="86" y2="151" stroke="#B45309" strokeWidth="3" />
                <line x1="70" y1="138" x2="102" y2="138" stroke="#B45309" strokeWidth="3" />
                <polygon points="86,129 82,137 86,137 84,145 90,135 86,135" fill="#FFFFFF" />
              </g>
            )}

            {/* Rear Cargo Container */}
            <rect x="50" y="30" width="280" height="150" rx="16" fill="url(#truckBodyGrad)" stroke="#F97316" strokeWidth="3" />
            
            {/* Speed Stripes on Cargo Rear */}
            <line x1="30" y1="50" x2="50" y2="50" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
            <line x1="20" y1="70" x2="50" y2="70" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <line x1="35" y1="90" x2="50" y2="90" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />
            <line x1="25" y1="110" x2="50" y2="110" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <line x1="40" y1="130" x2="50" y2="130" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />

            {/* Middle Container Side Panel - FLASHFIT LOGO */}
            <rect x="65" y="45" width="250" height="120" rx="10" fill="#09090B" stroke="#27272A" strokeWidth="2" />
            
            {/* FlashFit Logo Inside Container */}
            <g transform="translate(95, 75)">
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
            <path d="M 330 60 L 430 60 Q 480 70 490 120 L 490 180 L 330 180 Z" fill="url(#cabinGrad)" stroke="#F97316" strokeWidth="3" />
            {/* Cabin Windshield Window */}
            <path d="M 380 70 L 435 70 Q 465 80 470 115 L 380 115 Z" fill="#18181B" stroke="#F97316" strokeWidth="2" />
            {/* Door Handle */}
            <rect x="390" y="130" width="25" height="6" rx="3" fill="#FFFFFF" />
            {/* Headlight Glow */}
            <circle cx="485" cy="155" r="8" fill="#FEF08A" />
            <polygon points="493,147 540,135 540,175 493,163" fill="#FEF08A" opacity={stage >= 1 ? 0.4 : 0.15} />

            {/* Chassis Bottom */}
            <rect x="45" y="180" width="445" height="12" rx="4" fill="#27272A" />

            {/* ROTATING FRONT WHEEL */}
            <g transform="translate(420, 192)">
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
            <g transform="translate(120, 192)">
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
            <g transform="translate(200, 192)">
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
              ? '📦 LOADING EXPRESS PARCEL...'
              : stage === 1
              ? '⚡ PARCEL LOADED! REVVING ENGINE...'
              : '🚀 SPEEDING TO YOUR DOORSTEP!'}
          </p>
          <p className="text-[11px] text-neutral-400 font-semibold tracking-wide">
            {stage === 0
              ? 'Loading FlashFit package into express delivery truck'
              : stage === 1
              ? 'Express rider starting engine for 30 min delivery'
              : 'Speeding at full acceleration to your location'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default ExpressSplashLoader
