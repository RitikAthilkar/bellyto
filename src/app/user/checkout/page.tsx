'use client'
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L,{ LatLngExpression } from "leaflet";
import { RootState } from '@/redux/store';
import { BuildingIcon, EarthIcon, HomeIcon, Loader2, LocateFixed, LocationEditIcon, Phone, Search, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { MdDeliveryDining } from "react-icons/md";
import dynamic from "next/dynamic";
import axios from "axios";
import {motion} from 'motion/react'
import { OpenStreetMapProvider } from "leaflet-geosearch";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
     const { cartData, subtotal, deliveryFee, finalTotal } = useSelector(
       (state: RootState) => state.cart
     );

     const router = useRouter()
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

    const notify = (msg: string) => toast(msg);
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


    const handleOrder = async ()=>{
          if(!userData || !cartData || !form || !position)return
    

          try {
             const response = await axios.post("/api/order", {
               userId: userData._id,
               items: cartData.map((i) => ({
                 product: i._id,
                 name: i.name,
                 sku: i.sku,
                 description: i.description,
                 category: i.category,
                 subcategory: i.subcategory,
                 brand: i.brand,
                 price: i.price,
                 mrp: i.mrp,
                 unitquantity: i.unitquantity,
                 unit: i.unit,
                 image: i.image,
                 stockquantity: i.stockquantity,
                 cartquantity: i.cartquantity,
                 discountpercent: i.discountpercent,
                 tag: i.tag,
               })),
               address: {
                 name: form.name,
                 mobile: form.mobile,
                 fulladdress: form.address,
                 city: form.city,
                 state: form.state,
                 pincode: form.pincode,
                 latitude: position[0],
                 longitude: position[1],
               },
               totalAmount: finalTotal,
               paymentMethod: "cod",
               status: "pending",
               paymentStatus: false,
             });
             if(response.status==200){
                  router.push("/user/order-placed")

             }
          } catch (error) {
            
          }
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
      <div className="min-h-screen w-full px-5 flex flex-col justify-start items-center bg-gray-100">
        <div className="grid grid-cols-12 w-[80vw] py-15">
          <div className="relative col-span-12 flex justify-center items-center mb-3">
            <h3 className="text-3xl font-semibold text-black">CHECKOUT</h3>
            <h3 className="absolute left-0 text-base text-black font-semibold">
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
                <div className="relative flex items-center p-2 px-3">
                  <div className="relative flex items-center  w-full me-1  ">
                    <Search className="absolute top-3 left-4 text-gray-500 h-5" />
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
                <div className="relative h-[40vh] w-full p-2 ">
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
                    value={form ? form.address : ""}
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
                </div>
              </form>
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

                <button onClick={handleOrder} type="button" className="bg-green-600 rounded-full p-2 text-lg text-white w-full mt-2">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page
