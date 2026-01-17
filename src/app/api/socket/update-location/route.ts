import User from "@/models/user.model";
import mongoose  from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {userId,location} = await req.json();
        
        if(!userId || !location){
            return NextResponse.json(
                {message:"userid or location not found"},
                {status:400}
            )
        }
                const connect = await User.findByIdAndUpdate(
                                userId, 
                                { $set: { location } },
                                { new: true }
                                )


                return NextResponse.json(
                {message:"Location updated"},
                {status:200}
            )

    } catch (error) {
             return NextResponse.json(
                {message:`location update error ${error}`},
                {status:500}
            )
    }
}