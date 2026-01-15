
import { auth } from "@/auth";
import connectDb from "@/config/db";
import uploadOnCloudinary from "@/lib/cloudinary";
import deleteFromCloudinary from '@/lib/cloudinary'
import Grocery from "@/models/grocey.model";
import { frameData } from "motion/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){

    try {
        await connectDb();
        const session  = await auth();
        if(session?.user?.role!=='admin'){
            return NextResponse.json(
                {message:"access denied"},
                {status:400}
            )
        }
            // return NextResponse.json(
            //     {message:"access denied"},
            //     {status:400}
            // )
        const formData =await req.formData()
            //   return NextResponse.json(
            //     formData,
            //     {status:400}
            // )
       
        const name = formData.get("name") as string
        const sku = formData.get("sku") as string
            const description = formData.get("description") as string
            const category = formData.get("category") as string
            const subcategory = formData.get("subcategory") as string
            const brand = formData.get("brand") as string
            const price = formData.get("price") as string
            const mrp = formData.get("mrp") as string
            const unit = formData.get("unit") as string
            const unitquantity = formData.get("unitquantity") as string
            const stockquantity = formData.get("stockquantity") as string
            const tag = formData.get("tag") as string
            const file = formData.get("image") as Blob | null
            let imageurl
            if(file){
             imageurl = await uploadOnCloudinary(file)
            }
               
              const discountpercent =Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)


                function generateSKU(name: string, unitquantity: string, unit:string) {
                const shortName = name.replace(/\s+/g, "").toUpperCase().slice(0, 5); 
                const randomNum = Math.floor(100 + Math.random() * 900000); 
                return `${shortName}${unitquantity}${unit}${randomNum}`;
                }

                let checkInventory = await Grocery.findOne({ sku: sku });

                if (checkInventory) {
      
                
                checkInventory = await Grocery.findOneAndUpdate(
                    { sku: sku },
                    {
                    $set: {
                        name,
                        description,
                        category,
                        subcategory,
                        brand,
                        price,
                        mrp,
                        discountpercent,
                        unit,
                        unitquantity,
                        tag,
                        image: imageurl ?? undefined,
                       
                    },
                    $inc: { stockquantity: parseInt(stockquantity) || 0 },
                    },
                    { new: true }
                );
                } else {

                const newSKU = generateSKU(name, unitquantity, unit);
                checkInventory = await Grocery.create({
                    name,
                    sku: newSKU,
                    description,
                    category,
                    subcategory,
                    brand,
                    price,
                    mrp,
                    unit,
                    unitquantity,
                    tag,
                    image: imageurl ?? undefined,
                    stockquantity,
                   
                });
                }

         return NextResponse.json(
                {message:"Grocery Added Successfully"},
                {status:200}
         )
                    
    } catch (error) {
             return NextResponse.json(
                {message:`Grocery Added Error ${error}`},
                // {message:`Grocery Added Error ${JSON.stringify(error)}`},
                {status:500}
             )
    }
}

export async function GET(req:NextRequest){  
    
    try {
          await connectDb()
          const grocery =await Grocery.find()
          if(grocery.length>0){
                 return NextResponse.json(
                 grocery,
                {status:200}
            )
          }else{
              return NextResponse.json(
                {message:"no grocery data found"},
                {status:400}
            )
          }
    } catch (error) {
           return NextResponse.json(
                {message:" grocery data fetch error"},
                {status:500}
            )
    }
}