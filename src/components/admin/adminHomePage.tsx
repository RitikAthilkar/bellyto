'use client'
import React, {useState} from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from 'motion/react'
import { Bell, Clipboard, ClipboardCheck, LogOut, Menu, MenuSquareIcon, Package, Package2, PlusCircle, Search, ShoppingCartIcon, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import mongoose from 'mongoose';
import { signOut } from "next-auth/react";
import userlogo from '@/asset/image/element/user2.png'
import AdminProduct from './adminProduct';
       interface IUser {
         _id?: mongoose.Types.ObjectId;
         email: string;
         name: string;
         password?: string;
         mobile?: string;
         role?: "user" | "admin" | "deliveryBoy";
         image?: string;
       }
const AdminHomePage = ({user}:{user:IUser}) => {
 const [open, setOpen] = useState(false);
 const [active, setActive]= useState(2)
 
 const sideBarMenu = [
   { id: 1, icon: "bi-house-fill", label: "Dashboard" },
   { id: 2, icon: "bi-bag-check-fill", label: "Products" },
   { id: 4, icon: "bi-box-seam-fill", label: "Inventory" },
   { id: 5, icon: "bi-tag-fill", label: "Offer & Coupon" },
   { id: 5, icon: "bi-people-fill", label: "User" },
   { id: 5, icon: "bi-file-earmark-text-fill", label: "Report" },
   { id: 3, icon: "bi-headset", label: "Support" },
 ];

  return (
    <>
      <div className="min-h-screen w-screen grid grid-cols-10">
        <div className="min-h-screen bg-purple-800 col-span-2">
          <div className="h-15 flex justify-center items-center border-b border-purple-600">
            <Link href={"/"} className="text-4xl font-bold text-white">
              Bellyto
            </Link>
          </div>
          <ul className="flex flex-col gap-4 mt-10 px-5">
            {sideBarMenu.map((item, index) => {
              return (
                <>
                  <motion.li
                    key={index}
                    className={`bg-white text-sm rounded-lg p-2 px-5 font-semibold flex items-center 
                      ${
                        active == item.id
                          ? "bg-yellow-400 text-black"
                          : "text-gray-600 "
                      }
                      `}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setActive(item.id);
                    }}>
                    <i className={`bi ${item.icon} text-lg`}></i>
                    <button className=" ms-2 text-base">{item.label}</button>
                  </motion.li>
                </>
              );
            })}
          </ul>
        </div>
        <div className="min-h-screen col-span-8">
          <div className="bg-white h-15 flex justify-end p-2 shadow-lg px-5">
            <div className="flex ">
              <div className=" px-3 hidden md:block">
                <ul className="flex gap-1">
                  <motion.li
                    className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center hover:bg-gray-200 "
                    whileTap={{ scale: 0.97 }}>
                    <i className="bi bi-bell-fill text-2xl"></i>
                  </motion.li>
                  <motion.li
                    className="bg-white text-sm text-gray-600 rounded-full p-2 font-semibold flex items-center  hover:bg-gray-200"
                    whileTap={{ scale: 0.97 }}>
                    <i className="bi bi-gear-fill text-2xl"></i>
                  </motion.li>
                </ul>
              </div>
              <button
                className="block md:hidden "
                onClick={() => {
                  setOpen(true);
                }}>
                <Menu className="text-white me-3" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full cursor-pointer border-0 overflow-hidden shadow-lg">
                      {user?.image ? (
                        <Image
                          alt="user image"
                          src={user.image}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <Image
                          alt="user image"
                          src={userlogo}
                          fill
                          className="object-cover rounded-full"
                        />
                      )}
                    </motion.div>
                    {/* <div className="flex flex-col cursor-pointer ms-2">
          
                      <span className="text-base capitalize text-gray-500">
                        {user?.role}
                      </span>
                    </div> */}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className=" shadow-2xl rounded-2xl p-2 -translate-x-[35px] bg-white border border-gray-100 w-full"
                  sideOffset={0}>
                  <DropdownMenuItem className="flex items-center gap-2 py-2">
                    <div className="relative h-12 w-12 rounded-full border-1 border-gray-200">
                      {user?.image ? (
                        <Image
                          alt="user image"
                          src={user.image}
                          fill
                          className="object-cover rounded-full "
                        />
                      ) : (
                        <Image
                          alt="user image"
                          src={userlogo}
                          fill
                          className="object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-medium capitalize">
                        {user?.name}
                      </span>
                      <span className="text-sm capitalize text-gray-500">
                        {user?.role}
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-3 py-2 border-t border-gray-200 px-5">
                    <Package className="!h-6 !w-6 text-purple-600" />
                    <span className="!text-base">My Order</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-3 py-2 border-t border-gray-200 cursor-pointer px-5"
                    onClick={() => signOut()}>
                    <LogOut className="!h-6 !w-6 text-purple-600" />
                    <span className="!text-base">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>{active == 2 && <AdminProduct />}</div>
        </div>
      </div>
    </>
  );
}

export default AdminHomePage
