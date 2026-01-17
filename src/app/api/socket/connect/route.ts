import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {userId,socketId} = await req.json();
        
        if(!userId || !socketId){
            return NextResponse.json(
                {message:"userid or socketid not found"},
                {status:400}
            )
        }
        const connect = await User.findByIdAndUpdate({_id:userId},{
           socketId, 
            isOnline:true
        },{new:true})

                return NextResponse.json(
                {message:"socketId updated"},
                {status:200}
            )

    } catch (error) {
             return NextResponse.json(
                {message:"userid or socketid update error"},
                {status:500}
            )
    }
}