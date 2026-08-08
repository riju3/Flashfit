import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import isAdmin from '../utils/isAdmin'
import { HiOutlineExternalLink } from "react-icons/hi"
import {
  FiUser, FiShoppingBag, FiMapPin, FiLogOut,
  FiGrid, FiTag, FiUploadCloud, FiPackage
} from 'react-icons/fi'

const UserMenu = ({ close }) => {
  const user     = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response.data.success) {
        if (close) close()
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate('/')
      }
    } catch (error) { AxiosToastError(error) }
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
          <MenuItem to="/dashboard/settings"       icon={<FiGrid size={14}/>}        label="Payment Settings" />
        </div>
      )}

      {/* User links */}
      <div className="space-y-0.5">
        <MenuItem to="/dashboard/myorders" icon={<FiShoppingBag size={14}/>} label="My Orders" />
        <MenuItem to="/dashboard/address"  icon={<FiMapPin size={14}/>}      label="Saved Addresses" />
        <MenuItem to="/dashboard/profile"  icon={<FiUser size={14}/>}        label="Profile" />
      </div>

      <div className="border-t border-gray-100 pt-2 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <FiLogOut size={14} className="text-red-400"/>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default UserMenu
