import { timeStamp } from "console"
import mongoose, { mongo, Mongoose } from "mongoose"


interface Igrocery {
    _id?:mongoose.Types.ObjectId,
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

const GrocerySchema = new mongoose.Schema<Igrocery>({
     name:{
        type:String,
        required:true
     },
     sku:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     tag:{
        type:String,
        required:true
     },
     category:{
        type:String,
        enum:[
            "fruits",
            "vegitables",
            "exotic_fruits",
            "dairy_bread_eggs",
            "flour_grains",
            "cereals_breakFast",
            "dry_fruits",
            "biscuits_cakes",
            "masalas",
            "oil_ghee",
            "tea_coffee_drinks",
            "sauces_spreads",
            "chocolates",
            "chips_namkeen",
            "ice_creams",
            "cold_drinks_juices",
            "noodle_pasta",
            "sweet_corner",
            "frozen_food",
            "body_care",
            "hair_care",
            "skin_care",
            "oral_care",
            "makeup",
            "makeup",
            "baby_care",
            "fregrances",
            "protein_supplements",
            "health_pharma",

        ],
        required:true
     },
     subcategory:{
        type:String,
        required:true
     },
     brand:{
        type:String,
        required:true
     },
     price:{
        type:String,
        required:true
     },
     mrp:{
        type:String,
        required:true
     },
     unit:{
        type:String,
        required:true,
        enum:['kg','g','liter','ml','piece', 'pack']
     },
     unitquantity:{
        type:String,
        required:true,

     },
     image:{
        type:String,
        required:false
     },
     stockquantity:{
        type:Number,
        required:true
     },
     isavailable:{
        type:Boolean,
        required:false
     },
     discountpercent:{
        type:String,
        required:false
     },
     rating:{
        type:String,
        required:false
     },
     reviewcount:{
        type:String,
        required:false
     },
     deliverytime:{
        type:String,
        required:false
     },
     expirydate:{
        type:Date,
        required:false
     }
},{timestamps:true,collection: "products" })

const Grocery = mongoose.models.Grocery || mongoose.model('Grocery',GrocerySchema)

export default Grocery