import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {  ClipboardCheck,Package2, PlusCircle,  } from 'lucide-react';
import Link from 'next/link'
const AdminProduct = () => {
  return (
    <>
         <div className=" px-5 flex justify-end items-center  mt-5">
                     <ul className="flex gap-3">
                       <motion.li
                         className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center hover:bg-gray-200 "
                         whileTap={{ scale: 0.97 }}>
                         <PlusCircle className="" />
                         <Link href="/admin/add_grocery/" className=" ms-2">
                           Add Grocery
                         </Link>
                       </motion.li>
                       <motion.li
                         className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center  hover:bg-gray-200"
                         whileTap={{ scale: 0.97 }}>
                         <Package2 />
                         <Link href="" className="ms-2">
                           View Grocery
                         </Link>
                       </motion.li>
                       <motion.li
                         className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center  hover:bg-gray-200"
                         whileTap={{ scale: 0.97 }}>
                         <ClipboardCheck />
                         <Link href="" className="ms-2">
                           Manage Order
                         </Link>
                       </motion.li>
                     </ul>
                   </div> 
    </>
  )
}

export default AdminProduct;
