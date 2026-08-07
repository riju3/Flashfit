import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaBolt } from 'react-icons/fa';

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

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

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
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-orange hover:scale-105 active:scale-95"
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
              { icon: <FaInstagram size={16}/>, href: '#', label: 'Instagram' },
              { icon: <FaFacebook size={16}/>, href: '#', label: 'Facebook' },
              { icon: <FaPinterest size={16}/>, href: '#', label: 'Pinterest' },
              { icon: <FaTwitter size={16}/>, href: '#', label: 'Twitter' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
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
            {['New Arrivals', 'Men', 'Women', 'Kids', 'Accessories', 'Sale'].map(link => (
              <li key={link}>
                <Link
                  to={`/search?q=${link.toLowerCase().replace(' ', '-')}`}
                  className="text-white/55 hover:text-white text-sm transition-colors hover:pl-1 block"
                >
                  {link}
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
                <Link
                  to="/"
                  className="text-white/55 hover:text-white text-sm transition-colors hover:pl-1 block"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-white/55 text-sm">
              <MdLocationOn className="text-primary-100 mt-0.5 flex-shrink-0" size={16}/>
              <span>42 Fashion Street, Mumbai, MH 400001</span>
            </li>
            <li className="flex items-center gap-2.5 text-white/55 text-sm">
              <MdPhone className="text-primary-100 flex-shrink-0" size={16}/>
              <a href="tel:+918001234567" className="hover:text-white transition-colors">+91 800 123 4567</a>
            </li>
            <li className="flex items-center gap-2.5 text-white/55 text-sm">
              <MdEmail className="text-primary-100 flex-shrink-0" size={16}/>
              <a href="mailto:hello@flashfit.in" className="hover:text-white transition-colors">hello@flashfit.in</a>
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
            <Link to="/" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
