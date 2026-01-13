import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import mongoose from "mongoose";
import {motion} from 'motion/react'
import { PlusCircle, ClipboardCheck, Package2 } from "lucide-react";
import Link from "next/link";
import userlogo from '@/asset/image/element/user2.png'
import React from 'react'
       interface IUser {
         _id?: mongoose.Types.ObjectId;
         email: string;
         name: string;
         password?: string;
         mobile?: string;
         role?: "user" | "admin" | "deliveryBoy";
         image?: string;
       }
const Sidebar = ({user, open, onOpenChange }: {user:IUser, open: boolean; onOpenChange :()=>void}) => {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className=" bg-linear-to-t from-purple-800 to-purple-500 border-0 w-60">
          <SheetHeader>
            <SheetTitle className="flex border-b border-gray-300 py-3">
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
              <div className="flex flex-col ms-2">
                <span className="text-base font-medium capitalize text-white">
                  {user?.name}
                </span>
                <span className="text-sm capitalize text-gray-100">
                  {user?.role}
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className=" px-5 ">
            <ul className="flex flex-col gap-3">
              <motion.li
                className="bg-white/20 text-white border border-purple-400 shadow-2xl  text-sm rounded-full p-2 font-semibold flex items-center "
                whileTap={{ scale: 0.97 }}>
                <PlusCircle className="" />
                <Link href="" className=" ms-2">
                  Add Grocery
                </Link>
              </motion.li>
              <motion.li
                className="bg-white/20 text-white border border-purple-400 shadow-2xl  text-sm rounded-full p-2 font-semibold flex items-center"
                whileTap={{ scale: 0.97 }}>
                <Package2 />
                <Link href="" className="ms-2">
                  View Grocery
                </Link>
              </motion.li>
              <motion.li
                className="bg-white/20 text-white border border-purple-400 shadow-2xl  text-sm rounded-full p-2 font-semibold flex items-center"
                whileTap={{ scale: 0.97 }}>
                <ClipboardCheck />
                <Link href="" className="ms-2">
                  Manage Order
                </Link>
              </motion.li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar
