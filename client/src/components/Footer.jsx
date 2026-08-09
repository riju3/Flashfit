import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CustomerSupportModal from './CustomerSupportModal';
import SizeGuideModal from './SizeGuideModal';
import FaqModal from './FaqModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const FlashFitLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 56" width="20" height="30">
      <defs>
        <linearGradient id="boltGradF" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D00" />
          <stop offset="100%" stopColor="#E94560" />
        </linearGradient>
      </defs>
      <polygon points="22,2 8,24 18,24 10,54 34,20 22,20 28,2" fill="url(#boltGradF)" />
    </svg>
    <span className="font-black text-lg tracking-tight">
      <span className="text-white">Flash</span>
      <span style={{background:'linear-gradient(135deg,#FF4D00,#E94560)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Fit</span>
    </span>
  </div>
)

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [supportPhone, setSupportPhone] = useState('+91 800 123 4567')
  const [supportEmail, setSupportEmail] = useState('hello@flashfit.in')
  const [storeAddress, setStoreAddress] = useState('42 Fashion Street, Mumbai, MH 400001')
  
  const [openSupportModal, setOpenSupportModal] = useState(false)
  const [openSizeModal, setOpenSizeModal] = useState(false)
  const [openFaqModal, setOpenFaqModal] = useState(false)
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false)

  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getSettings })
        if (response.data?.success && response.data?.data) {
          if (response.data.data.supportPhone) setSupportPhone(response.data.data.supportPhone)
          if (response.data.data.supportEmail) setSupportEmail(response.data.data.supportEmail)
          if (response.data.data.storeAddress) setStoreAddress(response.data.data.storeAddress)
        }
      } catch (_) {}
    }
    fetchSettings()
  }, [location.pathname])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const handleHelpClick = (linkName) => {
    if (linkName === 'Track Order') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (user?._id) {
        navigate('/dashboard/myorders')
      } else {
        navigate('/login')
      }
    } else if (linkName === 'Size Guide') {
      setOpenSizeModal(true)
    } else if (linkName === 'FAQs') {
      setOpenFaqModal(true)
    } else if (linkName === 'Privacy Policy') {
      setOpenPrivacyModal(true)
    } else if (linkName === 'Returns & Exchange') {
      setOpenSupportModal(true)
    } else if (linkName === 'Contact Us') {
      setOpenSupportModal(true)
    } else {
      setOpenSupportModal(true)
    }
  }

  const cleanPhone = supportPhone.replace(/[^0-9+]/g, '')

  return (
    <footer className="bg-fashion-dark text-white mt-16">
      {/* ── Newsletter Strip ── */}
      <div className="border-b border-white/10" style={{background:'linear-gradient(135deg,rgba(255,77,0,0.15),rgba(233,69,96,0.15))'}}>
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-primary-100 font-medium mb-1">Stay in the loop</p>
            <h3 className="text-xl font-bold text-white">Subscribe for exclusive deals & new arrivals</h3>
          </div>
          {subscribed ? (
            <p className="text-green-400 font-semibold text-sm">You're subscribed!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-primary-100 transition-colors text-sm"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-orange hover:scale-105 active:scale-95 cursor-pointer"
                style={{background:'linear-gradient(135deg,#FF4D00,#E94560)'}}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1">
          <FlashFitLogo />
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            Your premium fashion destination. Curated styles, delivered with lightning speed.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[
              { icon: <FaInstagram size={16}/>, href: 'https://instagram.com', label: 'Instagram' },
              { icon: <FaFacebook size={16}/>, href: 'https://facebook.com', label: 'Facebook' },
              { icon: <FaPinterest size={16}/>, href: 'https://pinterest.com', label: 'Pinterest' },
              { icon: <FaTwitter size={16}/>, href: 'https://twitter.com', label: 'Twitter' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/15 hover:border-primary-100 transition-all duration-200 hover:bg-primary-200/20"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-4">Shop</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'New Arrivals', path: '/search?q=new-arrivals' },
              { label: 'Men', path: '/search?q=men' },
              { label: 'Women', path: '/search?q=women' },
              { label: 'Kids', path: '/search?q=kids' },
              { label: 'Accessories', path: '/search?q=accessories' },
              { label: 'Sale', path: '/search?q=sale' },
            ].map(link => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white/55 hover:text-white text-sm transition-colors hover:pl-1 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-4">Help</h4>
          <ul className="space-y-2.5">
            {[
              'Track Order',
              'Returns & Exchange',
              'Size Guide',
              'FAQs',
              'Contact Us',
              'Privacy Policy',
            ].map(link => (
              <li key={link}>
                <button
                  type="button"
                  onClick={() => handleHelpClick(link)}
                  className="text-white/55 hover:text-white text-sm transition-colors hover:pl-1 block text-left cursor-pointer"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact (Dynamic from Admin Settings) */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-white/55 text-sm">
              <MdLocationOn className="text-primary-100 mt-0.5 flex-shrink-0" size={16}/>
              <span>{storeAddress}</span>
            </li>
            <li className="flex items-center gap-2.5 text-white/55 text-sm">
              <MdPhone className="text-primary-100 flex-shrink-0" size={16}/>
              <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">{supportPhone}</a>
            </li>
            <li className="flex items-center gap-2.5 text-white/55 text-sm">
              <MdEmail className="text-primary-100 flex-shrink-0" size={16}/>
              <a href={`mailto:${supportEmail}`} className="hover:text-white transition-colors">{supportEmail}</a>
            </li>
          </ul>

          {/* Badges */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {['Secure Checkout', 'Free Returns', 'COD Available'].map(badge => (
              <span key={badge} className="text-xs px-2 py-1 rounded-full bg-white/8 border border-white/15 text-white/60">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>© 2025 FlashFit. All Rights Reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => setOpenPrivacyModal(true)} className="hover:text-white/70 transition-colors cursor-pointer">Terms</button>
            <button onClick={() => setOpenPrivacyModal(true)} className="hover:text-white/70 transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => setOpenPrivacyModal(true)} className="hover:text-white/70 transition-colors cursor-pointer">Cookies</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerSupportModal isOpen={openSupportModal} onClose={() => setOpenSupportModal(false)} />
      <SizeGuideModal isOpen={openSizeModal} onClose={() => setOpenSizeModal(false)} />
      <FaqModal isOpen={openFaqModal} onClose={() => setOpenFaqModal(false)} />
      <PrivacyPolicyModal isOpen={openPrivacyModal} onClose={() => setOpenPrivacyModal(false)} />
    </footer>
  )
}

export default Footer
