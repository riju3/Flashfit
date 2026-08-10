import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({})
  const { fetchAddress} = useGlobalContext()

  const handleDisableAddress = async(id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success("Address Remove")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className=''>
        <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
            <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
            <button onClick={()=>setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full'>
                Add Address
            </button>
        </div>
        <div className='bg-blue-50 p-2 sm:p-4 grid gap-4 rounded-xl'>
              {
                addressList.map((address,index)=>{
                  return(
                      <div key={address._id || index} className={`border rounded-xl p-3 flex justify-between gap-3 bg-white min-w-0 ${!address.status && 'hidden'}`}>
                          <div className='w-full min-w-0 space-y-1 text-xs sm:text-sm text-fashion-charcoal'>
                            <p className='font-bold text-fashion-dark break-words'>{address.address_line}</p>
                            <p className='break-words'>{address.city}</p>
                            <p className='break-words font-semibold text-orange-700'>{address.state} - <span className='font-mono font-bold'>{address.pincode}</span></p>
                            <p className='text-gray-500 font-medium'>Mobile: {address.mobile}</p>
                          </div>
                          <div className='flex flex-col justify-between items-center gap-4 shrink-0'>
                            <button onClick={()=>{
                              setOpenEdit(true)
                              setEditData(address)
                            }} className='bg-green-100 text-green-700 p-2 rounded-xl hover:text-white hover:bg-green-600 transition-all' title="Edit">
                              <MdEdit size={16}/>
                            </button>
                            <button onClick={()=>
                              handleDisableAddress(address._id)
                            } className='bg-red-100 text-red-600 p-2 rounded-xl hover:text-white hover:bg-red-600 transition-all' title="Delete">
                              <MdDelete size={16}/>  
                            </button>
                          </div>
                      </div>
                  )
                })
              }
              <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                Add address
              </div>
        </div>

        {
          openAddress && (
            <AddAddress close={()=>setOpenAddress(false)}/>
          )
        }

        {
          OpenEdit && (
            <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
          )
        }
    </div>
  )
}

export default Address
