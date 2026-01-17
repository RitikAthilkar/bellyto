import mongoose, { Schema } from "mongoose";

interface Iorder{
    _id?:mongoose.Types.ObjectId,
    user:mongoose.Types.ObjectId,
    orderId:string,
    items:[
        {
                product:mongoose.Types.ObjectId,
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
                cartquantity:number,
                isavailable?:boolean,
                discountpercent?:string,
                tag:string
            
        }
    ],
    address:[
            name:string,
            mobile:string ,
            fulladdress:string,
            city:string,
            state:string,
            pincode:string,
            latitude:string,
            longitude:string,
    ]
    deliveryTime?:string
    totalAmount:string
    paymentMethod:"cod" | "online"
    paymentStatus:boolean,
    status:"pending" | "processing" | "ready to dispatch" | "in transit" |"assigned deliveryboy" | "out for delivery" | "delivered"
    assignment?:mongoose.Types.ObjectId,
    assignedDeliveryboy?:mongoose.Types.ObjectId,
    createdAt?:Date
    UpdatedAt?:Date
}

const OrderSchema = new mongoose.Schema<Iorder>({
 user:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"User"
 },
 orderId:{
    type:String,
    required:true,
 },
 items: [
  {
    product: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Grocery"
    },
    name: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    subcategory: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    mrp: {
      type: String,
      required: true
    },
    unitquantity: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    stockquantity: {
      type: Number,
      required: true
    },
    cartquantity: {
      type: Number,
      required: true
    },
    isavailable: {
      type: Boolean,
      default: true
    },
    discountpercent: {
      type: String
    },
    tag: {
      type: String,
      required: true
    }
  }
 ],
address: [
  {
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    fulladdress: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    }
  }
],
deliveryTime: {
  type: String,
  required: false
},
totalAmount: {
  type: String,
  required: true
},

paymentMethod: {
  type: String,
  enum: ["cod", "online"],
  required: true
},
status: {
  type: String,
  enum: [
    "pending",
    "processing",
    "ready to dispatch",
    "assigned deliveryboy",
    "out for delivery",
    "delivered",
    "refund requested",
    "failed to deliver"
  ],
  default: "pending"
},
paymentStatus:{
  type: Boolean,
  required:false,
  default: false
},
assignment:{
  type: mongoose.Types.ObjectId,
  ref:"DeliveryAssignment",
},
assignedDeliveryboy:{
  type: mongoose.Types.ObjectId,
  ref:"User",
},

},{timestamps:true})

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

export default Order