'use client'
import React, {useRef, useState} from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, Package, Search, ShoppingCartIcon, User } from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react'
import userlogo from '@/asset/image/element/user2.png'
import Badge from "@mui/material/Badge";
import mongoose from 'mongoose';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
       interface IUser {
         _id?: mongoose.Types.ObjectId;
         email: string;
         name: string;
         password?: string;
         mobile?: string;
         role?: "user" | "admin" | "deliveryBoy";
         image?: string;
       }
const Nav = ({user}:{user:IUser}) => {
    const [showsearch, setShowSearch] = useState(false)
  return (
    <>
      <div className="w-screen fixed top-2 px-1 md:px-5">
        <nav className=" rounded-2xl  bg-linear-to-t from-purple-800 to-purple-500 flex  justify-between items-center sm:h-15 h-14">
          <div className="flex items-center">
            <Link
              href={"/"}
              className="text-white text-xl md:text-3xl font-bold px-3 md:px-5 p-3 ">
              Bellyto
            </Link>
            <form className="hidden md:flex items-center p-2 px-3 rounded-full h-10 bg-white w-xl mx-4">
              <Search />
              <input
                type="text"
                placeholder="Search for fruits, snacks and more..."
                className="ms-3 text-lg w-full"
              />
            </form>

            <div className="hidden sm:block">
              <h2 className="text-sm text-white font-bold">Deliver To</h2>
              <h2 className="text-base text-white font-bold">
                Bhandara 441904
              </h2>
            </div>
          </div>
          <div className="flex items-center px-2 md:px-5">
            <Link
              href={""}
              className="relative w-9 h-9 sm:w-10 sm:h-10 bg-white flex justify-center items-center rounded-full me-3 transition-all md:hidden block"
              onClick={() => {
                setShowSearch(!showsearch);
              }}>
              <Search className="h-5 text-purple-600" />
            </Link>
            <Link
              href={""}
              className="relative w-9 h-9 sm:w-10 sm:h-10 bg-white flex justify-center items-center rounded-full me-3 transition-all">
              <Badge
                badgeContent={4}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#facc15",
                    color: "#000",
                  },
                }}
                // color="warning"
              >
                <ShoppingCartIcon className="h-5 text-purple-600" />
              </Badge>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 shadow-2xl rounded-2xl p-2 -translate-x-[35px] bg-white border border-gray-100 w-full"
                sideOffset={5}>
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
        </nav>
        <AnimatePresence>
          {showsearch && (
            <motion.div
              initial={{
                opacity: 0.5,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              exit={{ opacity: 0, scale: 0.9 }}>
              <form className="flex items-center p-2 px-3 rounded-full h-10 bg-white  border border-gray-300 mt-2 shadow-2xl">
                <input
                  type="text"
                  placeholder="Search for fruits, snacks and more..."
                  className="ms-3 text-base w-full"
                />
                <i
                  className="bi bi-x text-2xl"
                  onClick={() => {
                    setShowSearch(false);
                  }}></i>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Nav