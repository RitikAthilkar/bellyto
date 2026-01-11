import { NextRequest, NextResponse } from "next/server";
import connectDb from '@/config/db'
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
export async function POST(req:NextRequest){

    
    try {
        await connectDb()
        const {name,email,password} = await req.json()
   
        const existUser = await User.findOne({email})
        if(existUser){
            return NextResponse.json(
                {message:'User Already Exist'},
                {status:400}
            )
        }

        if(password.length < 6){
            return NextResponse.json(
                {message:'Password length should atleast 6 '},
                {status:400}
            )
        }

        const hashPassword =await bcrypt.hash(password,10);

        const user = await User.create({name,email,password:hashPassword})
        if(user){
        return NextResponse.json(
                user,
                {status:200}
            )
        }

 
    } catch (error) {
           return NextResponse.json(
               {message:`Register error  ${error}`},
               {status:200}
            )
    }

}