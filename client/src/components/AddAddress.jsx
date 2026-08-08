import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'
import axios from 'axios'

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm()
    const { fetchAddress } = useGlobalContext()
    const [loadingPincode, setLoadingPincode] = useState(false)

    const pincodeValue = watch('pincode')

    // Automatically fetch City & State when a valid 6-digit Indian PIN code is entered
    useEffect(() => {
        if (pincodeValue && pincodeValue.length === 6 && /^\d+$/.test(pincodeValue)) {
            const fetchPincodeDetails = async () => {
                try {
                    setLoadingPincode(true)
                    const res = await axios.get(`https://api.postalpincode.in/pincode/${pincodeValue}`)
                    if (res.data && res.data[0] && res.data[0].Status === 'Success') {
                        const postOffice = res.data[0].PostOffice?.[0]
                        if (postOffice) {
                            setValue('city', postOffice.District || postOffice.Name || '')
                            setValue('state', postOffice.State || '')
                            toast.success(`Autofilled: ${postOffice.District}, ${postOffice.State}`)
                        }
                    } else {
                        toast.error("Invalid Pincode")
                    }
                } catch (err) {
                    console.log("Pincode lookup error", err)
                } finally {
                    setLoadingPincode(false)
                }
            }
            fetchPincodeDetails()
        }
    }, [pincodeValue, setValue])

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: "India",
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto flex items-center justify-center p-4'>
            <div className='bg-white p-6 w-full max-w-lg mx-auto rounded-2xl shadow-xl'>
                <div className='flex justify-between items-center gap-4 border-b pb-3 mb-4'>
                    <h2 className='font-bold text-lg text-fashion-dark'>Add New Delivery Address</h2>
                    <button onClick={close} className='hover:text-red-500 text-gray-400 p-1 rounded-full hover:bg-gray-100 transition-colors'>
                        <IoClose size={22} />
                    </button>
                </div>
                <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor='addressline' className='text-xs font-bold text-fashion-charcoal'>Address Line (House No, Street, Area) :</label>
                        <input
                            type='text'
                            id='addressline'
                            placeholder='e.g. Flat 302, Green Valley Apartments'
                            className='border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200'
                            {...register("addressline", { required: true })}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='pincode' className='text-xs font-bold text-fashion-charcoal flex justify-between items-center'>
                            <span>Pincode :</span>
                            {loadingPincode && <span className='text-[11px] text-orange-600 font-normal animate-pulse'>Fetching City & State...</span>}
                        </label>
                        <input
                            type='text'
                            id='pincode'
                            maxLength={6}
                            placeholder='Enter 6-digit Pincode'
                            className='border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 font-mono font-bold'
                            {...register("pincode", { required: true })}
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                        <div className='grid gap-1'>
                            <label htmlFor='city' className='text-xs font-bold text-fashion-charcoal'>City / District :</label>
                            <input
                                type='text'
                                id='city'
                                placeholder='Auto-filled by Pincode'
                                className='border border-gray-200 bg-gray-100 p-2.5 rounded-xl text-sm font-semibold text-fashion-dark focus:outline-none'
                                {...register("city", { required: true })}
                            />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='state' className='text-xs font-bold text-fashion-charcoal'>State :</label>
                            <input
                                type='text'
                                id='state'
                                placeholder='Auto-filled by Pincode'
                                className='border border-gray-200 bg-gray-100 p-2.5 rounded-xl text-sm font-semibold text-fashion-dark focus:outline-none'
                                {...register("state", { required: true })}
                            />
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='mobile' className='text-xs font-bold text-fashion-charcoal'>Mobile No. :</label>
                        <input
                            type='text'
                            id='mobile'
                            placeholder='10-digit mobile number'
                            className='border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200'
                            {...register("mobile", { required: true })}
                        />
                    </div>

                    <button type='submit' className='bg-gradient-to-r from-orange-500 to-amber-500 text-white w-full py-3 font-bold rounded-xl shadow-md hover:opacity-95 transition-all mt-2'>
                        Save Address
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress
