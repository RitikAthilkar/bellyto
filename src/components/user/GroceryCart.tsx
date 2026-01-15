
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import mongoose, { Mongoose } from "mongoose";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Package2 } from "lucide-react";
import { MdDeliveryDining } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateQuantity } from "@/redux/cartSlice";
import atta from '@/asset/image/products/grocery/atta.png'
import { Tooltip } from "react-tooltip";
import axios from "axios";

const GroceryCart = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange:()=>void
}) => {

   const {cartData, subtotal, deliveryFee, finalTotal} = useSelector((state:RootState)=>state.cart)
const dispatch = useDispatch<AppDispatch>()

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
      <Tooltip id="tooltipID" />
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className=" bg-white w-[30vw] !max-w-none h-screen overflow-y-auto z-999999">
          <SheetHeader>
            <SheetTitle className="flex">
              <ShoppingCart className="text-gray-600" />
              <h3 className="text-xl ms-1 text-gray-600 font-semibold">
                My Cart
              </h3>
            </SheetTitle>
            
            {cartData.length > 0 ? (
              <>
                <div className="mt-5 rounded-2xl shadow-md   border border-gray-200 ">
                  <div className="p-3 flex items-center">
                    {/* <i className="bi bi-box-seam me-1"></i> */}
                    <h2 className="text-base text-gray-600">
                      Shipment Of {cartData.length} Items
                    </h2>
                  </div>
                  {cartData
                    ? cartData.map((item, index) => {
                        return (
                          <div
                            className="grid grid-cols-12  p-3 w-full"
                            key={index}>
                            <div className="col-span-3 ">
                              <div className="relative h-25 ">
                                <Image
                                  src={item.image}
                                  alt="product image"
                                  fill
                                />
                              </div>
                            </div>
                            <div className="col-span-6 px-1">
                              <div className="">
                                <h2 className="text-base">
                                  {item.name.slice(0, 30)} ...{" "}
                                </h2>
                                <h2 className="text-base text-gray-500">
                                  {item.unitquantity}
                                  {item.unit} x {item.cartquantity}
                                </h2>
                                <h2 className="text-lg font-semibold">
                                  ₹
                                  {Number(item.price) *
                                    Number(item.cartquantity)}
                                </h2>
                              </div>
                            </div>
                            <div className="col-span-3 flex justify-center items-center ">
                              <div className="bg-green-50  rounded-sm  flex items-center p-1">
                                <button
                                  onClick={() => {
                                    handleQuantity("decrease", item._id);
                                  }}
                                  className="bg-green-200 text-green-600 rounded-sm mx-3">
                                  <Minus className="h-5 w-5" />
                                </button>
                                <span>{item.cartquantity}</span>
                                <button
                                  onClick={() => {
                                    handleQuantity("increase", item._id);
                                  }}
                                  className="bg-green-200 text-green-600 rounded-sm mx-3">
                                  <Plus className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
                <div className="mt-5 rounded-2xl shadow-md   border border-gray-200 p-3">
                  <h2 className="font-bold text-lg">Billing Amount</h2>
                  <div className="flex justify-between items-center mt-1 border-b border-gray-200 py-2">
                    <div className="flex items-center">
                      <i className="bi bi-box-seam-fill me-2"></i>
                      <h2>Item Total</h2>
                    </div>
                    <h2 className="text-base">₹{subtotal}</h2>
                  </div>
                  <div className="flex justify-between items-center mt-1 border-b border-gray-200 py-2">
                    <div className="flex items-center">
                      <MdDeliveryDining className="text-xl me-2" />
                      <h2>Deliver Charge</h2>{" "}
                      <i
                        className="bi bi-info-circle ms-2"
                        // title="₹40 Deliver charge applicable if order below ₹199"
                        data-tooltip-id="tooltipID"
                        data-tooltip-content="₹40 Deliver charge applicable if order below ₹199"></i>
                    </div>
                    <h2 className="text-base">₹{deliveryFee}</h2>
                  </div>
                  <div className="flex justify-between items-center mt-1 border-b border-gray-200 py-2">
                    <div className="flex items-center">
                      <i className="bi bi-handbag-fill me-2"></i>
                      <h2>Handling Charge</h2>
                      <i
                        className="bi bi-info-circle ms-2"
                        // title="For proper handling and ensuring high quality quick-deliveries"
                        data-tooltip-id="tooltipID"
                        data-tooltip-content="For proper handling and ensuring high quality quick-deliveries"></i>
                    </div>
                    <h2 className="text-base">9</h2>
                  </div>
                  <div className="flex justify-between items-center mt-1 border-b border-gray-200 py-2">
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold"> Total Amount</h2>
                    </div>
                    <h2 className="text-xl font-bold">₹{finalTotal}</h2>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl shadow-md   border border-gray-200 p-3">
                  <h2 className="font-bold text-lg">Cancellation Policy</h2>
                  <p className="text-base text-gray-500">
                    Orders cannot be cancelled once packed for delivery. In case
                    of unexpected delays, a refund will be provided, if
                    applicable.
                  </p>
                </div>
              
                 <button className="bg-green-600 rounded-full p-2 text-lg text-white w-full mt-2">Proceed to checkout</button>
              
              </>
            ) : (
              <>
                <div className="border border-gray-200 rounded-xl shadow-lg mt-40 flex flex-col justify-center items-center p-3">
                  <i className="bi bi-basket text-5xl text-gray-500 font-semibold mb-1"></i>
                  <h2 className="text-base text-gray-500 my-1">
                    Your Cart is empty! add groceries to continue 
                  </h2>
                  <button className="text-base bg-green-600 text-white rounded-xl p-2 mt-2" onClick={()=>{onOpenChange()}}>
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GroceryCart;
