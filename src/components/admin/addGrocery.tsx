'use client'
import React, { useEffect, useState, useRef } from 'react'
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { Tooltip } from "react-tooltip";
import Link from 'next/link';
import { Loader2, Upload } from 'lucide-react';
import axios from 'axios';
import mongoose from "mongoose"
import Image from 'next/image';
import { motion } from 'motion/react';
import toast from "react-hot-toast";
const AddGrocery = () => {
  interface formState {
    _id?: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    description: string;
    category: string;
    subcategory: string;
    brand: string;
    price: string;
    mrp: string;
    unitquantity: string;
    unit: string;
    image: string;
    stockquantity: number;
    // expirydate: Date | null;
    tag: string;
  }
  type Option = { value: string; label: string };
  const [form, setForm] = useState<formState>({
    name: "",
    sku: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    mrp: "",
    price: "",
    unitquantity: "",
    unit: "",
    image: "",
    stockquantity: 0,
    tag: "",
  });
const [preview, setPreview] = useState('')
const [stockquantity, setStockQuantity] = useState(0)
const [imagefile, setImageFile] = useState<File | null>()
const [selectInputValue, setSelectInputValue] = useState("");
const [products, setProducts] = useState<Option[]>([]);
const [productForm, setProductForm] = useState<formState[]>([]);
const selectRef = useRef<any>(null);
const stockRef = useRef<any>(null);
    const [loader, setloader] = useState(false);
    const category = [
      { value: "fruits", label: "Fresh Fruits" },
      { value: "vegetables", label: "Fresh Vegetables" },
      { value: "dairy_bread_eggs", label: "Dairy, Bread & Eggs" },
      { value: "flour_grains", label: "Flour & Grains" },
      { value: "cereals_breakfast", label: "Cereals & Breakfast" },
      { value: "dry_fruits", label: "Dry Fruits" },
      { value: "biscuits_cakes", label: "Biscuits & Cakes" },
      { value: "masalas", label: "Masalas & Spices" },
      { value: "oil_ghee", label: "Oil & Ghee" },
      { value: "tea_coffee_drinks", label: "Tea & Coffee Drinks" },
      { value: "sauces_spreads", label: "Sauces & Spreads" },
      { value: "chocolates", label: "Chocolates" },
      { value: "ice_creams", label: "Ice Creams" },
      { value: "chips_namkeen", label: "Chips & Namkeens" },
      { value: "cold_drinks_juices", label: "Cold Drinks & Juices" },
      { value: "noodle_pasta", label: "Noodles & Pasta" },
      { value: "sweet_corner", label: "Sweet Corner" },
      { value: "frozen_food", label: "Frozen Food" },
      { value: "body_care", label: "Body Care" },
      { value: "hair_care", label: "Hair Care" },
      { value: "skin_care", label: "Skin Care" },
      { value: "oral_care", label: "Oral Care" },
      { value: "makeup", label: "Makeup" },
      { value: "baby_care", label: "Baby Care" },
      { value: "fragrances", label: "Fragrances" },
      { value: "protein_supplements", label: "Protein & Supplements" },
      { value: "health_pharma", label: "Health & Pharma" },
    ]; 

  const units = [
    { value: "kg", label: "kg" },
    { value: "g", label: "g" },
    { value: "liter", label: "liter" },
    { value: "ml", label: "ml" },
    { value: "piece", label: "piece" },
    { value: "pack", label: "pack" },
  ];

const notify = (s: string) => toast(s);
  const GetGrocery = async () => {
   
    try {
      const response = await axios.get("/api/admin/add-grocery");
      if(response.status==200){
            const options = response.data.map((p: any) => ({
              value: "sku"+"-"+ p.sku,
              label:p.name +" - " + p.unitquantity + p.unit,
            }));
        setProducts(options);
        setProductForm(response.data);
      
      }
      // console.log("grocery Data", response.data);
    } catch (error) {
      console.log("grocery Data error", error);
     
    }
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if(!files || files.length<0 ){
     return
    }
    const file = files[0]  
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    
  };


const handleSelect = (selected: Option | null) => {
  if (!selected) return;
  
  const value = selected.value;
  const check = value.split("-");
  
   if(check[0]=="sku"){
     
    const filter = productForm?.find(i=>i.sku==check[1])
        if (filter) {
          setPreview(filter.image)
          setForm({
            name: filter.name,
            sku: filter.sku,
            description: filter.description,
            category: filter.category,
            subcategory: filter.subcategory,
            brand: filter.brand,
            mrp: filter.mrp,
            price: filter.price,
            unitquantity: filter.unitquantity,
            unit: filter.unit,
            image: filter.image,
            stockquantity: filter.stockquantity,
            tag: filter.tag,
          });
          setStockQuantity(filter.stockquantity);
        }
   }else{
    setForm({
      ...form,
      name:value
    })
    console.log("value")
   }
  // console.log("Selected product id:", value);

};

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value} = e.target;


    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =  async(e:React.FormEvent) => {
     e.preventDefault();
    setloader(true);
     try {
        const formData  = new FormData();
                    
            formData.append("name", form.name);
            formData.append("sku", form.sku);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("subcategory", form.subcategory);
            formData.append("brand", form.brand);
            formData.append("price", form.price);
            formData.append("mrp", form.mrp);
            formData.append("unit", form.unit);
            formData.append("unitquantity", form.unitquantity);
            formData.append("stockquantity", String(form.stockquantity));
            formData.append("tag", form.tag);

            // Date handling
            if (imagefile) {
               formData.append("image",imagefile);
            }
                const response = await axios.post("/api/admin/add-grocery",formData);
                if(response.status==200){
                  notify("Grocery Added Successfully");
                  setForm({
                    name: "",
                    sku: "",
                    description: "",
                    category: "",
                    subcategory: "",
                    brand: "",
                    mrp: "",
                    price: "",
                    unitquantity: "",
                    unit: "",
                    image: "",
                    stockquantity: 0,
                    tag: "",
                  });
                  GetGrocery();
                  setPreview('')
                  selectRef.current?.clearValue();
                  stockRef.current.value = "";
                  setloader(false);
                }
                // console.log("grocery Add Data", response);

     } catch (error) {
       console.log("grocery Add  Error", error);
        notify("Something went wrong");
        setloader(false);
     }

  }

  const handleResetFrom = ()=>{
      setForm({
        name: "",
        sku: "",
        description: "",
        category: "",
        subcategory: "",
        brand: "",
        mrp: "",
        price: "",
        unitquantity: "",
        unit: "",
        image: "",
        stockquantity: 0,
        tag: "",
      });
      setPreview("");
      selectRef.current?.clearValue();
      stockRef.current.value = "";
      notify("Form Reset")
  }
  useEffect(() => {
    GetGrocery();
  }, []);

  return (
    <>
      <Tooltip id="tooltipID" />
      <div className=" flex flex-col justify-start items-center px-3 pb-20 mt-10">
       
        {/* <div className="">{JSON.stringify(products)}</div> */}
        {/* <div className="">{JSON.stringify(productForm)}</div> */}
        {/* <div className="">{JSON.stringify(form)}</div> */}
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="bg-white border border-gray-200 w-full sm:w-[50vw] p-4 flex flex-col justify-center items-center  rounded-2xl shadow-2xl">
          <h2 className="text-2xl text-green-600 font-bold ">
            Add Grocery Form
          </h2>
          <div className="grid grid-cols-12 gap-3 w-full mt-2 pt-4 border-t border-gray-300">
            <div className="col-span-6">
              <h2 className="text-base">
                Product Name<span className="text-red-500">*</span>
              </h2>

              <CreatableSelect
                options={products ? products : []}
                ref={selectRef}
                className="border-0 border-gray-200 w-full rounded-sm focus:border-purple-600"
                name="name"
                placeholder="search or enter product name"
                onChange={(selected) => {
                  handleSelect(selected);
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    setForm((prev) => ({ ...prev, name: inputValue }));
                  }
                }}
                isClearable
                required
              />
            </div>
            <div className="col-span-6">
              <h2 className="text-base">
                Brand Name<span className="text-red-500">*</span>
              </h2>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="brand"
                placeholder="e.g : ITC"
                value={form.brand ? form.brand : ""}
                className="p-2 py-1.5 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-12">
              <h2 className="text-base">
                Description<span className="text-red-500">*</span>
              </h2>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="description"
                value={form.description ? form.description : ""}
                placeholder="e.g : Premium quality whole wheat flour"
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6">
              <h2 className="text-base">
                Category<span className="text-red-500">*</span>
              </h2>
              {/* <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
              /> */}
              <Select
                options={category}
                className="border-0 border-gray-200 w-full rounded-sm focus:border-purple-600"
                name="category"
                placeholder="e.g : Atta, Rice & Dal"
                required
                value={
                  form.category
                    ? { label: form.category, value: form.category }
                    : null
                }
                onChange={(selected) =>
                  setForm({
                    ...form,
                    category: selected ? selected.value : "",
                  })
                }
              />
            </div>
            <div className="col-span-6">
              <h2 className="text-base">
                Subcategory<span className="text-red-500">*</span>
              </h2>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="subcategory"
                value={form.subcategory ? form.subcategory : ""}
                placeholder="e.g : Flour & Grains"
                className="p-2 py-1.5 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6">
              <h2 className="text-base">
                Selling Price (₹)<span className="text-red-500">*</span>
              </h2>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                name="price"
                placeholder="e.g : 299"
                value={form.price ? form.price : ""}
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6">
              <h2 className="text-base">
                MRP (₹)<span className="text-red-500">*</span>
              </h2>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                name="mrp"
                placeholder="e.g : 349"
                value={form.mrp ? form.mrp : ""}
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6">
              <div className="flex justify-between">
                <h2 className="text-base">
                  Product Quantity<span className="text-red-500">*</span>
                </h2>
                <i
                  className="bi bi-info-circle"
                  data-tooltip-id="tooltipID"
                  data-tooltip-content="Product quantity refers to the amount or size of the product, such as weight, volume, or number of units (e.g : 500g, 1L, 10 pcs)."></i>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                name="unitquantity"
                placeholder="e.g : 5"
                value={form.unitquantity ? form.unitquantity : ""}
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6">
              <h2 className="text-base">
                Product Unit<span className="text-red-500">*</span>
              </h2>

              <Select
                options={units}
                className="border-0 border-gray-200 w-full rounded-sm focus:border-purple-600 "
                name="unit"
                placeholder="e.g : kg / g / liter"
                required
                value={
                  form.unit ? { label: form.unit, value: form.unit } : null
                }
                onChange={(selected) =>
                  setForm({
                    ...form,
                    unit: selected ? selected.value : "",
                  })
                }
              />
            </div>
            <div className="col-span-6">
              <div className="flex justify-between">
                <h2 className="text-base">
                  Stock Quantity<span className="text-red-500">*</span>
                </h2>
                <i
                  className="bi bi-info-circle"
                  data-tooltip-id="tooltipID"
                  data-tooltip-content="Enter the number of product units you are adding (e.g : 10 if you have 10 bags of 5kg atta)."></i>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                name="stockquantity"
                ref={stockRef}
                placeholder="e.g : 10"
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
              {stockquantity ? (
                <>
                  <h2 className="text-sm mt-1">
                    Available Stock Quantity {stockquantity}
                  </h2>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="col-span-6">
              <div className="flex justify-between">
                <h2 className="text-base">SKU</h2>
                <i
                  className="bi bi-info-circle"
                  data-tooltip-id="tooltipID"
                  data-tooltip-content="Auto-generated stock keeping unit (SKU) used to track the product."></i>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="sku"
                placeholder="Auto generated"
                value={form.sku ? form.sku : ""}
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                readOnly={true}
                disabled={true}
              />
            </div>
            <div className="col-span-12">
              <h2 className="text-base">Product Tag Line</h2>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="tag"
                value={form.tag ? form.tag : ""}
                placeholder="e.g : Fresh & Pure Everyday"
                className="p-2 border border-gray-300 w-full rounded-sm focus:border-purple-600"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-12 row-span-10 border border-dotted rounded-2xl flex justify-between items-center px-5">
              {" "}
              <label
                htmlFor="image"
                className="bg-green-200 p-2 text-green-700 rounded-xl flex items-center font-semibold ">
                {" "}
                <Upload className="me-1" /> Upload Product Image{" "}
              </label>{" "}
              {preview ? (
                <Image
                  alt="product image"
                  src={preview}
                  height={150}
                  width={150}
                  className=""
                  loading="eager"
                />
              ) : (
                ""
              )}{" "}
              <input
                type="file"
                accept="image/*"
                id="image"
                hidden
                onChange={handleImageChange}
              />{" "}
            </div>{" "}
            <div className="col-span-12 flex justify-between">
              <button
                className="bg-red-600 hover:bg-red-700 p-2 text-white rounded-lg flex items-center px-6  justify-center"
                type="button"
                onClick={handleResetFrom}>
                Reset
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 p-2 text-white rounded-lg flex items-center px-6  justify-center"
                type="submit">
                {loader?<Loader2 className='animate-spin'/>:"Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddGrocery
