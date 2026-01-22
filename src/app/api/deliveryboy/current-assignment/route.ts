import { auth } from "@/auth";
import connectDb from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        
        await connectDb()
        const session = await auth()
        const assignment = await DeliveryAssignment.findOne({
            assignedTo:session?.user?.id,
            status:"assigned"
        })
        const order = await Order.findOne({
            _id:assignment.order,
        })


        if(!assignment){
                    return NextResponse.json(
                            {message:"No active assignment"},
                            {status:400}
                        )
        }

                   return NextResponse.json(
                            {assignment:assignment,order:order},
                            {status:200}
                        )
    } catch (error) {
                     return NextResponse.json(
                            {message:`Fetch active assignment error ${error}`},
                            {status:500}
                        )
    }
}