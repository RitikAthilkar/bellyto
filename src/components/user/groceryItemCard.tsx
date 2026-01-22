import React, {useState} from 'react'
import mongoose from "mongoose";
import Image from 'next/image'
import {motion} from 'motion/react'
import GroceryDetailCard from './GroceryDetailCard';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCartData, updateQuantity } from "@/redux/cartSlice";
import { RootState } from '@/redux/store';
import { Minus, Plus } from 'lucide-react';
 interface IProduct {
   _id:mongoose.Types.ObjectId,
    name:string,
    sku:string,
    description:string,
    category:string,
    subcategory:string,
    brand:string,
    price:string,
    mrp:string,
    unitquantity:string,
    unit:string,
    image:string,
    stockquantity:number,
    isavailable?:boolean,
    discountpercent?:string,
    rating?:string,
    reviewcount?:string,
    deliverytime?:string,
    expirydate?:Date,
    tag:string

       }
const GroceryItemCard = ({ products }: { products: IProduct[] }) => {
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);

  const dispatch  = useDispatch<AppDispatch>()
   const { cartData } = useSelector((state:RootState)=>state.cart);
   
  const dummyProduct = [
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
    {
      id: 1,
      name: "Organic Basmati Rice",
      sku: "RICE-BAS-001",
      description: "Premium long grain organic basmati rice.",
      category: "Grocery",
      subcategory: "Rice & Grains",
      brand: "GreenFarm",
      price: "120",
      mrp: "150",
      unitquantity: "1",
      unit: "kg",
      image:
        "https://res.cloudinary.com/drtmhp4nm/image/upload/v1768290594/grocery_products/ghztts0dl4bgibihu2ef.png",
      stockquantity: 50,
      isavailable: true,
      discountpercent: "20",
      rating: "4.5",
      reviewcount: "128",
      deliverytime: "2-3 days",
      expirydate: new Date("2026-12-31"),
      tag: "bestseller",
    },
  ];

  const hadleCardDetails= async(product_id:string)=>{
      const filterproduct =await products.find(i=> i._id?.toString() == product_id)
      setItem(filterproduct || null);
      setOpen(true)
  }

   const  handleAddToCart=async(id:mongoose.Types.ObjectId)=> {
         try {

            const response = await axios.post('/api/user/addtocart',{id:id,quantity:1})
    
             dispatch(setCartData(response.data));
       
           
         } catch (error) {
           console.log(" Server error ", error);
         }
    }
   const handleQuantity = async (
     action:string,
     id: string
   ) => {
         
     try {
            const response = await axios.patch("/api/user/addtocart", {
              productId: id,
              action: action,
            });
            if(action=="increase"){
                 dispatch(updateQuantity({ action: "increase", id }));
            }else{
                dispatch(updateQuantity({ action: "decrease", id }));
            }

            
     } catch (error) {
         console.log("handle quantity error")
     }

   };
  return (
    <>
      <div id="products-div">
        <h2 className="text-sm sm:text-xl font-semibold mt-5">Top Products</h2>
        <motion.div
          className="flex gap-5 items-center overflow-x-auto scrollbar-hide py-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{
            duration: 0.6,
          }}>
          {products.map((item, index) => {
            const cartItem = cartData?.find(
              (i) => i._id == item._id.toString()
            );

            console.log("cartData", cartData);
            // console.log("items", item);
            // console.log("cartItem", cartItem);
            // console.log("cartData length", cartData?.length);
            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col justify-center items-center h-85 w-80 p-4 shrink-0 shadow-lg rounded-2xl shadow-gray-300  cursor-pointer"
                key={index}>
                <div
                  className="relative  "
                  onClick={() => {
                    hadleCardDetails(item._id.toString());
                  }}>
                  <img
                    src={item.image}
                    alt="product image "
                    className=" z-0 h-40"
                  />
                </div>

                <div className=" w-full text-start ">
                  <h2 className="text-base">{item.name.slice(0, 40)}...</h2>
                </div>
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-sm ">
                    <span className="  rounded-sm p-1">
                      <i className="bi bi-star-fill text-yellow-400"></i> 4.7
                    </span>
                    (100)
                  </h2>
                  <h2 className="text-sm bg-blue-100 p-1 rounded-sm mt-1">
                    {item.unitquantity}
                    {item.unit}
                  </h2>
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                  <h2 className="text-sm p-1 ">
                    <span className="text-lg rounded-sm p-1 font-semibold">
                      ₹{item.price}
                    </span>
                    <span className="line-through">{item.mrp}</span>
                    <span className="text-green-600 font-semibold ms-1">
                      {item.discountpercent}% Off
                    </span>

                  </h2>

                  {!cartItem ? (
                    <>
                      <button
                        className="p-2 border rounded-lg text-sm bg-green-600 text-white"
                        onClick={() => {
                          handleAddToCart(item._id);
                        }}>
                        <i className="bi bi-cart"></i> Add To Cart
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50  rounded-sm  flex items-center p-1">
                        <button
                          onClick={() => {
                            handleQuantity("decrease", item._id.toString());
                          }}
                          className="bg-green-200 text-green-600 rounded-sm mx-3">
                          <Minus className="h-5 w-5" />
                        </button>
                        <span>{cartItem.cartquantity}</span>
                        <button
                          onClick={() => {
                            handleQuantity("increase", item._id.toString());
                          }}
                          className="bg-green-200 text-green-600 rounded-sm mx-3">
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>

      <GroceryDetailCard
        item = {item}
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default GroceryItemCard
