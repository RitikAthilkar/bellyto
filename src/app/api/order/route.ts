import { auth } from "@/auth";
import connectDb from "@/config/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        
      await connectDb()
      const {userId,items,address,totalAmount, paymentMethod, paymentStatus,status} =await req.json();
            
      if(!userId|| !items || !address || !totalAmount || !paymentMethod){
       return NextResponse.json(
            {message:"Please Send All Credentials"},
            {status:400}
        )
      }
      const user = await User.findById(userId)
      if(!user){
        return NextResponse.json(
            {message:"user not found"},
            {status:400}
        )
      }

     const orderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000)

       const neworder = await Order.create({
         user : userId,
         orderId,
         items,
         address,
         totalAmount,
         paymentMethod,
         paymentStatus,
         status,

       })

       return NextResponse.json(
            {message:"Order Placed successfully"},
            {status:200}
        )




    } catch (error) {
        return NextResponse.json(
            {message:`Failed To Place Order ${error}`},
            {status:500}
        )
    }
}
export async function GET(req:NextRequest){
    try {
        
       await connectDb()
       const order = await Order.find()
       return NextResponse.json(
            order,
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`Failed To Place Order ${error}`},
            {status:500}
        )
    }
}