import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { FiArrowLeft, FiCheckCircle, FiPlus, FiCreditCard, FiSmartphone, FiTag } from 'react-icons/fi'
import { FaMoneyBillWave } from 'react-icons/fa'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const [selectAddress, setSelectAddress] = useState(0)
  const [step, setStep] = useState(1) // 1: Delivery Address, 2: Payment Method
  const [upiId, setUpiId] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('upi') // 'upi', 'cod', 'card'

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [verifyingCoupon, setVerifyingCoupon] = useState(false)

  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      toast.error("Please enter a coupon code")
      return
    }
    try {
      setVerifyingCoupon(true)
      const response = await Axios({
        ...SummaryApi.verifyCoupon,
        data: {
          code: couponCodeInput.trim(),
          orderAmount: totalPrice
        }
      })
      if (response.data?.success && response.data?.data) {
        setAppliedCoupon(response.data.data)
        toast.success(`Coupon ${response.data.data.code} applied! Saved ₹${response.data.data.discountAmount}`)
      }
    } catch (error) {
      AxiosToastError(error)
      setAppliedCoupon(null)
    } finally {
      setVerifyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCodeInput('')
    toast.info("Coupon removed")
  }

  const finalPayableAmount = Math.max(0, totalPrice - (appliedCoupon?.discountAmount || 0))

  useEffect(() => {
    if (!user?.authLoading && !user?._id) {
      toast.error("Please login to access checkout")
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  // Fetch UPI Merchant Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getSettings })
        if (response.data.success && response.data.data) {
          setUpiId(response.data.data.upiId || '')
        }
      } catch (_) {}
    }
    fetchSettings()
  }, [])

  const handleProceedToPayment = () => {
    if (!addressList || addressList.length === 0) {
      toast.error("Please add a delivery address first")
      setOpenAddress(true)
      return
    }
    if (selectAddress === null || selectAddress === undefined || !addressList[selectAddress]) {
      toast.error("Please select a delivery address")
      return
    }
    setStep(2)
  }

  const handleCashOnDelivery = async () => {
    try {
      toast.loading("Placing Order...")
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: finalPayableAmount,
          couponCode: appliedCoupon?.code || ""
        }
      })

      const { data: responseData } = response
      toast.dismiss()

      if (responseData.success) {
        toast.success(responseData.message || "Order placed successfully!")
        if (fetchCartItem) fetchCartItem()
        if (fetchOrder) fetchOrder()
        navigate('/order-success', {
          state: {
            orderDetails: responseData.data || { _id: responseData.orderId }
          }
        })
      }
    } catch (error) {
      toast.dismiss()
      AxiosToastError(error)
    }
  }

  const handleUPIAppPayment = async (appName) => {
    const merchantUpi = upiId || 'flashfit@upi'
    const payeeName = 'FlashFit Fashion'
    const transactionNote = `FlashFit Order Payment`
    
    // Standard UPI Intent Link
    const upiLink = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(payeeName)}&am=${finalPayableAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`

    // Attempt to launch the app on mobile devices
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = upiLink
    } else {
      toast.info(`Opening ${appName}... Please complete payment on your mobile.`)
    }

    // Place the order into backend database and show success animation
    try {
      toast.loading(`Processing ${appName} order...`)
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: finalPayableAmount,
          couponCode: appliedCoupon?.code || "",
          payment_status: "PAID via " + appName
        }
      })

      const { data: responseData } = response
      toast.dismiss()

      if (responseData.success) {
        if (fetchCartItem) fetchCartItem()
        if (fetchOrder) fetchOrder()
        navigate('/order-success', {
          state: {
            orderDetails: responseData.data || { _id: responseData.orderId }
          }
        })
      }
    } catch (error) {
      toast.dismiss()
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Redirecting to Card Payment Gateway...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response
      toast.dismiss()
      stripePromise.redirectToCheckout({ sessionId: responseData.id })

      if (fetchCartItem) fetchCartItem()
      if (fetchOrder) fetchOrder()
    } catch (error) {
      toast.dismiss()
      AxiosToastError(error)
    }
  }

  return (
    <section className="bg-gray-50/70 min-h-[85vh] py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Stepper Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-2 rounded-xl hover:bg-gray-100 text-fashion-dark transition-colors"
                title="Back to Address"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-lg font-bold text-fashion-dark">
              {step === 1 ? "1. Delivery Address Confirmation" : "2. Select Payment Method"}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className={`px-3 py-1.5 rounded-full ${step === 1 ? 'bg-orange-500 text-white' : 'bg-green-100 text-green-700'}`}>
              Step 1: Address
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-3 py-1.5 rounded-full ${step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              Step 2: Payment
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* STEP 1: Address Selection */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-fashion-dark">Select Delivery Address</h2>
                  <button
                    onClick={() => setOpenAddress(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl transition-all"
                  >
                    <FiPlus size={14} /> Add New Address
                  </button>
                </div>

                <div className="space-y-3">
                  {addressList && addressList.length > 0 ? (
                    addressList.map((address, index) => {
                      if (!address.status) return null
                      const isSelected = Number(selectAddress) === index

                      return (
                        <label
                          key={address._id || index}
                          onClick={() => setSelectAddress(index)}
                          className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/30 shadow-sm'
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={isSelected}
                              onChange={() => setSelectAddress(index)}
                              className="mt-1 accent-orange-500 w-4 h-4"
                            />
                            <div className="flex-1 text-xs text-fashion-gray space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-fashion-dark">
                                  {address.address_line}
                                </span>
                                {isSelected && (
                                  <span className="text-xs bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <FiCheckCircle size={10} /> Selected
                                  </span>
                                )}
                              </div>
                              <p>{address.city}, {address.state} - <span className="font-bold text-fashion-dark">{address.pincode}</span></p>
                              <p className="text-fashion-dark font-semibold pt-1">Mobile: {address.mobile}</p>
                            </div>
                          </div>
                        </label>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
                      <p className="text-sm font-semibold text-fashion-gray mb-3">No saved addresses found.</p>
                      <button
                        onClick={() => setOpenAddress(true)}
                        className="py-2.5 px-5 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-orange-600 transition-all"
                      >
                        + Add Address Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Payment Selection */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-base font-bold text-fashion-dark border-b pb-3">
                  Choose Payment Method
                </h2>

                {/* Option 1: UPI Direct Apps (Myntra Style) */}
                <div
                  onClick={() => setSelectedPayment('upi')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedPayment === 'upi' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_option"
                        checked={selectedPayment === 'upi'}
                        onChange={() => setSelectedPayment('upi')}
                        className="accent-orange-500 w-4 h-4"
                      />
                      <div>
                        <span className="font-bold text-sm text-fashion-dark flex items-center gap-2">
                          <FiSmartphone className="text-orange-500" size={18} /> Instant UPI Payment
                        </span>
                        <p className="text-xs text-fashion-gray">Pay directly using any installed UPI App</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                      FASTEST
                    </span>
                  </div>

                  {selectedPayment === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      <p className="text-xs font-bold text-fashion-charcoal">Select your UPI App:</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Google Pay Button */}
                        <button
                          onClick={() => handleUPIAppPayment('Google Pay')}
                          className="flex items-center justify-center gap-2.5 p-3.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl transition-all group"
                        >
                          <span className="font-extrabold text-xs text-blue-600 group-hover:scale-105 transition-transform">
                            GPay
                          </span>
                          <span className="text-xs font-bold text-fashion-dark">Google Pay</span>
                        </button>

                        {/* PhonePe Button */}
                        <button
                          onClick={() => handleUPIAppPayment('PhonePe')}
                          className="flex items-center justify-center gap-2.5 p-3.5 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition-all group"
                        >
                          <span className="font-extrabold text-xs text-purple-700 group-hover:scale-105 transition-transform">
                            PhonePe
                          </span>
                          <span className="text-xs font-bold text-fashion-dark">PhonePe</span>
                        </button>

                        {/* Paytm Button */}
                        <button
                          onClick={() => handleUPIAppPayment('Paytm')}
                          className="flex items-center justify-center gap-2.5 p-3.5 bg-gray-50 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 rounded-xl transition-all group"
                        >
                          <span className="font-extrabold text-xs text-cyan-600 group-hover:scale-105 transition-transform">
                            Paytm
                          </span>
                          <span className="text-xs font-bold text-fashion-dark">Paytm UPI</span>
                        </button>
                      </div>

                      {upiId && (
                        <p className="text-[11px] text-gray-400 text-center pt-1">
                          Merchant UPI ID: <span className="font-mono font-bold text-gray-600">{upiId}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Option 2: Cash on Delivery */}
                <div
                  onClick={() => setSelectedPayment('cod')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedPayment === 'cod' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_option"
                      checked={selectedPayment === 'cod'}
                      onChange={() => setSelectedPayment('cod')}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-sm text-fashion-dark flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" size={16} /> Cash on Delivery (COD)
                      </span>
                      <p className="text-xs text-fashion-gray">Pay with cash when your package arrives</p>
                    </div>
                  </div>

                  {selectedPayment === 'cod' && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={handleCashOnDelivery}
                        className="w-full py-3.5 px-6 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
                      >
                        Confirm & Place COD Order
                      </button>
                    </div>
                  )}
                </div>

                {/* Option 3: Credit / Debit Card (Stripe) */}
                <div
                  onClick={() => setSelectedPayment('card')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedPayment === 'card' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_option"
                      checked={selectedPayment === 'card'}
                      onChange={() => setSelectedPayment('card')}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-sm text-fashion-dark flex items-center gap-2">
                        <FiCreditCard className="text-blue-600" size={16} /> Credit / Debit Card
                      </span>
                      <p className="text-xs text-fashion-gray">Secured by Stripe International Payment Gateway</p>
                    </div>
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={handleOnlinePayment}
                        className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
                      >
                        Proceed to Card Checkout
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Sidebar Summary Card */}
          <div className="w-full lg:w-80 h-fit bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-extrabold text-fashion-dark uppercase tracking-wider border-b pb-3">
              Order Summary
            </h3>

            {/* Apply Coupon Section - Only Visible in Step 1 (Checkout / Address Page) */}
            {step === 1 && (
              <div className="pt-1 border-b pb-3 space-y-2">
                <p className="text-xs font-bold text-fashion-dark flex items-center gap-1.5">
                  <FiTag className="text-orange-500" /> Apply Coupon Code
                </p>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 p-2.5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-green-700 flex items-center gap-1">
                        <FiCheckCircle size={14} /> Coupon {appliedCoupon.code} Applied!
                      </p>
                      <p className="text-[10px] text-green-600 font-semibold">
                        Saved {DisplayPriceInRupees(appliedCoupon.discountAmount)} ({appliedCoupon.discountPercentage}% OFF)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-red-500 hover:bg-red-100/60 px-2 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FIRST10"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-extrabold tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={verifyingCoupon}
                      className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {verifyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-fashion-gray">
                <span>Items Total ({totalQty})</span>
                <span className="line-through">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
              </div>
              <div className="flex justify-between text-fashion-gray">
                <span>Discounted Items Total</span>
                <span className="font-bold text-fashion-dark">{DisplayPriceInRupees(totalPrice)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- {DisplayPriceInRupees(appliedCoupon.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-fashion-gray">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-extrabold text-fashion-dark">
                <span>Grand Total</span>
                <span className="text-base text-orange-600">{DisplayPriceInRupees(finalPayableAmount)}</span>
              </div>
            </div>

            {/* Proceed to Payment Button under Order Summary when in Step 1 */}
            {step === 1 && (
              <div className="pt-2">
                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  Proceed to Payment Options →
                </button>
              </div>
            )}

            {/* Selected Address Preview if in Step 2 */}
            {step === 2 && addressList && addressList[selectAddress] && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs bg-gray-50 p-3 rounded-xl">
                <p className="font-bold text-fashion-dark mb-1">Delivering To:</p>
                <p className="text-fashion-gray truncate">{addressList[selectAddress].address_line}</p>
                <p className="text-fashion-gray">{addressList[selectAddress].city}, {addressList[selectAddress].pincode}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  )
}

export default CheckoutPage
