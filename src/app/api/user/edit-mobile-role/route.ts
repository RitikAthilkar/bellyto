import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/config/db";
import bcrypt from "bcryptjs";
import { useSession } from "next-auth/react";

export async function POST(req:NextRequest) {
    

    try {
      await connectDb()
     const {mobile, role, password} = await req.json();

    const session = await auth()
   
    
      const updateData: any = { mobile, role };

    if (password) {
     const hashPassword = await bcrypt.hash(password,10)
      updateData.password = hashPassword;
    }

    const user = await User.findByIdAndUpdate(
      session?.user?.id,
      updateData,
      { new: true }
    );

    if(!user){
        return NextResponse.json(
            {message:"User Not Found"},
            {status:400}
        )
    }
          return NextResponse.json(
            user,
            {status:200}
        )
    } catch (error) {
            return NextResponse.json(
            {message:`Mobile & Role Update Error ${error}`},
            {status:500}
        )
    }

0

}