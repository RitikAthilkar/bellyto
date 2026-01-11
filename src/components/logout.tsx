'use client'
import { auth } from "@/auth";
import EditMobileRole from "@/components/editMobileRole";
import connectDb from "@/config/db";
import User from "@/models/user.model";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default async function Logout() {
  
      return (
        <button
          className="text-lg bg-orange-400 text-black p-3 m-2 " onClick={()=>{signOut()}}>
          Logout
        </button>
      );
}
