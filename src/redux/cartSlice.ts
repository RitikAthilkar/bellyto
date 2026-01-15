import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface ICart {
    _id:string
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
    cartquantity:number
    isavailable?:boolean,
    discountpercent?:string,
    rating?:string,
    reviewcount?:string,
    deliverytime?:string,
    expirydate?:Date,
    tag:string
}
interface ICartSlice{
       cartData: ICart[] 
       subtotal:number,
       deliveryFee:number,
       finalTotal:number
}

const initialState:ICartSlice = {
    cartData:[],
    subtotal:0,
    deliveryFee:40,
    finalTotal:40,
}
const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        setCartData: (state, action:PayloadAction<ICart>) => {
          state.cartData?.push(action.payload)
          cartSlice.caseReducers.calculateTotal(state)
        },

    updateQuantity:(state,action)=>{
          if (!state.cartData) return
       const {action:type,id} = action.payload
        const item = state.cartData?.find(i => i._id === id)
            if (item) {
                if (type === "increase") item.cartquantity += 1
                if (type === "decrease"){
                      item.cartquantity -= 1
                      if(item.cartquantity==0){
                         state.cartData = state.cartData.filter(i => i._id !== id)
                      }
                } 
            }
             cartSlice.caseReducers.calculateTotal(state)
    },

     calculateTotal:(state)=>{
            state.subtotal = state.cartData.reduce((acc, item) => {
                return acc + Number(item.price) * Number(item.cartquantity)
            }, 0)

            state.deliveryFee = state.subtotal<199?40:0
            state.finalTotal = state.subtotal+state.deliveryFee
     }

    }
})

export const {setCartData, updateQuantity} = cartSlice.actions
export default cartSlice.reducer