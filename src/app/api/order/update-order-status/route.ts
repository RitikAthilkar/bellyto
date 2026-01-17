import connectDb from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import axios from "axios";
import { set } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

 
export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {orderId,status} = await req.json()
        if(!orderId){
            return NextResponse.json(
                {message:"order id not found"},
                {status:400}
            )
        }
        const order = await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }

        let Deliveryboypayload:any = []
        if(status=='ready for dispatch' && !order.assignment){
             const {latitude, longitude} = order.address[0]
                if (!latitude || !longitude) {
                return NextResponse.json(
                    { message: `Latitude or Longitude missing ${order.address[0].longitude}` },
                    { status: 400 }
                )
                }
             const nearbydeliveryBoy = await User.find({
                role:"deliveryBoy",
                location:{
                    $near:{
                        $geometry:{type:"Point",coordinates:[Number(longitude),Number(latitude)]},
                        $maxDistance:10000
                    }
                }
             })

             const nearbyIds = nearbydeliveryBoy.map(i=>i._id)
             const busyIds = await DeliveryAssignment.find({
                assignedTo:{$in:nearbyIds},
                status:{$nin:["brodcasted","completed"]}
             }).distinct("assignedTo")

             const busyIdSet = new Set(busyIds.map((i)=>String(i)))
             const availableDeliveryboy = nearbydeliveryBoy.filter(
                i=>!busyIdSet.has(String(i._id))
             )

             var candidates = availableDeliveryboy.map(i=>i._id)
 
             if(candidates.length==0){
                await order.save();
                return NextResponse.json(
                    {message:"Delivery Boy Not found "},
                    {status:200}
                )
             }
             
             const deliveryAssignment = await DeliveryAssignment.create({
                order:order._id,
                brodcastedTo:candidates,
                status:"brodcasted"
             })
            order.assignment = deliveryAssignment._id
            order.status = status
            Deliveryboypayload = await availableDeliveryboy.map(i=>({
                 id:i._id,
                 name:i.name,
                 mobile:i.mobile,
                 latitude:i.location.coordinates[1],
                 longitude:i.location.coordinates[1]
            }))
            await deliveryAssignment.populate("order")

        }else{
            order.status=status
            await order.save()
            return NextResponse.json(
                {message:"status Upated"},
                {status:200}
            )
        }

        await order.save()
        await order.populate("user")
       return NextResponse.json(
                {assignment:order.assignment?._id,
                availabledeliveryBoy:Deliveryboypayload
                },
                {status:200}
            )
              

    } catch (error:any) {
          console.error("Full Error:", error?.stack) 
            return NextResponse.json(
                {message:`update order status error ${error}`},
                {status:500}
            )
    }
}