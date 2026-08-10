import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import { handleAddAddress } from '../store/addressSlice'
import { handleAddItemCart } from '../store/cartProduct'
import { setOrder } from '../store/orderSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import isAdmin from '../utils/isAdmin'
import { HiOutlineExternalLink } from "react-icons/hi"
import {
  FiUser, FiShoppingBag, FiMapPin, FiLogOut,
  FiGrid, FiTag, FiUploadCloud, FiPackage, FiHelpCircle
} from 'react-icons/fi'

const UserMenu = ({ close, openSupport }) => {
  const user     = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await Axios({ ...SummaryApi.logout })
      
      // Hold for 2 seconds with animation before completing logout
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (response.data.success) {
        if (close) close()
        dispatch(logout())
        dispatch(handleAddAddress([]))
        dispatch(handleAddItemCart([]))
        dispatch(setOrder([]))
        localStorage.clear()
        setIsLoggingOut(false)
        navigate('/')
      }
    } catch (error) { 
      setIsLoggingOut(false)
      AxiosToastError(error) 
    }
  }

  const handleClose = () => { if (close) close() }

  const MenuItem = ({ to, icon, label, danger }) => (
    <Link
      to={to}
      onClick={handleClose}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
        ${danger ? 'text-red-500 hover:bg-red-50' : 'text-fashion-charcoal hover:bg-primary-50 hover:text-primary-200'}`}
    >
      <span className={`${danger ? 'text-red-400' : 'text-fashion-gray'}`}>{icon}</span>
      {label}
    </Link>
  )

  return (
    <div className="space-y-1">
      {/* User identity */}
      <div className="px-3 pb-2 border-b border-gray-100 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-fashion-dark">{user.name || 'My Account'}</p>
            <p className="text-xs text-fashion-gray truncate max-w-40">{user.email || user.mobile}</p>
          </div>
          <Link onClick={handleClose} to="/dashboard/profile">
            <HiOutlineExternalLink className="text-fashion-gray hover:text-primary-200 transition-colors" size={16}/>
          </Link>
        </div>
        {user.role === 'ADMIN' && (
          <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{background:'linear-gradient(135deg,#FF4D00,#E94560)'}}>
            ADMIN
          </span>
        )}
      </div>

      {/* Admin links */}
      {isAdmin(user.role) && (
        <div className="pb-2 border-b border-gray-100 mb-2 space-y-0.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-1">Admin Panel</p>
          <MenuItem to="/dashboard/category"       icon={<FiGrid size={14}/>}        label="Categories" />
          <MenuItem to="/dashboard/subcategory"    icon={<FiTag size={14}/>}         label="Sub Categories" />
          <MenuItem to="/dashboard/upload-product" icon={<FiUploadCloud size={14}/>} label="Upload Product" />
          <MenuItem to="/dashboard/product"        icon={<FiPackage size={14}/>}     label="All Products" />
          <MenuItem to="/dashboard/admin-orders"   icon={<FiShoppingBag size={14}/>} label="All Customer Orders" />
          <MenuItem to="/dashboard/coupons"        icon={<FiTag size={14}/>}         label="Manage Coupons" />
          <MenuItem to="/dashboard/settings"       icon={<FiGrid size={14}/>}        label="Store & Support Settings" />
        </div>
      )}

      {/* User links */}
      <div className="space-y-0.5">
        <MenuItem to="/dashboard/myorders" icon={<FiShoppingBag size={14}/>} label="My Orders" />
        {user.role !== 'ADMIN' && (
          <button
            onClick={() => {
              if (close) close()
              if (openSupport) openSupport()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-fashion-charcoal hover:bg-primary-50 hover:text-primary-200 transition-all cursor-pointer text-left"
          >
            <FiHelpCircle size={14} className="text-orange-500" />
            Customer Support & FAQ
          </button>
        )}
        <MenuItem to="/dashboard/address"  icon={<FiMapPin size={14}/>}      label="Saved Addresses" />
        <MenuItem to="/dashboard/profile"  icon={<FiUser size={14}/>}        label="Profile" />
      </div>

      <div className="border-t border-gray-100 pt-2 mt-2">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all disabled:opacity-75 cursor-pointer"
        >
          {isLoggingOut ? (
            <span className="flex items-center gap-2 text-red-600 font-bold">
              <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
              Logging out<span className="animate-pulse">...</span>
            </span>
          ) : (
            <>
              <FiLogOut size={14} className="text-red-400"/>
              Log Out
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default UserMenu
