import React, { useState } from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";
import CustomerSupportModal from '../components/CustomerSupportModal';

const UserMenuMobile = () => {
  const [openSupportModal, setOpenSupportModal] = useState(false)

  return (
    <section className='bg-white min-h-screen w-full py-2'>
        <button onClick={()=>window.history.back()} className='text-neutral-800 block w-fit ml-auto p-2 cursor-pointer'>
          <IoClose size={25}/>
        </button>
        <div className='container mx-auto px-3 pb-8'>
           <UserMenu openSupport={() => setOpenSupportModal(true)} />
        </div>

        <CustomerSupportModal isOpen={openSupportModal} onClose={() => setOpenSupportModal(false)} />
    </section>
  )
}

export default UserMenuMobile
