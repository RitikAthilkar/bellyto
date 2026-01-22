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

const page = () => {
  const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false },
  );

  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subtotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchloader, setSearchLoader] = useState(false);

  const [form, setForm] = useState<IDelivery>({
    name: "Fetching...",
    mobile: "Fetching...",
    address: "Fetching...",
    city: "Fetching...",
    state: "Fetching...",
    pincode: "Fetching...",
  });

  const [inputValue, setInputValue] = useState("");

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [72.8777, 19.076],
      zoom: 13,
      style: "mapbox://styles/mapbox/streets-v12",
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // const markerIcon = new L.Icon({
  //   iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  //   iconSize: [40, 40],
  //   iconAnchor: [20, 40],
  // });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter([longitude, latitude]);
            new mapboxgl.Marker({ draggable: true })
              .setLngLat([longitude, latitude])
              .addTo(mapInstanceRef.current)
              .on("dragend", function (e) {
                const lngLat = e.target.getLngLat();
                setPosition([lngLat.lat, lngLat.lng]);
              });
          }
        },
        (err) => {
          console.log(`location error ${err}`);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 100000 },
      );
    }
  }, []);

  useEffect(() => {
    const FetchAddress = async () => {
      if (!position) return;
      if (!userData) return;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        const address = response.data;
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
    };
    FetchAddress();
  }, [position, userData]);

  // const DraggableMarker:React.FC=()=>{
  //         const map = useMap()
  //         useEffect(()=>{
  //          map.setView(position as LatLngExpression,15,{animate:true})
  //         },[position,map])
  //     return (
  //       <>
  //         <Marker icon={markerIcon} position={position as LatLngExpression} draggable={true}
  //          eventHandlers={{
  //             dragend:(e:L.LeafletEvent)=>{
  //                const marker = e.target as L.Marker
  //                const {lat,lng} = marker.getLatLng()
  //                setPosition([lat,lng])
  //             }
  //          }}
  //         />
  //       </>
  //     );
  // }

  const handleSearch = async () => {
    // setSearchLoader(true)
    // const provider = new OpenStreetMapProvider();
    // const results = await provider.search({ query: searchQuery });
    // if(results){
    //     setSearchLoader(false)
    //     setPosition([results[0].y,results[0].x])
    // }
  };

  const handlecurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter([longitude, latitude]);
          }
        },
        (err) => {
          console.log(`location error ${err}`);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 100000 },
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOrder = async () => {
    if (!userData || !cartData || !form || !position) return;
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
      if (response.status == 200) {
        router.push("/user/order-placed");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="min-h-screen w-full px-5 flex flex-col justify-start items-center bg-gray-100">
        <div className="grid grid-cols-12 w-[80vw] py-15">
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              <div className="relative flex items-center p-2 px-3">
                <SearchBox
                  accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                  map={mapInstanceRef.current ?? undefined}
                  mapboxgl={mapboxgl}
                  value={inputValue}
                  onChange={(d) => setInputValue(d)}
                  marker
                  options={{
                    language: "en",
                    country: "IN",
                  }}
                />
              </div>

              <div className="relative h-[40vh] w-full p-2 ">
                <div
                  ref={mapContainerRef}
                  className="h-full w-full rounded-lg"
                />

                <motion.button
                  onClick={handlecurrentLocation}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  className="absolute right-2 bottom-2 bg-green-600 text-xl z-50 p-2 text-white rounded-full">
                  <LocateFixed />
                </motion.button>
              </div>

              {/* ---- ALL YOUR FORM FIELDS BELOW KEPT AS IT IS ---- */}

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
              </div>

              {/* ---- ALL YOUR FORM FIELDS ABOVE KEPT AS IT IS ---- */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
