import { auth } from "@/auth";
import connectDb from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
     try {
        await connectDb()
        const session = await auth()
        const deliveryboyId = session?.user?.id
        const {action , assignmentId } = await req.json()
        if(!deliveryboyId){
            return NextResponse.json(
                {message:"assignment id not found"},
                {status:400}
            )
        }
        if(!assignmentId){
            return NextResponse.json(
                {message:"assignment id not found"},
                {status:400}
            )
        }
        const alreadyassigned = await DeliveryAssignment.findOne({
            assignedTo:assignmentId,
            status:{$nin:['brodcasted','completed']}
         })

         if(alreadyassigned){
           return NextResponse.json(
                {message:"already assigned to other"},
                {status:400}
            )
         }

        var assignmentData = await DeliveryAssignment.findById(assignmentId);
        if(assignmentData.status!=='brodcasted'){
            return NextResponse.json(
                {message:"assignment expired"},
                {status:400}
            )
        }
        if(action=="accept"){
             
            assignmentData.status="assigned"
            assignmentData.assignedTo=deliveryboyId
            assignmentData.acceptedAt=new Date()

            const orderData = await Order.findById({_id:assignmentData.order._id})
           if(!orderData){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }
            orderData.assignment = assignmentData._id
            orderData.assignedDeliveryboy = deliveryboyId

            await assignmentData.save()
            await orderData.save()

           return NextResponse.json(
                {message:"order assigned"},
                {status:200}
            )
        }
     } catch (error) {
                return NextResponse.json(
                {message:`delivery boy accept or reject error ${error}`},
                {status:500}
            )
     }
}