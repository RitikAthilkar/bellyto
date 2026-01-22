"use client";
// import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
// import L,{ LatLngExpression } from "leaflet";
import { SearchBox } from "@mapbox/search-js-react";
import { RootState } from "@/redux/store";
import {
  BuildingIcon,
  EarthIcon,
  HomeIcon,
  Loader2,
  LocateFixed,
  LocationEditIcon,
  Phone,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MdDeliveryDining } from "react-icons/md";
import dynamic from "next/dynamic";
import axios from "axios";
import { motion, spring } from "motion/react";
// import { OpenStreetMapProvider } from "leaflet-geosearch";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import LiveMap from "../LiveMap";
import { getSocket } from "@/config/websocket";

interface IDelivery {
  _id?: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const ActiveAssignment = () => {
  const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false },
  );

  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subtotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  const router = useRouter();

  const [form, setForm] = useState<IDelivery>({
    name: "Fetching...",
    mobile: "Fetching...",
    address: "Fetching...",
    city: "Fetching...",
    state: "Fetching...",
    pincode: "Fetching...",
  });

  interface ILocation{
    latitude:number,
    longitude:number
  }
  const [userLocation, setUserLocaton] = useState<ILocation>({ latitude:0,longitude:0});
  const [deliveryboyLocation, setdeliveryboyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [assignment, setAssignment] = useState([]);




  const GetCurrentLocation = async()=>{
    try {

      const response = await axios.get('api/deliveryboy/current-assignment')
      if(response.status==200){
        setAssignment(response.data)
        setUserLocaton({
          latitude:response.data.order.address[0].latitude,
          longitude:response.data.order.address[0].longitude,
      });
        }
    } catch (error) {
      
    }
  }
    useEffect(() => {
      const socket = getSocket()
      if (!userData?._id) return;
      if (!navigator.geolocation) return;
      socket.emit("identity", userData?._id);
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;

          setdeliveryboyLocation({
            latitude:lat,
            longitude:long
        })

          socket.emit("update-location", {
            userId: userData?._id,
            latitude: lat,
            longitude: long,
          });
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true },
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }, [userData?._id]);


  useEffect(()=>{
    GetCurrentLocation()
  },[])


  return (
    <>
      {/* {JSON.stringify(userLocation)} */}
      {/* {JSON.stringify(assignment)} */}
      <div className="min-h-screen w-full px-5 flex flex-col justify-start items-center bg-gray-100">
        <div className="grid grid-cols-12 w-[70vw] py-15">
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              <LiveMap userLocation={userLocation} deliveryboylocation = {deliveryboyLocation} />
              {/* 
              <div className="relative flex items-center  w-full p-2 px-3">
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

              <div className="relative flex items-center  w-full p-2 px-3">
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

              <div className="relative flex items-center  w-full p-2 px-3">
                <HomeIcon className="absolute top-5.5 left-5 text-gray-500 h-5" />
                <textarea
                  className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Address"
                  name="address"
                  value={searchQuery !== "" ? searchQuery : form?.address || ""}
                  onChange={handleChange}
                  required></textarea>
              </div>

              <div className="grid grid-cols-12 p-2  w-full">
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
                      name="state"
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
                      name="pincode"
                      value={form ? form.pincode : ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              <h2 className="text-lg font-semibold">
                <i className="bi bi-credit-card-2-back-fill text-xl me-2"></i>
                Payment Method
              </h2>
              <form>
                <div className="mt-5 rounded-2xl    border border-gray-200 p-3">
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
                <h2 className="font-bold text-lg mt-4 mb-0 px-2">
                  Payment Mode
                </h2>
                <div className="flex justify-between items-center">
                  <div className="relative flex items-center  w-full p-3">
                    {/* <User className="absolute left-5 text-gray-500 h-5" /> */}
                    <div className="absolute left-5 text-gray-500 ">
                      <div className="relative h-10 w-12">
                        <Image
                          src="https://cdn-icons-png.flaticon.com/128/16174/16174534.png"
                          alt="image"
                          fill
                        />
                      </div>
                    </div>
                    <button className="border border-gray-300 hover:bg-gray-100  p-4 rounded-lg w-full">
                      Pay Online
                    </button>
                  </div>{" "}
                  <div className="relative flex items-center  w-full p-3">
                    {/* <User className="absolute left-5 text-gray-500 h-5" /> */}
                    <div className="absolute left-5 text-gray-500 ">
                      <div className="relative h-10 w-12">
                        <Image
                          src="https://cdn-icons-png.flaticon.com/128/6491/6491623.png"
                          alt="image"
                          fill
                        />
                      </div>
                    </div>
                    <button className="border border-gray-300 hover:bg-gray-100   p-4 rounded-lg w-full">
                      Cash On Delivery
                    </button>
                  </div>
                </div>
       
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"

                  className="bg-green-600 hover:bg-green-700 rounded-full p-2 text-lg text-white w-full mt-2">
                  Place Order
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveAssignment;
