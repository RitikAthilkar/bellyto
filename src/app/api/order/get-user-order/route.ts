import connectDb from "@/config/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {orderId} = await req.json();
        if(!orderId){
            return NextResponse.json(
                {message:`order id not found`},
                {status:400}
            )
        }

        const order = await Order.findById(orderId).populate('assignedDeliveryboy')
        
        if(!order){
            return NextResponse.json(
                {message:`order not found`},
                {status:400}
            )
        }
        return NextResponse.json(
                order,
                {status:200}
            )
    } catch (error) {

         return NextResponse.json(
                {message:`order fetching error ${error}`},
                {status:200}
            )

    }
}