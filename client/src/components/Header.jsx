import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import Search from './Search';
import { valideURLConvert } from '../utils/valideURLConvert';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const FlashFitLogo = () => (
  <div className="flex items-center gap-1 sm:gap-1.5">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 56" className="w-4 h-6 sm:w-5 sm:h-8">
      <defs>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D00" />
          <stop offset="100%" stopColor="#E94560" />
        </linearGradient>
      </defs>
      <polygon points="22,2 8,24 18,24 10,54 34,20 22,20 28,2" fill="url(#boltGrad)" />
    </svg>
    <span className="font-black text-base sm:text-xl tracking-tight leading-none">
      <span className="text-fashion-dark">Flash</span>
      <span style={{background:'linear-gradient(135deg,#FF4D00,#E94560)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Fit</span>
    </span>
  </div>
)

const NAV_LINKS = [
  { label: 'All',           path: '/search' },
  { label: 'New Arrivals', path: '/search?tag=new-arrival' },
  { label: 'Men',          path: '/search?q=men' },
  { label: 'Women',        path: '/search?q=women' },
  { label: 'Footwear',     path: '/search?q=shoes' },
  { label: 'Accessories',  path: '/search?q=watches' },
  { label: 'Sale',         path: '/search?tag=sale', highlight: true },
]

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const isSearchPage = location.pathname === "/search"
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const { totalPrice, totalQty } = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const redirectToLoginPage = () => navigate("/login")
  const handleCloseUserMenu = () => setOpenUserMenu(false)
  const handleMobileUser = () => {
    if (!user._id) { navigate("/login"); return }
    navigate("/user")
  }

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-dark' : 'shadow-sm'} border-b border-gray-100 w-full`}>
        {/* ── Top Bar ── */}
        <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 gap-2 max-w-full">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <FlashFitLogo />
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-xl mx-auto">
            <Search />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile User Icon */}
            <button className="text-fashion-charcoal lg:hidden p-1.5 hover:text-primary-200 transition-colors" onClick={handleMobileUser}>
              <FaRegCircleUser size={21} />
            </button>

            {/* Mobile Cart Bubble */}
            <button
              onClick={() => setOpenCartSection(true)}
              className="lg:hidden relative p-2 rounded-xl text-white shadow-sm active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg,#FF4D00,#E94560)' }}
            >
              <BsCart4 size={18} />
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-200 text-fashion-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalQty}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              className="lg:hidden text-fashion-charcoal p-1.5 hover:text-primary-200 transition-colors"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <IoClose size={24} /> : <HiMenuAlt3 size={24} />}
            </button>

            {/* Desktop user menu */}
            <div className="hidden lg:flex items-center gap-4">
              {user?._id ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenUserMenu(prev => !prev)}
                    className="flex items-center gap-1.5 text-fashion-charcoal hover:text-primary-200 font-medium text-sm transition-colors"
                  >
                    <FaRegCircleUser size={18} />
                    <span className="max-w-24 truncate">{user.name?.split(' ')[0] || 'Account'}</span>
                    {openUserMenu ? <GoTriangleUp size={14} /> : <GoTriangleDown size={14} />}
                  </button>
                  {openUserMenu && (
                    <div className="absolute right-0 top-10 z-50 animate-fade-in-up">
                      <div className="bg-white rounded-2xl p-4 min-w-52 shadow-dark border border-gray-100">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-sm font-semibold text-fashion-charcoal hover:text-primary-200 transition-colors"
                >
                  Login
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setOpenCartSection(true)}
                className="relative flex items-center gap-2 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 hover:shadow-orange hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#FF4D00,#E94560)' }}
              >
                <BsCart4 size={20} />
                {cartItem[0] ? (
                  <div className="text-left leading-tight">
                    <p className="text-xs opacity-90">{totalQty} Items</p>
                    <p className="font-bold">{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                ) : (
                  <span>My Cart</span>
                )}
                {cartItem[0] && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold-200 text-fashion-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Full-Width Mobile Search Bar Row ── */}
        <div className="lg:hidden px-3 pb-2.5 pt-1 border-t border-gray-100/60 bg-white w-full">
          <Search />
        </div>

        {/* ── Desktop Nav Bar ── */}
        <div className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-1 h-10">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-4 h-full flex items-center text-sm font-medium transition-all duration-200 relative group
                    ${link.highlight
                      ? 'text-secondary-100 font-semibold'
                      : 'text-fashion-charcoal hover:text-primary-200'
                    }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200
                    ${link.highlight ? 'bg-secondary-100' : 'bg-primary-200'}`} />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Mobile Nav Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 animate-fade-in-up">
            <nav className="grid gap-1 pt-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${link.highlight ? 'text-secondary-100 font-semibold' : 'text-fashion-charcoal hover:bg-fashion-light hover:text-primary-200'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </>
  )
}

export default Header
