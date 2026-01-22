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
  const markerRef = useRef<mapboxgl.Marker | null>(null);



  // const markerIcon = new L.Icon({
  //   iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  //   iconSize: [40, 40],
  //   iconAnchor: [20, 40],
  // });


useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter([longitude, latitude]);

          // If marker already exists, just update its position
          if (markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude]);
          } else {
            // Create marker for the first time
            markerRef.current = new mapboxgl.Marker({ draggable: true })
              .setLngLat([longitude, latitude])
              .addTo(mapInstanceRef.current)
              .on("dragend", (e) => {
                const lngLat = e.target.getLngLat();
                setSearchQuery('')
                setPosition([lngLat.lat, lngLat.lng]);
              });
          }
        }
      },
      (err) => console.log(`location error ${err}`),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 100000 },
    );
  }
}, []);

    useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: position ? [position[1], position[0]] : [0, 0],
      zoom: 15,
      style: "mapbox://styles/mapbox/streets-v12",
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
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
          address: searchQuery!==''? searchQuery: address.display_name || " ",
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

const handleSearchChange = (value: string) => {
  if (!value) return;

  axios
    .get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value,
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=IN&limit=1`,
    )
    .then((res) => {
      const first = res.data.features[0];
      if (!first) return;

      const [lng, lat] = first.geometry.coordinates;

      // Move existing marker
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else if (mapInstanceRef.current) {
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(mapInstanceRef.current)
          .on("dragend", (e) => {
            const lngLat = e.target.getLngLat();
            setPosition([lngLat.lat, lngLat.lng]);

            // Update form address on drag as well
            setSearchQuery(first.place_name);
            // setForm((prev) => ({
            //   ...prev,
            //   address: first.place_name,
            // }));
          });
      }

      // Center map
      mapInstanceRef.current!.setCenter([lng, lat]);

      // Update position state
      setPosition([lat, lng]);

      // ✅ Update form address
      setSearchQuery(first.place_name);
      // setForm((prev) => ({
      //   ...prev,
      //   address: first.place_name,
      // }));

      // Update search input
      setInputValue(first.place_name);
    })
    .catch((err) => console.log("Geocoding error", err));
};


const handlecurrentLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);

        if (mapInstanceRef.current) {
          // Center map
          mapInstanceRef.current.setCenter([longitude, latitude]);

          // Move existing marker or create if not exists
          if (markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude]);
          } else {
            markerRef.current = new mapboxgl.Marker({ draggable: true })
              .setLngLat([longitude, latitude])
              .addTo(mapInstanceRef.current)
              .on("dragend", (e) => {
                const lngLat = e.target.getLngLat();
                setSearchQuery('')
                setPosition([lngLat.lat, lngLat.lng]);
              });
          }
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
      {/* {searchQuery}
      {JSON.stringify(form?.address)} */}
      <div className="min-h-screen w-full px-5 flex flex-col justify-start items-center bg-gray-100">
        <div className="grid grid-cols-12 w-[70vw] py-15">
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              <div className="relative h-[50vh] w-full p-2 ">
                <div
                  ref={mapContainerRef}
                  className="h-full w-full rounded-lg"
                />
                <div className="absolute top-1 right-0 flex items-center p-2 px-3">
                  <SearchBox
                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                    map={mapInstanceRef.current ?? undefined}
                    mapboxgl={mapboxgl}
                    value={inputValue}
                    onChange={(val) => setInputValue(val)}
                    options={{
                      language: "en",
                      country: "IN",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSearchChange(inputValue)}
                    className="ml-2 p-2 bg-green-600 text-white rounded-md">
                    <Search/>
                  </button>
                </div>
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
              </div>

              {/* ---- ALL YOUR FORM FIELDS ABOVE KEPT AS IT IS ---- */}
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
                {/* onClick={handleOrder}  */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleOrder}
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

export default page;
