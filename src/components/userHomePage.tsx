import Image from 'next/image'
import React from 'react'
import banner from '@/asset/image/banner/banner.png'
import Link from 'next/link'

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
import pasta from "@/asset/image/products/snacks/sweet_corner.png";

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




const UserHomePage = () => {

    const grocery = [
        {image:fruits,lable:'Fresh Fruits'},
        {image:vegitable,lable:'Fresh vegitables'},
        {image:exotic,lable:'Exotic Fruits'},
        {image:milk,lable:'Dairy, Bread And Eggs'},
        {image:atta,lable:'atta, rice and dal'},
        {image:breakfast,lable:'Cereals and BreakFast'},
        {image:dryfruit,lable:'Dry Fruits'},
        {image:busicuit,lable:'biscuits and cakes'},
        {image:masala,lable:'masalas'},
        {image:oil,lable:'oil and ghee'},
        {image:sauce,lable:'sauces and spreads'},
        {image:tea,lable:'Tea and coffee drinks'},
    ]
    const snack = [
      { image: chocolate, lable: "Chocolates" },
      { image: icecream, lable: "ice creams" },
      { image: chips, lable: "Chips and namkeens" },
      { image: drinks, lable: "cold drinks and juices" },
      { image: noodle, lable: "noodle and pasta" },
      { image: frozen, lable: "frozen food" },
      { image: pasta, lable: "sweet corner" },

    ];
    const beauty = [
      { image: body, lable: "Bath ad body" },
      { image: hair, lable: "hare care" },
      { image: skin, lable: "skin care" },
      { image: oralcare, lable: "Oral care" },
      { image: makeup, lable: "makeup" },
      { image: baby, lable: "baby care" },
      { image: fregrance, lable: "Fregrances" },
      { image: protien, lable: "whey protien" },
      { image: pharma, lable: "health and pharma" },
     
    ];
  return (
    <>
      <Image alt="banner image" src={banner} className="w-screen" />
      <div className="mt-5 overflow-x-auto scrollbar-hide">
        <h2 className="text-xl font-semibold">Grocery & Kitchen</h2>
        <div className="grid grid-cols-18 mt-2 ">
          {grocery.map((item, index) => {
            return (
              <div
                key={index}
                className="col-span-2 flex justify-center items-center flex-col  w-40 mt-2 cursor-pointer">
                <Image
                  alt="grocery image"
                  src={item.image}
                  className="w-30 rounded-2xl"
                />
                <h2 className="text-sm capitalize mt-1 ">{item.lable}</h2>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 overflow-x-auto scrollbar-hide">
        <h2 className="text-xl font-semibold">Snacks & Drinks</h2>
        <div className="grid grid-cols-18 mt-2 ">
          {snack.map((item, index) => {
            return (
              <div
                key={index}
                className="col-span-2 flex justify-center items-center flex-col  w-40 mt-2 cursor-pointer">
                <Image
                  alt="grocery image"
                  src={item.image}
                  className="w-30 rounded-2xl"
                />
                <h2 className="text-sm capitalize mt-1 ">{item.lable}</h2>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 overflow-x-auto scrollbar-hide">
        <h2 className="text-xl font-semibold">Beauty & Wellness</h2>
        <div className="grid grid-cols-18 mt-2 ">
          {beauty.map((item, index) => {
            return (
              <div
                key={index}
                className="col-span-2 flex justify-center items-center flex-col  w-40 mt-2 cursor-pointer">
                <Image
                  alt="grocery image"
                  src={item.image}
                  className="w-30 rounded-2xl"
                />
                <h2 className="text-sm capitalize mt-1 ">{item.lable}</h2>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="mt-5 overflow-x-auto scrollbar-hide">
        <h2 className="text-xl font-semibold">Grocery & Kitchen</h2>
        <div className="flex gap-4 w-max mt-2">
          {grocery.map((item, index) => {
            return (
              <div
                key={index}
                className="flex justify-center items-center flex-col  w-40">
                <Image
                  alt="grocery image"
                  src={item.image}
                  className="w-30 rounded-2xl"
                />
                <h2 className="text-sm capitalize">{item.lable}</h2>
              </div>
            );
          })}
        </div>
      </div> */}
    </>
  );
}

export default UserHomePage
