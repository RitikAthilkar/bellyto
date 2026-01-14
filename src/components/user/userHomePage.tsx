'use client'
import Image from 'next/image'
import React from 'react'
import banner from '@/asset/image/banner/banner.png'
import Link from 'next/link'
import {motion}  from 'motion/react'

// grocery images
import fruits from '@/asset/image/products/grocery/fruits2.png'
import milk from '@/asset/image/products/grocery/milk_bread2.png'
import vegitable from '@/asset/image/products/grocery/vegitable.png'
import exotic from '@/asset/image/products/grocery/exotic_fruits.png'
import atta from '@/asset/image/products/grocery/atta.png'
import dryfruit from "@/asset/image/products/grocery/dryfruit.png";
import breakfast from '@/asset/image/products/grocery/breakfast.png'
import busicuit from '@/asset/image/products/grocery/buiscuit_cake.png'
import masala from '@/asset/image/products/grocery/masala.png'
import oil from '@/asset/image/products/grocery/oil_ghee.png'
import sauce from '@/asset/image/products/grocery/sauce_spread.png'
import tea from '@/asset/image/products/grocery/tea_coffee.png'

// snacks
import chocolate from "@/asset/image/products/snacks/chocolates.png";
import chips from "@/asset/image/products/snacks/chips_snacks.png";
import drinks from "@/asset/image/products/snacks/drinks_juices.png";
import frozen from "@/asset/image/products/snacks/frozen_food.png";
import icecream from "@/asset/image/products/snacks/icecream.png";
import noodle from "@/asset/image/products/snacks/noodle_pasta.png";
import sweet from "@/asset/image/products/snacks/sweet_corner.png";

//Beauty and wellness
import baby from "@/asset/image/products/beauty_wellness/baby_care.png";
import body from "@/asset/image/products/beauty_wellness/body_care.png";
import hair from "@/asset/image/products/beauty_wellness/hair_care.png";
import fregrance from "@/asset/image/products/beauty_wellness/fregrance.png";
import makeup from "@/asset/image/products/beauty_wellness/makeup.png";
import oralcare from "@/asset/image/products/beauty_wellness/oral_care.png";
import pharma from "@/asset/image/products/beauty_wellness/pharma_medicine.png";
import protien from "@/asset/image/products/beauty_wellness/protien_suppliments.png";
import skin from "@/asset/image/products/beauty_wellness/skin_care.png";
import mongoose from 'mongoose'
import { Star } from 'lucide-react'
import GroceryItemCard from './groceryItemCard'



       interface IProduct {
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
const UserHomePage = ({products}:{products:IProduct[]}) => {
  
    
    const grocery = [
      { value: "fruits", image: fruits, label: "Fresh Fruits" },
      { value: "vegetables", image: vegitable, label: "Fresh Vegetables" },
      { value: "dairy_bread_eggs", image: milk, label: "Dairy, Bread & Eggs" },
      { value: "flour_grains", image: atta, label: "Flour & Grains" },
      {
        value: "cereals_breakfast",
        image: breakfast,
        label: "Cereals & Breakfast",
      },
      { value: "dry_fruits", image: dryfruit, label: "Dry Fruits" },

      { value: "masalas", image: masala, label: "Masalas & Spices" },
      { value: "oil_ghee", image: oil, label: "Oil & Ghee" },
      { value: "tea_coffee_drinks", image: tea, label: "Tea & Coffee Drinks" },
    
    ];
    const snack = [
      { value: "chocolates", image: chocolate, label: "Chocolates" },
      { value: "ice_creams", image: icecream, label: "Ice Creams" },
      { value: "biscuits_cakes", image: busicuit, label: "Biscuits & Cakes" },
      {
        value: "cold_drinks_juices",
        image: drinks,
        label: "Cold Drinks & Juices",
      },
      { value: "noodle_pasta", image: noodle, label: "Noodles & Pasta" },
      { value: "sweet_corner", image: sweet, label: "Sweet Corner" },
      { value: "frozen_food", image: frozen, label: "Frozen Food" },
      { value: "sauces_spreads", image: sauce, label: "Sauces & Spreads" },
      {
        value: "chips_namkeen",
        image: chips,
        label: "Chips and namkeens",
      },
    ];
    const beauty = [
   
      { value: "body_care", image: body, label: "Body Care" },
      { value: "hair_care", image: hair, label: "Hair Care" },
      { value: "skin_care", image: skin, label: "Skin Care" },
      { value: "oral_care", image: oralcare, label: "Oral Care" },
      { value: "makeup", image: makeup, label: "Makeup" },
      { value: "baby_care", image: baby, label: "Baby Care" },
      { value: "fragrances", image: fregrance, label: "Fragrances" },
      {
        value: "protein_supplements",
        image: protien,
        label: "Protein Supplements",
      },
      { value: "health_pharma", image: pharma, label: "Health & Pharma" },
    ];




  return (
    <>
      <div className="pb-100">
        <Image alt="banner image" src={banner} className="w-screen" />
        <div id="category-div">
          <div className="mt-5 overflow-x-auto scrollbar-hide">
            <h2 className="text-sm sm:text-xl font-semibold">
              Grocery & Kitchen
            </h2>
            <div className="grid grid-cols-18 mt-2 ">
              {grocery.map((item, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{
                      duration: 0.6,
                    }}
                    key={index}
                    className="col-span-6 sm:col-span-2 flex justify-center items-center flex-col   mt-2 cursor-pointer ">
                    <Image
                      alt="grocery image"
                      src={item.image}
                      className="w-15 sm:w-30 rounded-2xl "
                    />
                    <h2 className="text-xs sm:text-sm capitalize mt-1 text-center">
                      {item.label}
                    </h2>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="mt-5 overflow-x-auto scrollbar-hide">
            <h2 className="text-sm sm:text-xl font-semibold">
              Snacks & Drinks
            </h2>
            <div className="grid grid-cols-18 mt-2 ">
              {snack.map((item, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{
                      duration: 0.6,
                    }}
                    key={index}
                    className="col-span-6 sm:col-span-2 flex justify-center items-center flex-col   mt-2 cursor-pointer ">
                    <Image
                      alt="grocery image"
                      src={item.image}
                      className="w-15 sm:w-30 rounded-2xl "
                    />
                    <h2 className="text-xs sm:text-sm capitalize mt-1 text-center">
                      {item.label}
                    </h2>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="mt-5 overflow-x-auto scrollbar-hide">
            <h2 className="text-sm sm:text-xl font-semibold">
              Beauty & Wellness
            </h2>
            <div className="grid grid-cols-18 mt-2 ">
              {beauty.map((item, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{
                      duration: 0.6,
                    }}
                    key={index}
                    className="col-span-6 sm:col-span-2 flex justify-center items-center flex-col   mt-2 cursor-pointer ">
                    <Image
                      alt="grocery image"
                      src={item.image}
                      className="w-15 sm:w-30 rounded-2xl "
                    />
                    <h2 className="text-xs sm:text-sm capitalize mt-1 text-center">
                      {item.label}
                    </h2>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <GroceryItemCard products={products}/>
      </div>
    </>
  );
}

export default UserHomePage
