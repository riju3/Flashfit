import React, { useState, useEffect } from 'react'
import { FiChevronUp } from 'react-icons/fi'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to Top"
      className="fixed bottom-24 right-5 sm:right-6 z-40 w-11 h-11 rounded-full bg-fashion-dark/90 hover:bg-primary-200 text-white shadow-xl flex items-center justify-center border border-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer animate-fadeIn"
    >
      <FiChevronUp size={22} className="stroke-[2.5]" />
    </button>
  )
}

export default ScrollToTopButton
