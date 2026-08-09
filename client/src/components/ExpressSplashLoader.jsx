import React, { useEffect, useState } from 'react'

const ExpressSplashLoader = () => {
  const [show, setShow] = useState(false)
  const [stage, setStage] = useState(0) 
  // 0: Man steps ahead to van with parcel (0s - 0.8s)
  // 1: Man puts parcel inside truck (0.8s - 1.8s)
  // 2: Man steps back a little (1.8s - 2.6s)
  // 3: Truck ONLY accelerates fast right (2.6s - 3.5s)
  // 4: Fade out overlay (3.5s - 4.0s)

  useEffect(() => {
    // Check if splash animation has already been shown in this browser session
    const hasSeen = sessionStorage.getItem('flashfit_splash_shown')
    if (!hasSeen) {
      setShow(true)

      // Stage 1: Put parcel into truck at 0.8s
      const putTimer = setTimeout(() => {
        setStage(1)
      }, 800)

      // Stage 2: Man steps back a little at 1.8s
      const stepBackTimer = setTimeout(() => {
        setStage(2)
      }, 1800)

      // Stage 3: ONLY TRUCK accelerates fast right at 2.6s
      const accelTimer = setTimeout(() => {
        setStage(3)
      }, 2600)

      // Stage 4: Fade out overlay at 3.5s
      const fadeTimer = setTimeout(() => {
        setStage(4)
      }, 3500)

      // End & unmount at 4.0s
      const endTimer = setTimeout(() => {
        setShow(false)
        sessionStorage.setItem('flashfit_splash_shown', 'true')
      }, 4000)

      return () => {
        clearTimeout(putTimer)
        clearTimeout(stepBackTimer)
        clearTimeout(accelTimer)
        clearTimeout(fadeTimer)
        clearTimeout(endTimer)
      }
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-b from-neutral-950 via-neutral-900 to-black flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-600 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-[800px] h-[800px] bg-orange-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* FULL SCREEN ANIMATION CONTAINER */}
      <div className="relative w-full max-w-6xl h-screen flex flex-col items-center justify-center px-4 sm:px-8">
        
        {/* Stage Container */}
        <div className="relative w-full max-w-4xl">

          {/* Expanded Full Canvas Widescreen SVG */}
          <svg viewBox="0 0 800 320" className="w-full h-auto filter drop-shadow-[0_25px_45px_rgba(249,115,22,0.4)]">
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

            {/* GROUND LINE */}
            <line x1="20" y1="240" x2="780" y2="240" stroke="#3F3F46" strokeWidth="4" strokeLinecap="round" />

            {/* ── DELIVERY MAN SILHOUETTE (Stays standing on ground when truck speeds away!) ── */}
            <g
              className={`transition-all duration-500 ease-out ${
                stage === 0
                  ? 'translate-x-[140px] opacity-100' // Starts right next to van, stepping ahead
                  : stage === 1
                  ? 'translate-x-[170px] opacity-100' // Steps ahead right at van opening to put parcel
                  : 'translate-x-[110px] opacity-100'  // Stepped back & stays standing on ground!
              }`}
            >
              {/* Delivery Executive Silhouette */}
              <g transform="scale(1.5) translate(0, 10)">
                {/* Cap */}
                <path d="M 8 36 C 8 26, 32 26, 36 36 Z" fill="#F97316" />
                <path d="M 24 34 L 40 34 L 38 38 L 24 38 Z" fill="#EA580C" />
                {/* Head */}
                <circle cx="20" cy="40" r="12" fill="#FFFFFF" />
                
                {/* Body Jacket / Uniform */}
                <path d="M 8 54 L 32 54 L 30 100 L 10 100 Z" fill="#1C1917" stroke="#F97316" strokeWidth="2.5" />
                
                {/* Leg Positioning */}
                <line x1="14" y1="100" x2="8" y2="138" stroke="#18181B" strokeWidth="7" strokeLinecap="round" />
                <path d="M 3 138 L 13 138 L 13 144 L 3 144 Z" fill="#F97316" />
                
                <line x1="26" y1="100" x2="32" y2="138" stroke="#18181B" strokeWidth="7" strokeLinecap="round" />
                <path d="M 27 138 L 37 138 L 37 144 L 27 144 Z" fill="#F97316" />

                {/* Arms Holding Parcel in Stage 0 */}
                {stage === 0 && (
                  <path d="M 10 62 L -6 78 L 26 78" fill="none" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                )}

                {/* Arms Extended in Stage 1 */}
                {stage === 1 && (
                  <path d="M 28 62 L 48 65 L 35 80" fill="none" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                )}

                {/* Arms Relaxed at Side when Stepped Back in Stage >= 2 */}
                {stage >= 2 && (
                  <path d="M 10 62 L 6 90" fill="none" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                )}

                {/* FLASHFIT PARCEL BOX CARRIED BY MAN (Stage 0 only) */}
                {stage === 0 && (
                  <g transform="translate(10, 52)">
                    <rect x="0" y="0" width="42" height="34" rx="6" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
                    <line x1="21" y1="0" x2="21" y2="34" stroke="#B45309" strokeWidth="3.5" />
                    <line x1="0" y1="17" x2="42" y2="17" stroke="#B45309" strokeWidth="3.5" />
                    <polygon points="21,7 16,17 21,17 19,27 26,14 21,14" fill="#FFFFFF" />
                  </g>
                )}
              </g>
            </g>

            {/* ── ONLY TRUCK CONTAINER & CAB GROUP ACCELERATES FAST TO THE RIGHT IN STAGE 3 ── */}
            <g
              className={`transition-all duration-900 cubic-bezier(0.4, 0, 0.2, 1) ${
                stage === 3 ? 'translate-x-[220vw] opacity-90' : 'translate-x-0'
              }`}
            >
              {/* Speed Motion Streaks trailing behind ONLY the truck when accelerating */}
              {stage === 3 && (
                <g transform="translate(200, 120)">
                  <line x1="-80" y1="-30" x2="0" y2="-30" stroke="#F97316" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                  <line x1="-120" y1="0" x2="-10" y2="0" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  <line x1="-90" y1="30" x2="0" y2="30" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                </g>
              )}

              {/* PARCEL SAFE INSIDE TRUCK CONTAINER (Visible after Stage >= 1) */}
              {stage >= 1 && (
                <g className="animate-bounce-once">
                  <rect x="290" y="150" width="42" height="34" rx="6" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
                  <line x1="311" y1="150" x2="311" y2="184" stroke="#B45309" strokeWidth="3.5" />
                  <line x1="290" y1="167" x2="332" y2="167" stroke="#B45309" strokeWidth="3.5" />
                  <polygon points="311,157 306,167 311,167 309,177 316,164 311,164" fill="#FFFFFF" />
                </g>
              )}

              {/* Rear Cargo Container */}
              <rect x="270" y="40" width="310" height="170" rx="18" fill="url(#truckBodyGrad)" stroke="#F97316" strokeWidth="3.5" />
              
              {/* Speed Stripes on Cargo Rear */}
              <line x1="245" y1="65" x2="270" y2="65" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="230" y1="90" x2="270" y2="90" stroke="#F97316" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="250" y1="115" x2="270" y2="115" stroke="#FB923C" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="235" y1="140" x2="270" y2="140" stroke="#F97316" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="255" y1="165" x2="270" y2="165" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />

              {/* Middle Container Side Panel - FLASHFIT LOGO */}
              <rect x="288" y="58" width="274" height="134" rx="12" fill="#09090B" stroke="#27272A" strokeWidth="2.5" />
              
              {/* FlashFit Logo Inside Container */}
              <g transform="translate(320, 92)">
                {/* Lightning Bolt */}
                <polygon points="20,2 7,24 16,24 9,50 31,20 20,20 27,2" fill="url(#boltGrad)" />
                {/* Text */}
                <text x="40" y="28" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="Poppins, sans-serif" letterSpacing="-0.5">
                  Flash<tspan fill="#F97316">Fit</tspan>
                </text>
                <text x="40" y="46" fill="#FDBA74" fontSize="11" fontWeight="800" fontFamily="Poppins, sans-serif" letterSpacing="1.8">
                  30 MIN EXPRESS
                </text>
              </g>

              {/* Front Cabin */}
              <path d="M 580 70 L 685 70 Q 740 80 750 135 L 750 210 L 580 210 Z" fill="url(#cabinGrad)" stroke="#F97316" strokeWidth="3.5" />
              {/* Cabin Windshield Window */}
              <path d="M 635 82 L 695 82 Q 725 92 730 130 L 635 130 Z" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
              {/* Door Handle */}
              <rect x="645" y="150" width="28" height="7" rx="3.5" fill="#FFFFFF" />
              {/* Headlight Glow */}
              <circle cx="745" cy="180" r="9" fill="#FEF08A" />
              <polygon points="754,170 810,155 810,205 754,190" fill="#FEF08A" opacity={stage >= 2 ? 0.6 : 0.2} />

              {/* Chassis Bottom */}
              <rect x="260" y="210" width="495" height="14" rx="5" fill="#27272A" />

              {/* ROTATING FRONT WHEEL */}
              <g transform="translate(675, 222)">
                <circle cx="0" cy="0" r="36" fill="#09090B" stroke="#F97316" strokeWidth="4.5" />
                <circle cx="0" cy="0" r="25" fill="#27272A" stroke="#FFFFFF" strokeWidth="2.5" />
                <g className={stage >= 2 ? "animate-spin-fast origin-center" : "origin-center"}>
                  <line x1="-20" y1="0" x2="20" y2="0" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="-14" y1="-14" x2="14" y2="14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="-14" y1="14" x2="14" y2="-14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                </g>
                <circle cx="0" cy="0" r="9" fill="#F97316" />
              </g>

              {/* ROTATING REAR WHEEL 1 */}
              <g transform="translate(345, 222)">
                <circle cx="0" cy="0" r="36" fill="#09090B" stroke="#F97316" strokeWidth="4.5" />
                <circle cx="0" cy="0" r="25" fill="#27272A" stroke="#FFFFFF" strokeWidth="2.5" />
                <g className={stage >= 2 ? "animate-spin-fast origin-center" : "origin-center"}>
                  <line x1="-20" y1="0" x2="20" y2="0" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="-14" y1="-14" x2="14" y2="14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="-14" y1="14" x2="14" y2="-14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                </g>
                <circle cx="0" cy="0" r="9" fill="#F97316" />
              </g>

              {/* ROTATING REAR WHEEL 2 */}
              <g transform="translate(435, 222)">
                <circle cx="0" cy="0" r="36" fill="#09090B" stroke="#F97316" strokeWidth="4.5" />
                <circle cx="0" cy="0" r="25" fill="#27272A" stroke="#FFFFFF" strokeWidth="2.5" />
                <g className={stage >= 2 ? "animate-spin-fast origin-center" : "origin-center"}>
                  <line x1="-20" y1="0" x2="20" y2="0" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="-14" y1="-14" x2="14" y2="14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="-14" y1="14" x2="14" y2="-14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                </g>
                <circle cx="0" cy="0" r="9" fill="#F97316" />
              </g>
            </g>
          </svg>
        </div>

        {/* Animated Moving Road Track */}
        <div className="w-full max-w-2xl h-2 bg-neutral-800 rounded-full mt-6 overflow-hidden relative shadow-inner">
          <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 ${stage >= 2 ? 'animate-road-track' : ''}`} />
        </div>

        {/* Dynamic Story Status Text under Road Track */}
        <div className="mt-8 text-center space-y-1.5">
          <p className="text-sm font-black tracking-widest text-orange-400 uppercase animate-pulse">
            {stage === 0
              ? '📦 STEPPING AHEAD TO LOAD PARCEL...'
              : stage === 1
              ? '⚡ PARCEL LOADED INTO EXPRESS CONTAINER!'
              : stage === 2
              ? '✅ RIDER STEPPED BACK! STARTING ENGINE...'
              : '🚀 TRUCK SPEEDING TO YOUR DOORSTEP IN 30 MINS!'}
          </p>
          <p className="text-xs text-neutral-400 font-semibold tracking-wide">
            {stage === 0
              ? 'Delivery executive stepping ahead to truck container'
              : stage === 1
              ? 'Putting FlashFit parcel safely inside the express container'
              : stage === 2
              ? 'Rider stepped back to clear the road for departure'
              : 'Express truck accelerating fast to deliver your order'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default ExpressSplashLoader
