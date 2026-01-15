'use client'
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L,{ LatLngExpression } from "leaflet";
import { RootState } from '@/redux/store';
import { BuildingIcon, EarthIcon, HomeIcon, Loader2, LocateFixed, LocationEditIcon, Phone, Search, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import dynamic from "next/dynamic";
import axios from "axios";
import {motion} from 'motion/react'
import { OpenStreetMapProvider } from "leaflet-geosearch";
interface IDelivery{
    _id?:string,
    name:string  ,
    mobile:string ,
    address:string,
    city:string,
    state:string,
    pincode:string,
}
const page = () => {
    const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
    );
    const {userData} = useSelector((state:RootState)=>state.user)
    const [searchQuery, setSearchQuery] = useState("")
    const [position, setPosition] = useState<[number,number] | null>(null)
    const [searchloader, setSearchLoader] = useState(false)
        const [form, setForm] = useState<IDelivery>({
          name: "Fetching...",
          mobile: "Fetching...",
          address: "Fetching...",
          city: "Fetching...",
          state: "Fetching...",
          pincode: "Fetching...",
        });
    const markerIcon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                const {latitude, longitude} = position.coords 
                setPosition([latitude,longitude])
            },(err)=>{console.log(`location error ${err}`)},{enableHighAccuracy:true,maximumAge:0,timeout:100000})
        }
    },[])

    useEffect(()=>{
      const FetchAddress = async()=>{
          if(!position)return
          if(!userData)return
          try {
             const response = await axios.get(
               `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
             );
             const address = response.data
             console.log("loction", response.data)
             setForm({
               ...form,
               name: userData.name,
               mobile: userData.mobile || "",
               address: address.display_name,
               city: address.address.state_district,
               state: address.address.state,
               pincode: address.address.postcode,
             });
          } catch (error) {
            console.log("loction api error", error);
          }
      }
      FetchAddress();
    },[position,userData])

    const DraggableMarker:React.FC=()=>{
            const map = useMap()
            useEffect(()=>{
             map.setView(position as LatLngExpression,15,{animate:true})
            },[position,map])
        return (
          <>
            <Marker icon={markerIcon} position={position as LatLngExpression} draggable={true} 
             eventHandlers={{
                dragend:(e:L.LeafletEvent)=>{
                   const marker = e.target as L.Marker
                   const {lat,lng} = marker.getLatLng()
                   setPosition([lat,lng])
                }
             }}
            />
          </>
        );
    }

    const handleSearch= async()=>{
        setSearchLoader(true)
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchQuery });
        if(results){
            setSearchLoader(false)
            setPosition([results[0].y,results[0].x])
        }
    }

    const handlecurrentLocation= async()=>{
         if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(
             (position) => {
               const { latitude, longitude } = position.coords;
               setPosition([latitude, longitude]);
             },
             (err) => {
               console.log(`location error ${err}`);
             },
             { enableHighAccuracy: true, maximumAge: 0, timeout: 100000 }
           );
         }
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
       const {name,value}=e.target
       setForm({
        ...form,
        [name]:value
       })
    }

    // useEffect(()=>{
    //     if(!userData)return
    //     setForm({
    //        ...form,
    //        name:userData.name,
    //        mobile:userData.mobile || "",
    //     })
    // },[userData])
  return (
    <>
      <div className="min-h-screen w-full px-5 flex flex-col justify-start items-center bg-linear-to-t from-green-700 to-green-500">
        <div className="grid grid-cols-12 w-[80vw] py-15">
          <div className="relative col-span-12 flex justify-center items-center mb-3">
            <h3 className="text-3xl font-semibold text-white">CHECKOUT</h3>
            <h3 className="absolute left-0 text-base text-white font-semibold">
              <i className="bi bi-arrow-left me-1"></i>Go Back
            </h3>
            {/* <h3 className="text-xl font-semibold">{JSON.stringify(form)}</h3> */}
          </div>
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              <h2 className="text-lg font-semibold">
                <i className="bi bi-geo-alt-fill me-2"></i>Delivery Address
              </h2>
              <form>
                <div className="relative flex items-center  w-full p-3">
                  <User className="absolute left-5 text-gray-500 h-5" />
                  <input
                    className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    type="text"
                    value={form.name ? form.name : ""}
                    placeholder="Your Name"
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative flex items-center  w-full p-3">
                  <Phone className="absolute left-5 text-gray-500 h-5" />
                  <input
                    className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    type="text"
                    value={form ? form.mobile : ""}
                    placeholder="Mobile Number"
                    name="mobile"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative flex items-center  w-full p-3">
                  <HomeIcon className="absolute top-5.5 left-5 text-gray-500 h-5" />
                  <textarea
                    className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    placeholder="Address"
                    name="address"
                    value={form ? form.address : ""}
                    onChange={handleChange}
                    required></textarea>
                </div>
                <div className="grid grid-cols-12 p-2 w-full">
                  <div className="col-span-4 p-1">
                    <div className="relative flex items-center  w-full  ">
                      <BuildingIcon className="absolute left-4 text-gray-500 h-5" />
                      <input
                        className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        type="text"
                        placeholder="City"
                        name="city"
                        value={form ? form.city : ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-4 p-1">
                    <div className="relative flex items-center  w-full ">
                      <LocationEditIcon className="absolute left-4 text-gray-500 h-5" />
                      <input
                        className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        type="text"
                        value={form ? form.state : ""}
                        placeholder="State"
                        name="city"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4 p-1">
                    <div className="relative flex items-center  w-full ">
                      <EarthIcon className="absolute left-4 text-gray-500 h-5" />
                      <input
                        className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        type="text"
                        placeholder="Pincode"
                        name="state"
                        value={form ? form.pincode : ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-12 p-1 px-0 flex">
                    <div className="relative flex items-center  w-full p-3 px-1">
                      <Search className="absolute top-5.5 left-4 text-gray-500 h-5" />
                      <input
                        type="text"
                        placeholder="Search Location"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        className="border pl-12  p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                    <button
                      className="p-2 bg-green-600 text-white rounded-lg m-3 mx-0"
                      type="button"
                      onClick={handleSearch}>
                      {searchloader ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative h-[40vh]">
                  {position &&
                    (!searchloader ? (
                      <>
                        <MapContainer
                          center={position as LatLngExpression}
                          zoom={13}
                          scrollWheelZoom={true}
                          className="h-full w-full rounded-lg">
                          <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <DraggableMarker />
                        </MapContainer>

                        <motion.button
                          onClick={handlecurrentLocation}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          className="absolute right-2 bottom-2 bg-green-600 text-xl z-99999 p-2 text-white rounded-full">
                          <LocateFixed />
                        </motion.button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="animate-spin text-xl" />
                        <h3 className="text-lg">Loading</h3>
                      </div>
                    ))}
                </div>
              </form>
            </div>
          </div>
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              <h2 className="text-lg font-semibold">
                <i className="bi bi-credit-card-2-back-fill text-xl me-2"></i>Payment Method
              </h2>
              <form>
                <div className="relative flex items-center  w-full p-3">
                  <User className="absolute left-5 text-gray-500 h-5" />
                  <input
                    className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    type="text"
                    value={form.name ? form.name : ""}
                    placeholder="Your Name"
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative flex items-center  w-full p-3">
                  <Phone className="absolute left-5 text-gray-500 h-5" />
                  <input
                    className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    type="text"
                    value={form ? form.mobile : ""}
                    placeholder="Mobile Number"
                    name="mobile"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative flex items-center  w-full p-3">
                  <HomeIcon className="absolute top-5.5 left-5 text-gray-500 h-5" />
                  <textarea
                    className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    placeholder="Address"
                    name="address"
                    value={form ? form.address : ""}
                    onChange={handleChange}
                    required></textarea>
                </div>
                <div className="grid grid-cols-12 p-2 w-full">
                  <div className="col-span-4 p-1">
                    <div className="relative flex items-center  w-full  ">
                      <BuildingIcon className="absolute left-4 text-gray-500 h-5" />
                      <input
                        className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        type="text"
                        placeholder="City"
                        name="city"
                        value={form ? form.city : ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-4 p-1">
                    <div className="relative flex items-center  w-full ">
                      <LocationEditIcon className="absolute left-4 text-gray-500 h-5" />
                      <input
                        className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        type="text"
                        value={form ? form.state : ""}
                        placeholder="State"
                        name="city"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4 p-1">
                    <div className="relative flex items-center  w-full ">
                      <EarthIcon className="absolute left-4 text-gray-500 h-5" />
                      <input
                        className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        type="text"
                        placeholder="Pincode"
                        name="state"
                        value={form ? form.pincode : ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-12 p-1 px-0 flex">
                    <div className="relative flex items-center  w-full p-3 px-1">
                      <Search className="absolute top-5.5 left-4 text-gray-500 h-5" />
                      <input
                        type="text"
                        placeholder="Search Location"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        className="border pl-12  p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                    <button
                      className="p-2 bg-green-600 text-white rounded-lg m-3 mx-0"
                      type="button"
                      onClick={handleSearch}>
                      {searchloader ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative h-[40vh]">
                  {position &&
                    (!searchloader ? (
                      <>
                        <MapContainer
                          center={position as LatLngExpression}
                          zoom={13}
                          scrollWheelZoom={true}
                          className="h-full w-full rounded-lg">
                          <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <DraggableMarker />
                        </MapContainer>

                        <motion.button
                          onClick={handlecurrentLocation}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          className="absolute right-2 bottom-2 bg-green-600 text-xl z-99999 p-2 text-white rounded-full">
                          <LocateFixed />
                        </motion.button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="animate-spin text-xl" />
                        <h3 className="text-lg">Loading</h3>
                      </div>
                    ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page
