import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {  ClipboardCheck,Package2, PlusCircle,  } from 'lucide-react';
import Link from 'next/link'
import AddGrocery from './addGrocery';
import ManageOrder from './ManageOrder';

const AdminProduct = () => {
    const [actionbtn, setActionBtn] = useState('')

  return (
    <>
      <div className=" px-5 flex justify-between items-center  mt-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="text-lg font-semibold"
          onClick={() => setActionBtn("")}>
          Products Dashboard
        </motion.button>
        <ul className="flex gap-3">
          {/* <motion.li
            className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center  hover:bg-gray-200"
            whileTap={{ scale: 0.97 }}>
            <i className="bi bi-bag-check text-xl"></i>
            <button onClick={() => setActionBtn("")} className="ms-2">
              Products Dashboard
            </button>
          </motion.li> */}
          {actionbtn != "addgrocery" && (
            <motion.li
              className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center hover:bg-gray-200 cursor-pointer"
              whileTap={{ scale: 0.97 }}
              onClick={() => setActionBtn("addgrocery")}>
              <PlusCircle className="" />
              <button className=" ms-2">Add Grocery</button>
            </motion.li>
          )}

          <motion.li
            className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center  hover:bg-gray-200"
            whileTap={{ scale: 0.97 }}>
            <Package2 />
            <Link href="" className="ms-2">
              View Grocery
            </Link>
          </motion.li>

          {actionbtn != "manageorder" && (
            <motion.li
              className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center  hover:bg-gray-200"
              whileTap={{ scale: 0.97 }}
              onClick={() => setActionBtn("manageorder")}>
              <ClipboardCheck />
              <Link href="" className="ms-2">
                Manage Order
              </Link>
            </motion.li>
          )}
        </ul>
      </div>

      {actionbtn == "addgrocery" && <AddGrocery />}
      {actionbtn == "manageorder" && <ManageOrder />}
    </>
  );
}

export default AdminProduct;
