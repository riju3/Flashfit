import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // ── Redirect to login if user is not logged in ────────────────────────
        if (!user?._id) {
            toast.error("Please login to add items to cart")
            navigate('/login')
            return
        }

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    // Checking if item is in cart
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data?._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data?._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])

    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?._id) {
            toast.error("Please login to modify cart")
            navigate('/login')
            return
        }

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)
        if (response.success) {
            toast.success("Item added")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?._id) {
            toast.error("Please login to modify cart")
            navigate('/login')
            return
        }

        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)
            if (response.success) {
                toast.success("Item removed")
            }
        }
    }

    return (
        <div className="w-full">
            {isAvailableCart ? (
                <div className="flex w-full h-9 rounded-xl border border-primary-200 overflow-hidden bg-white shadow-sm">
                    <button
                        onClick={decreaseQty}
                        className="bg-primary-50 text-primary-200 hover:bg-primary-100 flex-1 flex items-center justify-center transition-colors"
                    >
                        <FaMinus size={11} />
                    </button>

                    <span className="flex-1 font-bold text-sm text-fashion-dark flex items-center justify-center px-1">
                        {qty}
                    </span>

                    <button
                        onClick={increaseQty}
                        className="bg-primary-50 text-primary-200 hover:bg-primary-100 flex-1 flex items-center justify-center transition-colors"
                    >
                        <FaPlus size={11} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleADDTocart}
                    disabled={loading}
                    className="w-full text-xs font-semibold py-2 px-4 rounded-xl text-white transition-all hover:shadow-orange hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg,#FF4D00,#E94560)' }}
                >
                    {loading ? <Loading /> : 'Add to Cart'}
                </button>
            )}
        </div>
    )
}

export default AddToCartButton
