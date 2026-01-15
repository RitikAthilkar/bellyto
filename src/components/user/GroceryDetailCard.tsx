import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import mongoose, { Mongoose } from 'mongoose';
import Image from 'next/image';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, setCartData } from "@/redux/cartSlice";
import axios from 'axios';
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
    image?:string,
    stockquantity:number,
    isavailable?:boolean,
    discountpercent?:string,
    rating?:string,
    reviewcount?:string,
    deliverytime?:string,
    expirydate?:Date,
    tag:string

       }
const GroceryDetailCard = ({
  item,
  open,
  onOpenChange,
}: {
 item : IProduct | null
  open: boolean;
  onOpenChange:()=>void
}) => {


  const {cartData} = useSelector((state:RootState)=>state.cart)

  const dispatch = useDispatch()


   const handleQuantity = async (action: string, id: string) => {
     try {
       const response = await axios.patch("/api/user/addtocart", {
         productId: id,
         action: action,
       });
       if (action == "increase") {
         dispatch(updateQuantity({ action: "increase", id }));
       } else {
         dispatch(updateQuantity({ action: "decrease", id }));
       }
     } catch (error) {
       console.log("handle quantity error");
     }
   };
      const handleAddToCart = async (id: mongoose.Types.ObjectId) => {
        try {
          const response = await axios.post("/api/user/addtocart", {
            id: id,
            quantity: 1,
          });

          dispatch(setCartData(response.data));
        } catch (error) {
          console.log(" Server error ", error);
        }
      };

      const cartItem = cartData?.find((c) => c._id === item?._id.toString());
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className=" bg-white w-full h-[70vh]">
          <SheetHeader>
            <SheetTitle className="">
              {item && (
                <div className="grid grid-cols-12">
                  <div className=" col-span-3 flex justify-center items-center  ">
                    <div className="relative h-60 w-60 ">
                      {item?.image && (
                        <Image
                          src={item.image}
                          alt="product image"
                          fill
                          className="object-cover rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                  <div className=" col-span-5 1  p-3">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {item.name}
                        </h2>
                        <p className="text-lg text-gray-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="mt-2 text-base text-gray-500">
                          {item.subcategory} • {item.tag}
                        </p>
                        <p className="text-base text-gray-500 mt-1">
                          Brand: {item.brand}
                        </p>
                      </div>

                      {item.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            ⭐ {item.rating}
                          </span>
                          {item.reviewcount && (
                            <span className="text-sm text-gray-500">
                              ({item.reviewcount} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-base text-gray-500 mt-2">
                        Quantity : {item.unitquantity} {item.unit}
                      </p>

                      <div className="mt-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{item.price}
                          </span>

                          <span className="text-base text-gray-500 line-through">
                            ₹{item.mrp}
                          </span>

                          {item.discountpercent && (
                            <span className="text-base font-medium text-green-700">
                              {item.discountpercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock & Delivery */}
                      <div className="mt-2 flex flex-wrap gap-4 text-base">
                        <span
                          className={`font-medium ${
                            item.stockquantity > 0
                              ? "text-green-700"
                              : "text-red-500"
                          }`}>
                          {item.stockquantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>

                        {item.deliverytime && (
                          <span className="text-gray-500">
                            Delivery: {item.deliverytime}
                          </span>
                        )}

                        {item.expirydate && (
                          <span className="text-gray-500">
                            Expiry:{" "}
                            {new Date(item.expirydate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {cartItem && cartItem.cartquantity<=0 ? (
                        <>
                          <div className="flex justify-between items-center">
                            <button className="mt-5 text-green-700 font-medium text-md  rounded-lg  transition">
                              View Product Details{" "}
                              <i className="bi bi-caret-down-fill"></i>
                            </button>
                            <button
                              onClick={() => {
                                handleAddToCart(item._id);
                              }}
                              className="mt-5 text-md bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">
                              Add to Cart
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-green-50  rounded-sm  flex justify-center items-center p-1 w-30 mt-1">
                            <button
                              onClick={() => {
                                handleQuantity("decrease", item._id.toString());
                              }}
                              className="bg-green-200 text-green-600 rounded-sm mx-3">
                              <Minus className="h-5 w-5" />
                            </button>
                            <span>{cartItem?.cartquantity}</span>
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
                  </div>
                  <div className="col-span-4  p-3">
                    <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-md">
                      <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          Quality Products
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          We ensure all products are fresh, authentic, and of
                          the highest quality for your satisfaction.
                        </p>
                      </div>

                      <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          Fast Delivery
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Get your orders delivered quickly and safely right to
                          your doorstep.
                        </p>
                      </div>

                      <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          Customer Support
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Our support team is always available to assist you
                          with your queries and concerns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GroceryDetailCard
