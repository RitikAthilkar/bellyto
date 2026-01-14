import mongoose, { Mongoose } from "mongoose";

interface ICart{
    _id:mongoose.Types.ObjectId,
    email:string,
    product_id:string,
    cartquantity:Number
}

const cartSchema = new mongoose.Schema<ICart>({
    email:{
     type:String,
     required:true
   },
   product_id:{
     type:String,
     required:true
   },
   cartquantity:{
     type:Number,
     default:1
   },
},{timestamps:true})

const Cart = mongoose.models.Cart ||  mongoose.model("Cart",cartSchema)

export default Cart