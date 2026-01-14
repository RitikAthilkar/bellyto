import { createSlice } from "@reduxjs/toolkit";
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
    image?:string,
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
       cartData: ICart[] | null
}

const initialState:ICartSlice = {
    cartData:null
}
const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        setCartData: (state, action) => {
        if (Array.isArray(action.payload)) {
            state.cartData = action.payload
        } else if (action.payload) {
            state.cartData = [action.payload]
        } else {
            state.cartData = []
        }
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
                        state.cartData=null
                      }
                } 
            }
    },

    }
})

export const {setCartData, updateQuantity} = cartSlice.actions
export default cartSlice.reducer