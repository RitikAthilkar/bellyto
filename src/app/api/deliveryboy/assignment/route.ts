import { auth } from "@/auth";
import connectDb from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
export async function GET(red:NextRequest){
    try {
        await connectDb();
        const session = await auth()
        const assignment = await DeliveryAssignment.find({
            brodcastedTo:session?.user?.id,
            status:"brodcasted"
        }).populate("order")

        if(!assignment){
            return NextResponse.json(
                {message:"Assignment not found"},
                {status:200}
            )
        }
               return NextResponse.json(
                assignment,
                {status:200}
            )
        
    } catch (error) {
                 return NextResponse.json(
                {message:`Assignment data fetchinh error ${error}`},
                {status:200}
            )
    }
}