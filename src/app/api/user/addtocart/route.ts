import { auth } from "@/auth";
import connectDb from "@/config/db";
import Cart from "@/models/cart.model";
import Grocery from "@/models/grocey.model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){

    try {

    await connectDb()
    const session = await auth()

    const request =await req.json()
    const productId = JSON.parse(JSON.stringify(request.id))
    const quantity = JSON.parse(JSON.stringify(request.quantity))

    const productData = await Grocery.findOne({_id:productId})

    const checkStock = parseInt(productData.stockquantity)

       if(quantity>checkStock){
            return NextResponse.json(
                    {message:`Only ${checkStock} items is in stock`},
                    {status:400}
            )
        }
      
        const addtocart  = await Cart.findOneAndUpdate({
           email:session?.user?.email,product_id: productId},{
           $inc: { cartquantity: Number(quantity) > 0 ? Number(quantity) : 1 }
           },{new:true,upsert:true})
         
        if(!addtocart){
            return NextResponse.json(
            {message:`Item Add To Cart error`},
            {status:400}
          )

        }
        const cartData = {
            ...productData.toObject(),
            cartquantity:quantity
          }
          return NextResponse.json(
            cartData,
            {status:200}
          )

        
    } catch (error) {
         console.log("ADD TO CART ERROR 👉", error) 
          return NextResponse.json(
                    {message:`error ${error} `},
                    {status:500}
            )
    }
}

export async function GET(req:NextRequest){
      
  try {
    await connectDb()
    const session = await auth();
    const cartData = await Cart.find({email:session?.user?.email})
    const productIds = cartData.map(item => item.product_id)
    const products = await Grocery.find({ _id: { $in: productIds } })

    const merged = products.map(prod => {
      const cartItem = cartData.find(
        item => item.product_id.toString() === prod._id.toString()
      )
      return {
        ...prod.toObject(),
        cartquantity: cartItem?.cartquantity || 1
      }
    })
    if (merged.length > 0) {
      return NextResponse.json(merged, { status: 200 })
    }
//  return NextResponse.json(merged.length>0?merged:'', { status: 200 })
    
  } catch (error) {
        console.log("GET CART ERROR:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const { productId, action } = await req.json()

  const cartItem = await Cart.findOne({ product_id: productId })

  if (!cartItem) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (action === "increase") {
    cartItem.cartquantity += 1
  } else if (action === "decrease") {
    cartItem.cartquantity -= 1
    if (cartItem.cartquantity <= 0) {
      await cartItem.deleteOne()
      return NextResponse.json({ removed: true })
    }
  }

  await cartItem.save()
  return NextResponse.json(cartItem)
}
